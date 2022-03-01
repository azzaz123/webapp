import { BackendCommunicationsConsentKeys } from '@api/communications-consent/mappers/communications-consent-mapper';
import { CommunicationsConsentDto } from './communications-consent-dto';

export interface CommunicationsConsentGroupDto {
  title: BackendCommunicationsConsentKeys;
  subtitle: BackendCommunicationsConsentKeys;
  notifications: CommunicationsConsentDto[];
}
