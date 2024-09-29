import mongoose, { Schema, Document } from "mongoose";

export interface ITransaction extends Document {
  clientId: mongoose.Schema.Types.ObjectId;
  transactionId: string;
  date: Date;
  value: number;
}

class TransactionModel {
  private schema: Schema;

  constructor() {
    this.schema = new Schema({
      clientId: { type: Schema.Types.ObjectId, ref: "Client", required: true },
      transactionId: { type: String, required: true, unique: true },
      date: { type: Date, required: true },
      value: { type: Number, required: true },
    });
  }

  public getModel() {
    return mongoose.model<ITransaction>("Transaction", this.schema);
  }
}

const transactionModel = new TransactionModel();

export const Transaction = transactionModel.getModel();
