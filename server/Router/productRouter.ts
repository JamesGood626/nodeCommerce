import * as AWS from "aws-sdk";
import * as multer from "multer";
import * as jimp from "jimp";
import * as uuidv4 from "uuid/v4";
import { createProduct } from "../API/Products/Services";
import {
  BUCKET_NAME,
  IAM_USER_KEY,
  IAM_USER_SECRET
} from "../Config/aws-config";

const uploadToS3 = (photoBuffer, photoName) => {
  const s3 = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET
  });
  s3.createBucket(async () => {
    const params = {
      Bucket: BUCKET_NAME,
      Key: `product-images/${photoName}`,
      Body: photoBuffer
    };
    await s3.upload(params, (err, data) => {
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

const resize = async (req, res, next) => {
  if (!req.files) {
    next();
  }
  // const fileExtensionsArr: string[] = [];
  const fileExtensionsArr = req.files.map(file => {
    const mimeType = file.mimetype.split("/")[1];
    const fileExtensionToStoreInDB = `${uuidv4()}.${mimeType}`;
    jimpResize(file, fileExtensionToStoreInDB);
    return fileExtensionToStoreInDB;
  });
  req.body.images = fileExtensionsArr;
  next();
};

const jimpResize = async (file, fileExt) => {
  const photo = await jimp.read(file.buffer);
  await photo.resize(800, jimp.AUTO);
  // Upload photoBuffer to S3
  const photoBuffer = await photo.getBuffer(photo.getMIME(), (err, buffer) => {
    if (err) {
      console.log("Error getting photo buffer: ", err);
    }
    return buffer;
  });
  await uploadToS3(photoBuffer, fileExt);
};

export const productRouter = (app): void => {
  const cpUpload = upload.array("image-upload", 10);
  app.post(`/admin/create/product`, cpUpload, resize, async (req, res) => {
    // console.log("In create model multi post view: ", req.body.images);
    try {
      createProduct(req.body);
      res.status(200);
    } catch {
      res.status(412);
    }
  });
};
