import { environment } from '@environments/environment';

export const SUBSCRIPTIONS_V3_ENDPOINT = `${environment.baseUrl}api/v3/subscriptions`;
export const CAN_UPDATE_SUBSCRIPTION = (subscriptionId: string) =>
  `${environment.baseUrl}api/v3/subscriptions/${subscriptionId}/action-allowed/update`;
