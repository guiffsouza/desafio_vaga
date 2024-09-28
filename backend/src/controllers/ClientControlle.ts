import { Response, Request } from "express";
import { Client } from "../models/Cliente";

export default class ClientController {
  static async get(req: Request, res: Response) {
    try {
      const clients = await Client.find();
      res.status(200).send(clients);
    } catch (error) {
      res.send(error);
    }
  }
}
