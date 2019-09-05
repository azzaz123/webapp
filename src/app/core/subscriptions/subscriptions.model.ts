import { SubscriptionsResponse, Tier } from './subscriptions.interface';

export class SubscriptionsModel implements SubscriptionsResponse {
  category_id: number;
  current_limit: number;
  subscribed_from: number;
  selected_tier_id: number;
  default_tier_id: number;
  tiers: Tier[];
  category_icon?: string;
  category_name?: string;

  setCategoryId(value: number) {
    this.category_id = value;
  }

  getCategoryId(): number {
    return this.category_id;
  }

  setCurrentLimit(value: number) {
    this.current_limit = value;
  }

  getCurrentLimit(): number {
    return this.current_limit;
  }

  setSubscribedFrom(value: number) {
    this.subscribed_from = value;
  }

  getSubscribedFrom(): number {
    return this.subscribed_from;
  }

  setSelectedTierId(value: number) {
    this.selected_tier_id = value;
  }

  getSelectedTierId(): number {
    return this.selected_tier_id;
  }

  setDefaultTierId(value: number) {
    this.default_tier_id = value;
  }

  getDefaultTierId(): number {
    return this.default_tier_id;
  }

  setCategoryIcon(value: string) {
    this.category_icon = value;
  }

  getCategoryIcon(): string {
    return this.category_icon;
  }

  setCategoryName(value: string) {
    this.category_name = value;
  }

  getCategoryName(): string {
    return this.category_name;
  }

}