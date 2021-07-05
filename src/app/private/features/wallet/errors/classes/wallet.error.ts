export class WalletError extends Error {
  constructor(public message: string) {
    super(message);
  }
}
