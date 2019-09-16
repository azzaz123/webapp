import { of } from 'rxjs';
import { SubscriptionSlot } from '../app/core/subscriptions/subscriptions.interface';
import { CATEGORY_DATA_WEB } from './category.fixtures.spec';

export class MockSubscriptionService {
    public getSlots() {
        return of([]);
    }

    public getSlotCategory(_id) {
        return of([]);
    }
}

export const MOCK_SUBSCRIPTION_SLOT: SubscriptionSlot = {
    category_id: CATEGORY_DATA_WEB[0].categoryId,
    category: CATEGORY_DATA_WEB[0],
    available: 3,
    limit: 10
};
