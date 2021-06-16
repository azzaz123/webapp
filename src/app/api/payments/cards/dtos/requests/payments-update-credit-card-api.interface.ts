import { PaymentsCreateCreditCardApi } from './payments-create-credit-card-api.interface';

export interface PaymentsUpdateCreditCardApi extends PaymentsCreateCreditCardApi {
  id: string;
}
