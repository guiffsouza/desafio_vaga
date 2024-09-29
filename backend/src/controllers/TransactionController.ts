import { Response, Request } from "express";
import { TransactionService } from "../services/TransactionService";

export default class TransactionController {
  static async home(req: Request, res: Response) {
    res.send("Bem vindo a API!");
  }

  static async save(req: Request, res: Response) {
    try {
      const result = await TransactionService.processFile(req.file.path);
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send({ message: "Erro ao processar o arquivo", error });
    }
  }

  static async getTransactions(req: Request, res: Response) {
    try {
      const transactions = await TransactionService.fetchTransactions(req.query);
      res.status(200).send(transactions);
    } catch (error) {
      res.status(500).send({ message: "Erro ao buscar transações", error });
    }
  }

  static async clearData(req: Request, res: Response) {
    try {
      await TransactionService.clearAllData();
      res.status(200).json({
        message: "Todos os dados de Client e Transaction foram deletados.",
      });
    } catch (error) {
      res.status(500).json({ message: "Erro ao deletar os dados.", error });
    }
  }
}
