export const INVALID_DELIVERY_ADDRESS_CODE = 409;
export const INVALID_DELIVERY_ADDRESS_POSTAL_CODE = 500;

export class DeliveryAddressError extends Error {
  constructor(public error_code: string, public status: number, public message: string) {
    super(message);

    this.status = status;
    this.error_code = error_code;
  }
}
