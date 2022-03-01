import { CommunicationsConsent } from './communications-consent.interface';

export interface CommunicationsConsentGroup {
  title: string;
  subtitle: string;
  notifications: CommunicationsConsent[];
}
