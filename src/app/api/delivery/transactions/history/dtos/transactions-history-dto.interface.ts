interface TransactionHistoryDto {
  amount: { amount: number; currency: string };
  created_at: string;
  id: string;
  item_hash_id: string;
  transaction_id: string;
  transaction_status: string;
  transactor_user_hash_id: string;
  user_hash_id: string;
}

export type TransactionsHistoryDto = TransactionHistoryDto[] | [];
