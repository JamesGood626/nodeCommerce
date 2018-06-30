import { app } from '../index';
import { Document, Model, model, Schema } from 'mongoose';
import { User } from '../API/Accounts/Models/user';

// app.get('/admin', (req, res) => {
//   console.log('This is the User Model: ', User);
//   res.render('index', { title: 'Admin Panel', message: 'Welcome to the Thunderdome!' });
// });

// app.get('/admin/home', (req, res) => {
//   res.render('adminHome', { title: 'Admin Panel', message: 'Welcome to the Admin Home!' });
// });

class AdminSite {
  private registry: object = {};

  public register = (modelName: string, schema: Schema): void => {
    const schemaProperties: string[] = this.getSchemaProperties(schema);
    this.registry[modelName] = schemaProperties;
  }

  public getSchemaProperties = (schema: Schema): string[] => {
    return Object.getOwnPropertyNames(schema.obj);
  }

  public logRegistry = (): void => {
    console.log('Feast your eyes on the registry!!!!!');
    console.log(this.registry);
  }

  public createRoutes = () => {
    app.get('/testing', async (req, res) => {
      const userList = await User.find({}).then((users) => users);
      console.log("typeof UserList: ", typeof userList);
      userList.map((user) => {
        console.log("users email: ", user.email);
      });
    });

    const schemaNames = Object.getOwnPropertyNames(this.registry);
    app.get('/admin', (req, res) => {
      res.render(
        'adminHome',
        { title: 'Admin Panel', dBSchemaNames: schemaNames }
      );
    });

    this.generateListViews(schemaNames);
    this.generateDetailViews(schemaNames);
  }

  // Can make an interface for the return type.
  public mapMongoDocuments = (key: string, documents: Document[], mapFunc: any): object[] => {
    return documents.map((document) => mapFunc(key, document));
  }

  public decideMapFunc = (key: string, documents: Document[]) => {
    if (key === 'User') {
      return this.mapMongoDocuments(key, documents, this.filterUserPassword);
    } else {
      return this.mapMongoDocuments(key, documents, this.mapWithoutFiltering);
    }
  }

  public mapWithoutFiltering = (key: string, document: Document) => {
    const modelFieldValues = this.registry[key].map((modelProperty) => document[modelProperty]);
    return { id: document._id, modelFieldValues };
  }

  public filterUserPassword = (key: string, document: Document) => {
    // Can add array type later [string | number] + others which line up with Mongoose Schema types
    const modelFieldValues = this.registry[key].map((modelProperty) => {
      if (modelProperty !== 'password') { return document[modelProperty]; }
    });
    return { id: document._id, modelFieldValues };
  }

  public generateListViews = (schemaNames: string[]): void => {
    schemaNames.map((key: string) => {
      return app.get(`/${ key.toLowerCase() }/list`, async (req, res) => {
        const documents: Document[] = await this.getModelClass(key).find({}).then((results: Document[]) => results);
        const models: object[] = this.decideMapFunc(key, documents);
        res.render(
          'modelList',
          {
            title: 'Admin Panel',
            modelList: models,
            modelKey: key.toLowerCase()
          }
        );
      });
    });
  }

  public generateDetailViews = (schemaNames: string[]): void => {
    schemaNames.map((key: string) => {
      return app.get(`/${ key.toLowerCase() }/detail/:model`, async (req, res) => {
        console.log("BEFORE THE REQ.PARAMS REQUEST");
        const modelId = req.params.model;
        const document: Document = await this.getModelClass(key).findById({ _id: modelId }).then((result) => result);
        const documentFields = key === 'User'
                               ?  this.filterUserPassword(key, document)
                               : this.mapWithoutFiltering(key, document);
        // console.log("THIS IS THE MODEL DETAIL OBJ: ", document);
        // console.log("AND THIS IS THE DOCUMENT FIELDS AFTER MAP: ", documentFields);
        res.render(
          'modelDetail',
          { title: 'Admin Panel', modelFieldNames: this.registry[key], documentModel: documentFields.modelFieldValues }
        );
      });
    });
  }

  public getModelClass(modelClassName: string): Model<any> {
    return model(modelClassName);
  }
}

export const site = new AdminSite();
