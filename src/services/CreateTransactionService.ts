import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
// import AppError from '../errors/AppError';
import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface RequestDTO {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category_title: string;
}

class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    category_title,
  }: RequestDTO): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    const { total } = await transactionRepository.getBalance();

    if (!['outcome', 'income'].includes(type)) {
      throw new AppError('Transaction type is invalid');
    }

    if (type === 'outcome' && value > total) {
      throw new AppError('Amount greater than the total cash');
    }

    const checkCategoryExists = await categoryRepository.findOne({
      where: {
        title: category_title,
      },
    });

    let category = new Category();
    if (!checkCategoryExists) {
      category = await categoryRepository.create({
        title: category_title,
      });

      await categoryRepository.save(category);
    } else {
      category = checkCategoryExists;
    }

    const transaction = await transactionRepository.create({
      title,
      type,
      value,
      category_id: category.id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
