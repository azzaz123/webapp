import { TokenizeCardRegistrationRequest } from './tokenize-card-registration-request.interface';

export interface PreSyncCreditCardData extends TokenizeCardRegistrationRequest {
  tokenizedCard: string;
}
