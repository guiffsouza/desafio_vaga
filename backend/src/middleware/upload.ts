import multer from "multer";
import path from "path";

class FileUploader {
  private storage: multer.StorageEngine;

  constructor() {
    this.storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../uploads"));
      },
      filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
      },
    });
  }

  public getUploader() {
    return multer({ storage: this.storage });
  }
}

const fileUploader = new FileUploader();

export const upload = fileUploader.getUploader();
