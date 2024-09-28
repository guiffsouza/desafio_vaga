import express from "express";
import TransactionController from "../controllers/TransactionController";
import { upload } from "../middleware/upload";

const routes = express.Router();

routes.get("/", TransactionController.home);
routes.post("/upload", upload.single("file"), TransactionController.save);
routes.get("/transactions", TransactionController.getTransactions);
routes.delete("/delete", TransactionController.clearData);

export default routes;
