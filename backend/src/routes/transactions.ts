import express from "express";
import TransactionController from "../controllers/TransactionController";
import { upload } from "../middleware/upload";

class TransactionRoutes {
  public router: express.Router;

  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router
      .get("/", TransactionController.home)
      .post("/upload", upload.single("file"), TransactionController.save)
      .get("/transactions", TransactionController.getTransactions)
      .delete("/delete", TransactionController.clearData)
  }
}

const transactionRoutes = new TransactionRoutes();

export default transactionRoutes.router;
