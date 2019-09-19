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

export const MOCK_SUBSCRIPTION_SLOT_CARS: SubscriptionSlotResponse = {
    category_id: 100,
    available: 3,
    limit: 10
};

export const MOCK_SUBSCRIPTION_SLOT_MOTORBIKES: SubscriptionSlotResponse = {
    category_id: 14000,
    available: 2,
    limit: 10
};

export const MOCK_SUBSCRIPTION_SLOT_MOTOR_ACCESSORIES: SubscriptionSlotResponse = {
    category_id: 12800,
    available: 0,
    limit: 10
};

export const MOCK_SUBSCRIPTION_SLOTS: SubscriptionSlotResponse[] = [
    MOCK_SUBSCRIPTION_SLOT_CARS,
    MOCK_SUBSCRIPTION_SLOT_MOTOR_ACCESSORIES,
    MOCK_SUBSCRIPTION_SLOT_MOTORBIKES
];
