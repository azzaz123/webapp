import { SubscriptionsResponse } from '@core/subscriptions/subscriptions.interface';
import { SubscriptionSlotResponse } from '../dtos/slots/slots-response.interface';
import { SubscriptionSlot } from '../interfaces/subscription-slot/subscription-slot.interface';

export function mapSlotsResponseToSlots(slots: SubscriptionSlotResponse[], subscriptions: SubscriptionsResponse[]): SubscriptionSlot[] {
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
