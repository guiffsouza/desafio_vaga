import { Response, Request } from "express";
import { Client } from "../models/Cliente";
import { Transaction } from "../models/Transaction";
import { performance } from "perf_hooks";
import * as fs from "fs";
import Services from "../services/services";

export default class TransactionController {
  static home(req: Request, res: Response) {
    res.send("Bem vindo a API!");
  }

  static async save(req: Request, res: Response) {
    const BATCH_SIZE = 100;
    const startTime = performance.now();

    try {
      const fileContent = fs.readFileSync(req.file.path, "utf8");
      const lines = fileContent.split("\n");

      const clientMap = new Map();
      let transactionsToSave = [];
      let clientsToSave = [];

      for (const line of lines) {
        const transactionData = Services.parseLine(line);
        const { cpfCnpj, nome } = transactionData;

        if (!cpfCnpj || !Services.isValidCpfCnpj(cpfCnpj)) {
          continue;
        }

        if (!clientMap.has(cpfCnpj)) {
          const client = new Client({
            name: nome,
            cpfCnpj: cpfCnpj,
          });
          clientsToSave.push(client);
          clientMap.set(cpfCnpj, client);
        }

        const existingTransaction = await Transaction.findOne({
          transactionId: transactionData.id,
        });

        if (!existingTransaction) {
          const newTransaction = new Transaction({
            clientId: clientMap.get(cpfCnpj)._id,
            transactionId: transactionData.id,
            date: new Date(transactionData.data),
            value: transactionData.valor,
          });
          transactionsToSave.push(newTransaction);
        }

        if (clientsToSave.length >= BATCH_SIZE) {
          await Client.insertMany(clientsToSave);
          clientsToSave = [];
        }

        if (transactionsToSave.length >= BATCH_SIZE) {
          await Transaction.insertMany(transactionsToSave);
          transactionsToSave = [];
        }
      }

      if (clientsToSave.length > 0) {
        await Client.insertMany(clientsToSave);
      }

      if (transactionsToSave.length > 0) {
        await Transaction.insertMany(transactionsToSave);
      }

      const endTime = performance.now();
      const executionTime = endTime - startTime;

      res.status(200).send({
        message: "Transações processadas com sucesso!",
        executionTime: `${executionTime}ms`,
      });
    } catch (error) {
      res.status(500).send({ message: "Erro ao processar o arquivo", error });
    }
  }

  static async getTransactions(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const {
        nome,
        startDate,
        endDate,
        sortBy = "date",
        sortOrder = "asc",
      } = req.query;

      const filter: any = {};

      if (typeof nome === "string") {
        const clients = await Client.find({
          name: new RegExp(nome as string, "i"),
        });

        if (clients.length === 0) {
          return res.status(200).send({
            page,
            limit,
            totalPages: 0,
            totalTransactions: 0,
            transactions: [],
            transactionsOnPage: 0,
          });
        }

        const clientIds = clients.map((client) => client._id);
        filter.clientId = { $in: clientIds };
      }

      if (startDate || endDate) {
        filter.date = {};
        if (startDate) {
          filter.date.$gte = new Date(startDate as string).toISOString();
        }
        if (endDate) {
          filter.date.$lte = new Date(endDate as string).toISOString();
        }
      }

      const order = sortOrder === "desc" ? -1 : 1;

      const transactions = await Transaction.find(filter)
        .sort({ [sortBy as string]: order })
        .skip(skip)
        .limit(limit)
        .populate("clientId");

      const totalTransactions = await Transaction.countDocuments(filter);

      res.status(200).send({
        page,
        limit,
        totalPages: Math.ceil(totalTransactions / limit),
        totalTransactions,
        transactions,
        transactionsOnPage: transactions.length,
      });
    } catch (error) {
      res.status(500).send({ message: "Erro ao buscar transações", error });
    }
  }

  static async clearData(req: Request, res: Response) {
    try {
      await Transaction.deleteMany({});
      await Client.deleteMany({});
      res.status(200).json({
        message: "Todos os dados de Client e Transaction foram deletados.",
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Erro ao deletar os dados.", error: error });
    }
  }
}
