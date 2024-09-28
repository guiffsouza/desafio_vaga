import mongoose from "mongoose";

mongoose.connect(
  "mongodb+srv://guiffsouza:Gs924FVjNzktgQg1@cluster0.ieoau.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
);

let db = mongoose.connection;

export default db;
