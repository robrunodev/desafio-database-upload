import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepostory = getCustomRepository(TransactionsRepository);

    const checkIfTransactionExists = await transactionRepostory.findOne(id);

    if (!checkIfTransactionExists) {
      throw new AppError('Transaction ID not found!');
    }

    await transactionRepostory.delete(id);
  }
}

export default DeleteTransactionService;
