import { CategoryResponse } from '../category/category-response.interface';

export interface SubscriptionSlotResponse {
    category_id: number;
    available: number;
    limit: number;
}

export interface SubscriptionSlot {
    category: CategoryResponse;
    available: number;
    limit: number;
}
