export class PaymentsError extends Error {
  constructor(public message: string) {
    super(message);
  }
}
