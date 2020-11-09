import fs from 'fs';
import csvParse from 'csv-parse';
import Transaction from '../models/Transaction';

class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {
    // TODO
  }
}

export default ImportTransactionsService;
