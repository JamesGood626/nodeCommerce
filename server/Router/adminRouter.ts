import { app } from "../app";
import * as AWS from "aws-sdk";
import * as uuidv4 from "uuid/v4";
import { Document, Model, model, Schema } from "mongoose";
import * as multer from "multer";
import * as jimp from "jimp";
import { User } from "../API/Accounts/Models/user";
import { createUser, adminUpdatePassword } from "../Services/auth";
import {
  BUCKET_NAME,
  IAM_USER_KEY,
  IAM_USER_SECRET
} from "../Config/aws-config";

// TODO
// Image Upload
// Testing
// Refactor

const uploadToS3 = (photoBuffer, photoName) => {
  const s3 = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET
  });
  s3.createBucket(() => {
    const params = {
      Bucket: BUCKET_NAME,
      Key: `product-images/${photoName}`,
      Body: photoBuffer
    };
    s3.upload(params, (err, data) => {
      if (err) {
        console.log("Error in s3Bucket.upload callback");
        console.log(err);
      }
      console.log("Success");
      console.log(data);
    });
  });
};

const retrieveFromS3 = photoRoute => {
  const s3 = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET
  });
  s3.createBucket(() => {
    const params = {
      Bucket: BUCKET_NAME,
      Key: photoRoute
    };
    s3.getObject(params, (err, data) => {
      if (err) {
        console.log("Error in s3Bucket.getObject callback");
        console.log(err);
      }
      console.log("Success");
      console.log(data);
    });
  });
};

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

  // NOT GOING TO WORRY ABOUT RENDERING IMAGE TO THE PAGE RIGHT NOW.
  // CAN FOCUS ON THAT AFTER DOING A MAJOR REFACTOR AND RAISING TEST COVERAGE.
  public createRoutes = () => {
    app.get("/testing", async (req, res) => {
      const imageRoute: string = await this.getModelClass("Product")
        .findOne({ name: "Brown Belt" })
        .then(result => `product-images/${result.image}`);
      console.log("Here be the result! ", imageRoute);
      // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      // SUCESSFULLY RETRIEVES THE IMAGE :O
      // !!!!!!!!!!!!!!!!!!!!!!!!!!!!
      // !!!!!!!!!!!!!!!!!!!!!!!!!!!!
      //        Here be the result!  product-images/f0bdc8f5-f335-4365-a616-4e5953286234.jpeg
      // [0] Success
      // [0] { AcceptRanges: 'bytes',
      // [0]   LastModified: 2018-07-23T04:28:04.000Z,
      // [0]   ContentLength: 461186,
      // [0]   ETag: '"e5212132390bf66e0eb322f9d59dee5e"',
      // [0]   ContentType: 'application/octet-stream',
      // [0]   ServerSideEncryption: 'AES256',
      // [0]   Metadata: {},
      // [0]   Body: <Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 00 00 01 00 01 00 00 ff db 00 84 00 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 01 ... > }
      retrieveFromS3(imageRoute);
      // const userList = await User.find({}).then(users => users);
      // console.log("typeof UserList: ", typeof userList);
      // userList.map(user => {
      //   console.log("users email: ", user.email);
      // });
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
    this.createModelMultiPostView(this.resize);
    this.updateModelView();
    this.updateModelPostView();
    this.deleteModelPostView();
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
    modelNames.map((modelName: string) => {
      return app.get(
        `/admin/${modelName.toLowerCase()}/list`,
        async (req, res) => {
          const documents: Document[] = await this.getModelClass(modelName)
            .find({})
            .then((results: Document[]) => results);
          const models: object[] = this.decideMapFunc(modelName, documents);
          // console.log(
          //   "HERE ARE THE MODEL FIELD VALUES AFTER DECIDE MAP FUNC!!: ",
          //   (models[0] as any).modelFieldValues
          // );
          res.render("modelList", {
            title: "Admin Panel",
            modelList: models,
            modelName,
            multipartForm: this.registry[modelName].filter(
              item => item.fieldName === "image"
            )
          });
        }
      );
    });
  };

  public generateDetailViews = (modelNames: string[]): void => {
    modelNames.map((modelName: string) => {
      return app.get(
        `/admin/${modelName.toLowerCase()}/detail/:model`,
        async (req, res) => {
          const modelId = req.params.model;
          const document: Document = await this.getModelClass(modelName)
            .findById({ _id: modelId })
            .then(result => result);
          const documentFields =
            modelName === "User"
              ? this.filterUserPassword(modelName, document)
              : this.mapWithoutFiltering(modelName, document);
          // console.log("HERE ARE THE documentFields: ", documentFields);
          res.render("modelDetail", {
            title: "Admin Panel",
            modelId,
            modelName,
            userEmail: this.registry[modelName].filter(
              item => item.fieldName === "email"
            ),
            modelFieldNames: this.registry[modelName].filter(
              item => item.fieldName !== "password"
            ),
            modelFieldValues: documentFields.modelFieldValues.filter(
              val =>
                typeof val[0] !== "undefined" && typeof val[1] !== "undefined"
            )
          });
        }
      );
    });
  };

  public generateCreateModelViews = (modelNames: string[]): void => {
    // This will require a decent amount of planning to account
    // for the different field types that are required.
    modelNames.map((modelName: string) => {
      return app.get(`/admin/${modelName.toLowerCase()}/create`, (req, res) => {
        res.render("modelCreate", {
          title: "Admin Model Create",
          modelName,
          schemaObjects: this.registry[modelName].map(item => item),
          multipartForm: this.registry[modelName].filter(
            item => item.fieldName === "image"
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
        const modelSaved = await modelInstance.save();
        if (modelSaved) {
          res.status(200).redirect(`/admin/${modelName.toLowerCase()}/create`);
        } // Handle failed save.
      }
    });
  };

  public resize = async (req, res, next) => {
    if (!req.files) {
      next();
    }
    // const fileExtensionsArr: string[] = [];
    const fileExtensionsArr = req.files.map(file => {
      const mimeType = file.mimetype.split("/")[1];
      const fileExtensionToStoreInDB = `${uuidv4()}.${mimeType}`;
      const photoBuffer = this.jimpResize(file, fileExtensionToStoreInDB);
      console.log("The file extension single: ", fileExtensionToStoreInDB);
      // fileExtensionsArr.push(fileExtensionToStoreInDB);
      return fileExtensionToStoreInDB;
    });
    req.body.image = fileExtensionsArr;
    next();
  };

  public jimpResize = async (file, fileExt) => {
    const photo = await jimp.read(file.buffer);
    await photo.resize(800, jimp.AUTO);
    // Upload photoBuffer to S3
    const photoBuffer = await photo.getBuffer(
      photo.getMIME(),
      (err, buffer) => {
        if (err) {
          console.log("Error getting photo buffer: ", err);
        }
        return buffer;
      }
    );
    uploadToS3(photoBuffer, fileExt);
  };

  // public resize = async (req, res, next) => {
  //   if (!req.files) {
  //     next();
  //   }
  //   const mimeType = req.files[0].mimetype.split("/")[1];
  //   req.body.image = `${uuidv4()}.${mimeType}`;
  //   const photo = await jimp.read(req.files[0].buffer);
  //   await photo.resize(800, jimp.AUTO);
  //   // Upload photoBuffer to S3
  //   const photoBuffer = await photo.getBuffer(
  //     photo.getMIME(),
  //     (err, buffer) => {
  //       if (err) {
  //         console.log("Error getting photo buffer: ", err);
  //       }
  //       return buffer;
  //     }
  //   );
  //   uploadToS3(photoBuffer, req.body.image);
  //   next();
  // };

  public createModelMultiPostView = (resize): void => {
    const cpUpload = upload.array("image-upload", 10);
    app.post(
      `/admin/create/multi/:modelName`,
      cpUpload,
      resize,
      async (req, res) => {
        console.log("In create model multi post view: ", req.body.image);
        const modelName: string = req.params.modelName;
        const reqBodyKeys: string[] = Object.getOwnPropertyNames(req.body);
        const objWithoutImageArr: object = reqBodyKeys.reduce((acc, curr) => {
          if (curr !== "image") {
            acc[curr] = req.body[curr];
          }
          return acc;
        }, {});
        console.log(
          "making sure I reduced this correctly: ",
          objWithoutImageArr
        );
        const modelClass = this.getModelClass(modelName);
        const modelInstance = new modelClass(objWithoutImageArr);
        console.log("THE MODEL INSTANCE: ", modelInstance);
        if (req.body.image !== "undefined") {
          req.body.image.map(imageExt => {
            modelInstance.image.push(imageExt);
          });
        }
        const modelSaved = await modelInstance.save();
        console.log("THE MODEL SAVED RESULT: ", modelSaved);
        if (modelSaved) {
          res.status(200).redirect(`/admin/${modelName.toLowerCase()}/create`);
        }
      }
    );
  };

  public updateModelView = (): void => {
    app.get(`/admin/update/:modelName/:modelId`, async (req, res) => {
      const modelName = req.params.modelName;
      const modelId = req.params.modelId;
      res.render("modelUpdate", {
        title: "Admin Panel",
        modelId,
        modelName,
        schemaObjects: this.registry[modelName].map(item => item),
        multipartForm: this.registry[modelName].filter(
          item => item.fieldName === "image" && item.type === "Buffer"
        )
      });
    });
  };

  public updateModelPostView = (): void => {
    app.post(`/admin/update/:modelName/:modelId`, async (req, res) => {
      // Need to handle updating user
      const modelId = req.params.modelId;
      const modelName = req.params.modelName;
      if (modelName === "User") {
        const resultOfUpdate = await adminUpdatePassword(
          modelId,
          req.body.password
        );
        if (!resultOfUpdate) {
          res.sendStatus(401);
        }
        res.sendStatus(200);
      } else {
        const modelClass = this.getModelClass(modelName);
        const values = req.body;
        const updateResult = await modelClass.findOneAndUpdate(
          { _id: modelId },
          req.body
        );
        if (updateResult) {
          res.sendStatus(200);
        }
        res.sendStatus(401);
      }
    });
  };

  public deleteModelPostView = (): void => {
    app.post(`/admin/delete/:modelName`, async (req, res) => {
      const documentsToDelete = req.body.delete;
      const modelName = req.params.modelName;
      const modelClass = this.getModelClass(modelName);
      documentsToDelete.map(async documentId => {
        const result = await modelClass.findOneAndRemove({ _id: documentId });
      });
      res.sendStatus(200);
    });
  };

  public getModelClass(modelClassName: string): Model<any> {
    return model(modelClassName);
  }
}

export const site = new AdminSite();
