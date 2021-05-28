export class DeliveryError extends Error {
  constructor(public error_code: string, public message: string) {
    super(message);
  }
}
