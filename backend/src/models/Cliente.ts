import mongoose, { Schema, Document } from "mongoose";

export interface IClient extends Document {
  name: string;
  cpfCnpj: string;
}

class ClientModel {
  private schema: Schema;

  constructor() {
    this.schema = new Schema({
      name: { type: String, required: true },
      cpfCnpj: { type: String, required: true, unique: true },
    });
  }

  public getModel() {
    return mongoose.model<IClient>("Client", this.schema);
  }
}

const clientModel = new ClientModel();

export const Client = clientModel.getModel();
