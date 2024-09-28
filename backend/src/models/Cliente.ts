import mongoose, { Schema, Document } from "mongoose";

interface IClient extends Document {
  name: string;
  cpfCnpj: string;
}

const ClientSchema: Schema = new Schema({
  name: { type: String, required: true },
  cpfCnpj: { type: String, required: true, unique: true },
});

export const Client = mongoose.model<IClient>("Client", ClientSchema);
