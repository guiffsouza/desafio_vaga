import express from "express";
import ClientController from "../controllers/ClientControlle";

class ClientRoutes {
  public router: express.Router;

  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/client", ClientController.get);
  }
}

const clientRoutes = new ClientRoutes();

export default clientRoutes.router;
