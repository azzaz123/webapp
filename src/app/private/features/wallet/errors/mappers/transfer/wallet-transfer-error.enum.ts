export enum WalletTransferErrorEnum {
  AlreadyStarted = 'pay user bank account already started',
  InsufficientFunds = 'mangopay pay user bank account from user wallet insufficient funds',
  LessThanMinimum = 'mangopay pay user bank account from user wallet less than minimum',
  Network = 'network',
  UserNotFound = 'mangopay bank account for user not found',
  WalletBlocked = "pay user bank account user's wallet blocked",
}
