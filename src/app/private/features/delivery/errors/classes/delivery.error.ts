export class DeliveryError extends Error {
  constructor(public message: string) {
    super(message);
  }
}
