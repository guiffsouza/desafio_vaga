import express, { Express } from "express";
import cors from "cors";
import transactionsRoutes from "./transactions";
import clientRoutes from "./clients";

const routes = (app: Express) => {
  app.use(
    cors({
      origin: "*",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      allowedHeaders: "Content-Type,Authorization",
    })
  );

  app.use(express.json(), transactionsRoutes, clientRoutes);
};

export default routes;
