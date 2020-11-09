import { EntityRepository, getRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}
interface TransactionWithBalanceDTO {
  transactions: Transaction[];
  balance: Balance;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  private transactionsRepository: Repository<Transaction> = getRepository(
    Transaction,
  );

  public async getBalance(): Promise<Balance> {
    const transactions = await this.transactionsRepository.find();

    const { income, outcome } = transactions.reduce(
      (accumulator: Balance, transaction: Transaction) => {
        switch (transaction.type) {
          case 'income':
            accumulator.income += transaction.value;
            break;
          case 'outcome':
            accumulator.outcome += transaction.value;
            break;
          default:
            break;
        }

        return accumulator;
      },
      { income: 0, outcome: 0, total: 0 },
    );

    const balance: Balance = {
      income,
      outcome,
      total: income - outcome,
    };

    return balance;
  }

  public async all(): Promise<TransactionWithBalanceDTO> {
    const transactionsWithBalance: TransactionWithBalanceDTO = {
      transactions: await this.transactionsRepository.find(),
      balance: await this.getBalance(),
    };

    return transactionsWithBalance;
  }
}

export default TransactionsRepository;
