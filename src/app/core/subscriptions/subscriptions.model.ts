import { Subscriptions, Tier } from './subscriptions.interface';

export class SubscriptionsModel implements Subscriptions {
  category_id: number;
  current_limit: number;
  subscribed_from: number;
  selected_tier_id: number;
  default_tier_id: number;
  tiers: Tier[];

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

  setTiers(value: Tier[]) {
    this.tiers = value;
  }

  getTiers(): Tier[] {
    return this.tiers;
  }

}