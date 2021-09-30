import { SubscriptionSlot } from '@api/core/model/subscriptions/slots/subscription-slot.interface';
import { SubscriptionsResponse } from '@core/subscriptions/subscriptions.interface';
import { SubscriptionSlotGeneralResponse, SubscriptionSlotResponse } from '../dtos/slots/slots-response.interface';

export function mapSlotsResponseToSlots(
  slotsResponse: SubscriptionSlotGeneralResponse,
  subscriptions: SubscriptionsResponse[]
): SubscriptionSlot[] {
  const { slots } = slotsResponse;
  return slots.map((slot) => mapSlotResponseToSlot(slot, subscriptions));
}

function mapSlotResponseToSlot(slot: SubscriptionSlotResponse, subscriptions: SubscriptionsResponse[]): SubscriptionSlot {
  const subscription = subscriptions.find((subscriptionSelected) => subscriptionSelected.type === slot.type);
  return {
    subscription,
    available: slot.available,
    limit: slot.limit,
  };
}
