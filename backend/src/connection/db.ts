import mongoose from "mongoose";

class Database {
  private dbUri: string;
  
  constructor(uri: string) {
    this.dbUri = uri;
    this.connect();
  }

  private connect() {
    mongoose.connect(this.dbUri)
      .then(() => {
        console.log("Conexão com o banco de dados estabelecida.");
      })
      .catch((error) => {
        console.error("Database connection error:", error);
      });
  }

  public getConnection() {
    return mongoose.connection;
  }
}

const db = new Database("mongodb+srv://guiffsouza:Gs924FVjNzktgQg1@cluster0.ieoau.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

export default db.getConnection();
