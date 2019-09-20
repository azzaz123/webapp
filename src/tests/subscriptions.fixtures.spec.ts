import { of } from 'rxjs';
import { SubscriptionSlotResponse } from '../app/core/subscriptions/subscriptions.interface';

export class MockSubscriptionService {
    public getSlots() {
        return of([]);
    }

    public getSlotCategory(_id) {
        return of([]);
    }
}

export const MOCK_SUBSCRIPTION_SLOT_CARS_RESPONSE: SubscriptionSlotResponse = {
    category_id: 100,
    available: 3,
    limit: 10
};

export const MOCK_SUBSCRIPTION_SLOT_MOTORBIKES_RESPONSE: SubscriptionSlotResponse = {
    category_id: 14000,
    available: 2,
    limit: 10
};

export const MOCK_SUBSCRIPTION_SLOT_MOTOR_ACCESSORIES_RESPONSE: SubscriptionSlotResponse = {
    category_id: 12800,
    available: 0,
    limit: 10
};

export const MOCK_SUBSCRIPTION_SLOTS_RESPONSE: SubscriptionSlotResponse[] = [
    MOCK_SUBSCRIPTION_SLOT_CARS_RESPONSE,
    MOCK_SUBSCRIPTION_SLOT_MOTOR_ACCESSORIES_RESPONSE,
    MOCK_SUBSCRIPTION_SLOT_MOTORBIKES_RESPONSE
];
