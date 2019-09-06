import { CategoryResponse } from '../category/category-response.interface';

export interface SubscriptionSlot {
    category_id: number;
    category: CategoryResponse;
    available: number;
    limit: number;
}
