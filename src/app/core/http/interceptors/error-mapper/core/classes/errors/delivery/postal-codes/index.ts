import { DeliveryError } from '../..';

export class DeliveryPostalCodesError extends DeliveryError {
  constructor(public error_code: DeliveryPostalCodesErrorCode, public message: string) {
    super(error_code, message);
  }
}

export type DeliveryPostalCodesErrorCode = 'invalid postal code' | 'postal code not exists' | 'postal code is not allowed';

export * from './invalid-postal-code.error';
export * from './postal-code-does-not-exist.error';
export * from './postal-code-is-not-allowed.error';
