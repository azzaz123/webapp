import { CreditCard } from '@api/core/model/credit-card.interface';
import { ApiMapper } from '@api/core/utils/api-mapper';

export class PaymentsCreditCardApiMapper extends ApiMapper {
  public map<PaymentsCreditCardApi, CreditCard>(response: PaymentsCreditCardApi): CreditCard {
    return {
      id: response.id,
    };
  }
}
