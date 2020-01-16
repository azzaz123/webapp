import { SubscriptionsResponse, Tier } from './subscriptions.interface';

export class SubscriptionsModel implements SubscriptionsResponse {
  id: string;
  category_id: number;
  current_limit: number;
  subscribed_from: number;
  selected_tier_id: string;
  default_tier_id: string;
  tiers: Tier[];
  category_icon?: string;
  category_name?: string;
  selected_tier?: Tier
  subscribed_until?: number;

  setId(value: string) {
    this.id = value;
  }

  getId(): string {
    return this.id;
  }

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

  setSelectedTierId(value: string) {
    this.selected_tier_id = value;
  }

  getSelectedTierId(): string {
    return this.selected_tier_id;
  }

  setDefaultTierId(value: string) {
    this.default_tier_id = value;
  }

  getDefaultTierId(): string {
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

  setSelectedTier(value: Tier) {
    this.selected_tier = value;
  }

  getSelectedTier(): Tier {
    return this.selected_tier;
  }

  setSubscribedUntil(value: number) {
    this.subscribed_until = value;
  }

  getSubscribedUntil(): number {
    return this.subscribed_until;
  }


}