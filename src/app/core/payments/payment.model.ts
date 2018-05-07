import { Perks, PerkResponse } from './payment.interface';

export class PerksModel implements Perks {
  subscription = {
    bump: {
      total: 0,
      quantity: 0
    },
    national: {
      total: 0,
      quantity: 0
    },
    listing: {
      quantity: 0
    }
  };
  extra = {
    bump: {
      quantity: 0
    },
    national: {
      quantity: 0
    }
  };
  getBumpCounter(): number {
    return this.subscription.bump.quantity + this.extra.bump.quantity;
  }
  getNationalBumpCounter(): number {
    return this.subscription.national.quantity + this.extra.national.quantity;
  }
  setBumpSubscription(bumpPerk: PerkResponse) {
    this.subscription.bump.quantity = bumpPerk.quantity;
    this.subscription.bump.total = bumpPerk.total;
  }
  setBumpExtra(bumpPerk: PerkResponse) {
    this.extra.bump.quantity = bumpPerk.quantity;
  }
  setNationalSubscription(nationalPerk: PerkResponse) {
    this.subscription.national.quantity = nationalPerk.quantity;
    this.subscription.national.total = nationalPerk.total;
  }
  setNationalExtra(nationalPerk: PerkResponse) {
    this.extra.national.quantity = nationalPerk.quantity;
  }
  setListingSubscription(listingPerk: PerkResponse) {
    this.subscription.listing.quantity = listingPerk.quantity;
  }
}