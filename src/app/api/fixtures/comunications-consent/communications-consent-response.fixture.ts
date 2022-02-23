import { CommunicationsConsentGroupDto } from '@api/communications-consent/dtos/response/communications-consent-group-dto';
import { CommunicationsConsentResponseDto } from '@api/communications-consent/dtos/response/communications-consent-response-dto';
import { BackendCommunicationsConsentKeys } from '@api/communications-consent/mappers/communications-consent-mapper';

export const communicationsConsentIdToModify = '2n08z8oj3wrq';

const communicationsConsentGroupDtos: CommunicationsConsentGroupDto[] = [
  {
    title: BackendCommunicationsConsentKeys.NOTIFICATIONS_CATALOG_EXPIRED_TITLE,
    subtitle: BackendCommunicationsConsentKeys.NOTIFICATIONS_CATALOG_SUBTITLE,
    notifications: [
      {
        id: communicationsConsentIdToModify,
        title: BackendCommunicationsConsentKeys.NOTIFICATIONS_GROUP_CATALOG_TITLE,
        enabled: true,
      },
    ],
  },
];

export const communicationsConsentResponseFixture: CommunicationsConsentResponseDto = {
  notificationGroups: communicationsConsentGroupDtos,
};
