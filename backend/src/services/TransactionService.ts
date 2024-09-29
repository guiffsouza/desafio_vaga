import { Client, IClient } from "../models/Cliente";
import { ITransaction, Transaction } from "../models/Transaction";
import { performance } from "perf_hooks";
import * as fs from "fs";
import Services from "../services/services";

export class TransactionService {
  static async processFile(filePath: string) {
    const BATCH_SIZE = 100;
    const startTime = performance.now();
    const fileContent = fs.readFileSync(filePath, "utf8");
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
        const client = new Client({ name: nome, cpfCnpj });
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

      await TransactionService.batchInsert(clientsToSave, transactionsToSave, BATCH_SIZE);
    }

    await TransactionService.finalizeBatches(clientsToSave, transactionsToSave);
    const endTime = performance.now();
    return { message: "Transações processadas com sucesso!", executionTime: `${endTime - startTime}ms` };
  }

  static async batchInsert(clientsToSave: IClient[], transactionsToSave: ITransaction[], BATCH_SIZE: number) {
    if (clientsToSave.length >= BATCH_SIZE) {
      await Client.insertMany(clientsToSave);
      clientsToSave.length = 0; 
    }

    if (transactionsToSave.length >= BATCH_SIZE) {
      await Transaction.insertMany(transactionsToSave);
      transactionsToSave.length = 0;
    }
  }

  static async finalizeBatches(clientsToSave: IClient[], transactionsToSave: ITransaction[]) {
    if (clientsToSave.length > 0) {
      await Client.insertMany(clientsToSave);
    }
    if (transactionsToSave.length > 0) {
      await Transaction.insertMany(transactionsToSave);
    }
  }

  static async fetchTransactions(query: any) {
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const filter: any = {};


    if (typeof query.nome === "string") {
      const clients = await Client.find({
        name: new RegExp(query.nome as string, "i"),
      });

      if (clients.length === 0) {
        return {
          page,
          limit,
          totalPages: 0,
          totalTransactions: 0,
          transactions: [],
          transactionsOnPage: 0,
        };
      }

      const clientIds = clients.map((client) => client._id);
      filter.clientId = { $in: clientIds };
    }

    if (query.startDate || query.endDate) {
      filter.date = {};
      if (query.startDate) {
        filter.date.$gte = new Date(query.startDate as string).toISOString();
      }
      if (query.endDate) {
        filter.date.$lte = new Date(query.endDate as string).toISOString();
      }
    }

    const order = query.sortOrder === "desc" ? -1 : 1;

    const transactions = await Transaction.find(filter)
      .sort({ [query.sortBy || "date"]: order })
      .skip(skip)
      .limit(limit)
      .populate("clientId");

    const totalTransactions = await Transaction.countDocuments(filter);

    return {
      page,
      limit,
      totalPages: Math.ceil(totalTransactions / limit),
      totalTransactions,
      transactions,
      transactionsOnPage: transactions.length,
    };
  }

  static async clearAllData() {
    await Transaction.deleteMany({});
    await Client.deleteMany({});
  }
}
