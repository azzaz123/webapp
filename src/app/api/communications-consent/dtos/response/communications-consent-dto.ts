import { BackendCommunicationsConsentKeys } from '@api/communications-consent/mappers/communications-consent-mapper';

export interface CommunicationsConsentDto {
  id: string;
  title: BackendCommunicationsConsentKeys;
  enabled: boolean;
}
