import mongoose, { Schema, Document } from "mongoose";

interface ITransaction extends Document {
  clientId: mongoose.Schema.Types.ObjectId;
  transactionId: string;
  date: Date;
  value: number;
}

const TransactionSchema: Schema = new Schema({
  clientId: { type: Schema.Types.ObjectId, ref: "Client", required: true },
  transactionId: { type: String, required: true, unique: true },
  date: { type: Date, required: true },
  value: { type: Number, required: true },
});

export const Transaction = mongoose.model<ITransaction>(
  "Transaction",
  TransactionSchema
);
