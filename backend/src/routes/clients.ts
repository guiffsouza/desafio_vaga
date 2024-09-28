import express from "express";
import ClientController from "../controllers/ClientControlle";

const routes = express.Router();

routes.get("/client", ClientController.get);

export default routes;
