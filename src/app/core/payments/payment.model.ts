import { CartPacks, Pack, Packs, PerkResponse, Perks } from './payment.interface';

export class PacksModel implements Packs  {
  bumps: Pack[];
  nationals: Pack[];
  listings: Pack[];

  constructor() {
    this.nationals = [];
    this.bumps = [];
    this.listings = [];
  }

  addNationalPack(pack: Pack) {
    this.nationals.push(pack);
  }

  getNationalPacks(): Pack[] {
    return this.nationals;
  }

  addBump(pack: Pack) {
    this.bumps.push(pack);
  }

  getBumps() {
    return this.bumps;
  }

  addListing(pack: Pack) {
    this.listings.push(pack);
  }

  getListings() {
    return this.listings;
  }
}

export class CartPacksModel implements CartPacks {
  nationals: Pack;
  bumps: Pack;

  setNationalBump(pack: Pack) {
    this.nationals = pack;
  }

  getNationalBump(): Pack {
    return this.nationals;
  }

  setCityBump(pack: Pack) {
    this.bumps = pack;
  }

  getCityBump(): Pack {
    return this.bumps;
  }
}

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
