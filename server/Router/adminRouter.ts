import { app } from "../app";
import { Document, Model, model, Schema } from "mongoose";
import * as multer from "multer";
import { User } from "../API/Accounts/Models/user";
import { createUser } from "../Services/auth";

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith("image/");
    if (isPhoto) {
      next(null, true);
    } else {
      next(new Error("That filetype isn't allowed!"), false);
    }
  }
});

// app.get('/admin', (req, res) => {
//   console.log('This is the User Model: ', User);
//   res.render('index', { title: 'Admin Panel', message: 'Welcome to the Thunderdome!' });
// });

// app.get('/admin/home', (req, res) => {
//   res.render('adminHome', { title: 'Admin Panel', message: 'Welcome to the Admin Home!' });
// });

// Built to match either:
// 'function Number() { [native code] }'
// 'function Buffer(args, randomParam) { [native code] }'
// and yield the Number() or Buffer(args, randomParam) which will
// then be split on ('(') to obtain the schema field type
const schemaFieldTypeRegEx = /[A-Z][a-z]+\(((\w+,\s)+(\w+))?\)/;
class AdminSite {
  private registry: object = {};

  public register = (modelName: string, schema: Schema): void => {
    const schemaProperties: string[] = this.getSchemaProperties(schema);
    const schemaTypes: object[] = this.getSchemaFieldTypes(
      schema,
      schemaProperties
    );
    // console.log("THESE ARE THE schemaProperties: ", schemaProperties);
    // console.log("THESE ARE THE schemaTypes: ", schemaTypes);
    // I could probably just make use of schemaTypes now and then access the
    // .field key to get the same information as schemaProperties.
    // Will need to ensure that this won't be a hassle.
    this.registry[modelName] = schemaTypes;
  };

  public getSchemaProperties = (schema: Schema): string[] => {
    return Object.getOwnPropertyNames(schema.obj);
  };

  public getSchemaFieldTypes = (
    schema: Schema,
    schemaProperties: string[]
  ): object[] => {
    const results = schemaProperties.map(prop => {
      const target = schema.obj[prop];
      let result;
      if (target.hasOwnProperty("ref")) {
        result = target.ref.toString();
      } else {
        const schemaStringFieldTypeToFilter: string = target.type.toString();
        // schemaStringFieldTypeToFilter yields string formats:
        // 'function Number() { [native code] }'
        // 'function Date() { [native code] }'
        if (typeof schemaStringFieldTypeToFilter === "string") {
          const filteredStr: string[] = (schemaFieldTypeRegEx as any)
            .exec(schemaStringFieldTypeToFilter)[0]
            .split("(");
          result = filteredStr[0];
        }
      }
      if (target.required) {
        return { fieldName: prop, type: result, required: true };
      }
      return { fieldName: prop, type: result };
    });
    // console.log("THIS IS THE RESULTS FROM GET SCHEMA FIELD TYPES: ", results);
    // logs out the string in the format of:
    // 'function Number() { [native code] }'
    // 'function Date() { [native code] }'
    // Add an image field to product and see what it's return type is
    // This information is necessary for programmatically generating
    // the necessary form input fields for models in modelCreate.pug
    return results;
  };

  public logRegistry = (): void => {
    console.log("Feast your eyes on the registry!!!!!");
    console.log(this.registry);
  };

  public createRoutes = () => {
    app.get("/testing", async (req, res) => {
      const userList = await User.find({}).then(users => users);
      console.log("typeof UserList: ", typeof userList);
      userList.map(user => {
        console.log("users email: ", user.email);
      });
    });

    const modelNames = Object.getOwnPropertyNames(this.registry);
    app.get("/admin", (req, res) => {
      res.render("adminHome", {
        title: "Admin Panel",
        dBSchemaNames: modelNames
      });
    });

    this.generateListViews(modelNames);
    this.generateDetailViews(modelNames);
    this.generateCreateModelViews(modelNames);
    this.createModelPostView();
    this.createModelMultiPostView();
  };

  // Can make an interface for the return type.
  public mapMongoDocuments = (
    key: string,
    documents: Document[],
    mapFunc: any
  ): object[] => {
    return documents.map(document => mapFunc(key, document));
  };

  public decideMapFunc = (key: string, documents: Document[]) => {
    if (key === "User") {
      return this.mapMongoDocuments(key, documents, this.filterUserPassword);
    } else {
      return this.mapMongoDocuments(key, documents, this.mapWithoutFiltering);
    }
  };

  public mapWithoutFiltering = (key: string, document: Document) => {
    // CAN COME BACK TO FIX THE ITEM.FIELDNAME TO REMOTE _'s W/ STRING MANIP.
    const modelFieldValues = this.registry[key].map(item => [
      item.fieldName,
      document[item.fieldName]
    ]);
    return { id: document._id, modelFieldValues };
  };

