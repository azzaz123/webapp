import { BumpsPackageBalance } from '@api/core/model/bumps/bumps-package-balance.interface';
import { SubscriptionSlot } from '@api/core/model/subscriptions/slots/subscription-slot.interface';
import { SubscriptionsResponse } from '@core/subscriptions/subscriptions.interface';
import { SubscriptionSlotGeneralResponse, SubscriptionSlotResponse } from '../dtos/slots/slots-response.interface';

export function mapSlotsResponseToSlots(
  slotsResponse: SubscriptionSlotGeneralResponse,
  subscriptions: SubscriptionsResponse[],
  bumpsBalance: BumpsPackageBalance[]
): SubscriptionSlot[] {
  const { slots } = slotsResponse;
  return slots.map((slot) => mapSlotResponseToSlot(slot, subscriptions, bumpsBalance));
}

function mapSlotResponseToSlot(
  slot: SubscriptionSlotResponse,
  subscriptions: SubscriptionsResponse[],
  bumpsBalance: BumpsPackageBalance[]
): SubscriptionSlot {
  const subscription = subscriptions.find((subscriptionSelected) => subscriptionSelected.type === slot.type);
  const bumpSubscriptionBalance = bumpsBalance.find((balance) => balance.subscription_type === subscription.type);
  return {
    subscription,
    available: slot.available,
    limit: slot.limit,
    bumpBalance: bumpSubscriptionBalance ? bumpSubscriptionBalance.balance : [],
  };
}
