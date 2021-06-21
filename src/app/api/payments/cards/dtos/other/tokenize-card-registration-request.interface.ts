import { CreditCardSyncRequest } from '@api/core/model/cards/credit-card-sync-request.interface';
import { TokenizerInformationApi } from '../responses';

export interface TokenizeCardRegistrationRequest {
  request: CreditCardSyncRequest;
  tokenizerInfo: TokenizerInformationApi;
}
