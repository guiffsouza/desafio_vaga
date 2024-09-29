import express, { Express } from "express";
import cors from "cors";
import transactionsRoutes from "./transactions";
import clientRoutes from "./clients";

class AppRoutes {
  private app: Express;

  constructor(app: Express) {
    this.app = app;
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.app.use(express.json());
    this.app.use(
      cors({
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        allowedHeaders: "Content-Type,Authorization",
      })
    );

    this.app.use(express.json(), transactionsRoutes, clientRoutes);
  }
}

export default AppRoutes;
