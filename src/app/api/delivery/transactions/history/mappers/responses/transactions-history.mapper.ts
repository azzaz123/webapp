import { mapNumberAndCurrencyCodeToMoney } from '@api/core/mappers';
import { TransactionItem, TransactionUser } from '@api/core/model';
import { CurrencyCode } from '@api/core/model/currency.interface';
import { TRANSACTION_DELIVERY_STATUS, TRANSACTION_PAYMENT_STATUS, TRANSACTION_STATUS } from '@api/core/model/delivery/transaction/status';
import { HistoricTransaction } from '@api/core/model/delivery/transaction/';
import { Money } from '@api/core/model/money.interface';
import { ToDomainMapper, Unpacked } from '@api/core/utils/types';
import { Item } from '@core/item/item';
import { PLACEHOLDER_AVATAR, User } from '@core/user/user';
import { TransactionsHistoryDto } from '../../dtos/transactions-history-dto.interface';

interface TransactionsHistoryWithUserAndItem {
  transactions: TransactionsHistoryDto;
  currentUser: User;
  users: User[];
  items: Item[];
}

export const mapTransactionsHistoryToTransactions: ToDomainMapper<TransactionsHistoryWithUserAndItem, HistoricTransaction[]> = (
  input: TransactionsHistoryWithUserAndItem
) => {
  const mappedTransactions: HistoricTransaction[] = mapToTransactions(input);
  return mappedTransactions;
};

const mapToTransactions = (input: TransactionsHistoryWithUserAndItem): HistoricTransaction[] => {
  const { transactions, currentUser, users, items } = input;
  const mappedTransactions: HistoricTransaction[] = transactions.map((transaction: Unpacked<TransactionsHistoryDto>) => {
    const item = items.find((i) => i.id === transaction.item_hash_id);
    const transactorUser: User = users.find((i) => i.id === transaction.transactor_user_hash_id);
    const userIsSeller = transaction.amount.amount > 0;
    const seller: User = userIsSeller ? currentUser : transactorUser;
    const buyer: User = userIsSeller ? transactorUser : currentUser;
    const mappedItem: TransactionItem = getTransactionItemFromItem(item);
    const mappedBuyer: TransactionUser = getTransactionUserFromUser(buyer);
    const mappedSeller: TransactionUser = getTransactionUserFromUser(seller);
    const moneyAmount: Money = mapNumberAndCurrencyCodeToMoney({
      number: transaction.amount.amount,
      currency: transaction.amount.currency as CurrencyCode,
    });
    const creationDate: Date = new Date(transaction.created_at);
    const isCurrentUserTheSeller = currentUser.id === seller.id;

    return {
      id: transaction.id,
      creationDate,
      item: mappedItem,
      buyer: mappedBuyer,
      seller: mappedSeller,
      moneyAmount,
      status: {
        transaction: TRANSACTION_STATUS.SUCCEEDED,
        delivery: TRANSACTION_DELIVERY_STATUS.NONE,
        payment: TRANSACTION_PAYMENT_STATUS.NONE,
      },
      isCurrentUserTheSeller,
    };
  });

  return mappedTransactions;
};

const getTransactionUserFromUser = (user: User): TransactionUser => {
  return {
    id: user.id,
    imageUrl: user.image?.urls_by_size.original || PLACEHOLDER_AVATAR,
    name: user.microName,
  };
};

const getTransactionItemFromItem = (item: Item): TransactionItem => {
  return {
    id: item.id,
    imageUrl: item.images[0].urls_by_size.original,
    title: item.title,
  };
};
