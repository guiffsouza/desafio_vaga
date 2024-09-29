import express from "express";
import db from "./connection/db";
import AppRoutes from "./routes/index";

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.connectToDatabase();
    new AppRoutes(this.app);
  }

  private connectToDatabase() {
    db.on("error", console.log.bind(console, "Erro de conexão"));
    db.once("open", () => {
      console.log("Conexão com o banco feita com sucesso");
    });
  }
}

const appInstance = new App();

export default appInstance.app;