  public filterUserPassword = (key: string, document: Document) => {
    // Can add array type later [string | number] + others which line up with Mongoose schema types
    const modelFieldValuesToKeep = this.registry[key].filter(
      item => item.fieldName !== "password"
    );
    // CAN COME BACK TO FIX THE ITEM.FIELDNAME TO REMOTE _'s W/ STRING MANIP.
    const modelFieldValues = modelFieldValuesToKeep.map(item => [
      item.fieldName,
      document[item.fieldName]
    ]);
    return { id: document._id, modelFieldValues };
  };

  // Need to add the option to delete or update in the list view
  public generateListViews = (modelNames: string[]): void => {
    modelNames.map((key: string) => {
      return app.get(`/admin/${key.toLowerCase()}/list`, async (req, res) => {
        const documents: Document[] = await this.getModelClass(key)
          .find({})
          .then((results: Document[]) => results);
        const models: object[] = this.decideMapFunc(key, documents);
        console.log("HERE ARE THE MODELS AFTER DECIDE MAP FUNC!!: ", models);
        res.render("modelList", {
          title: "Admin Panel",
          modelList: models,
          modelKey: key
        });
      });
    });
  };

  public generateDetailViews = (modelNames: string[]): void => {
    modelNames.map((key: string) => {
      return app.get(
        `/admin/${key.toLowerCase()}/detail/:model`,
        async (req, res) => {
          const modelId = req.params.model;
          const document: Document = await this.getModelClass(key)
            .findById({ _id: modelId })
            .then(result => result);
          const documentFields =
            key === "User"
              ? this.filterUserPassword(key, document)
              : this.mapWithoutFiltering(key, document);
          // console.log("HERE ARE THE documentFields: ", documentFields);
          res.render("modelDetail", {
            title: "Admin Panel",
            modelFieldNames: this.registry[key].filter(
              item => item.fieldName !== "password"
            ),
            documentModel: documentFields.modelFieldValues.filter(
              val => typeof val !== "undefined"
            )
          });
        }
      );
    });
  };

  public generateCreateModelViews = (modelNames: string[]): void => {
    // This will require a decent amount of planning to account
    // for the different field types that are required.
    modelNames.map((key: string) => {
      return app.get(`/admin/${key.toLowerCase()}/create`, (req, res) => {
        res.render("modelCreate", {
          title: "Admin Model Create",
          dBModelName: key,
          shemaObjects: this.registry[key].map(item => item),
          multipartForm: this.registry[key].filter(
            item => item.fieldName === "image" && item.type === "Buffer"
          )
        });
      });
    });
  };

  // Could use some clean up
  public createModelPostView = (): void => {
    app.post(`/admin/create/:modelName`, async (req, res) => {
      const modelName = req.params.modelName;
      if (modelName === "User") {
        const { email, password } = req.body;
        const userCreated = await createUser(email, password);
        if (userCreated) {
          res.status(200).redirect(`/admin/${modelName.toLowerCase()}/create`);
        } // handle save fail
      } else {
        const modelClass = this.getModelClass(modelName);
        const modelInstance = new modelClass(req.body);
        console.log("THE MODEL INSTANCE: ", req.body);
        const modelSaved = await modelInstance.save();
        console.log("THE MODEL SAVED RESULT: ", modelSaved);
        if (modelSaved) {
          res.status(200).redirect(`/admin/${modelName.toLowerCase()}/create`);
        } // Handle failed save.
      }
      // console.log("THE REQUEST BODY: ", req.body);
      // console.log("SUCCESS creating: ", modelClass);
    });
  };

  public createModelMultiPostView = (): void => {
    const cpUpload = upload.array("image-upload", 10);
    app.post(`/admin/create/multi/:modelName`, cpUpload, async (req, res) => {
      const modelName = req.params.modelName;
      const bufferArr = (req.files as any).map(photoObj => {
        return photoObj.buffer;
      });
      // console.log("THE IMAGES! ", bufferArr);
      // console.log("THE REST OF THE FORM VALUES: ", req.body);

      // Yeah... This didn't work. Will need to look into
      // Saving the filepath in the db, and using that as a reference.
      // The plus side to that is the option to do image resizing.
      req.body.image = bufferArr;
      const modelClass = this.getModelClass(modelName);
      const modelInstance = new modelClass(req.body);
      console.log("THE MODEL INSTANCE: ", req.body);
      const modelSaved = await modelInstance.save();
      console.log("THE MODEL SAVED RESULT: ", modelSaved);
      if (modelSaved) {
        res.status(200).redirect(`/admin/${modelName.toLowerCase()}/create`);
      }
    });
  };

  public getModelClass(modelClassName: string): Model<any> {
    return model(modelClassName);
  }
}

export const site = new AdminSite();
