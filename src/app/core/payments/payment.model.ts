import { CartPacks, PerkResponse, Perks } from './payment.interface';
import { Pack } from './pack';

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
      quantity: 0,
      createDate: 0,
    },
    national: {
      total: 0,
      quantity: 0,
      createDate: 0,
    },
    listing: {
      quantity: 0,
      createDate: 0,
    },
  };
  extra = {
    bump: {
      quantity: 0,
    },
    national: {
      quantity: 0,
    },
  };
  wallacoins = {
    quantity: 0,
  };
  wallacredits = {
    quantity: 0,
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
    this.subscription.bump.createDate = bumpPerk.create_date;
  }
  setBumpExtra(bumpPerk: PerkResponse) {
    this.extra.bump.quantity = bumpPerk.quantity;
  }
  setNationalSubscription(nationalPerk: PerkResponse) {
    this.subscription.national.quantity = nationalPerk.quantity;
    this.subscription.national.total = nationalPerk.total;
    this.subscription.national.createDate = nationalPerk.create_date;
  }
  setNationalExtra(nationalPerk: PerkResponse) {
    this.extra.national.quantity = nationalPerk.quantity;
  }
  setListingSubscription(listingPerk: PerkResponse) {
    this.subscription.listing.quantity = listingPerk.quantity;
    this.subscription.listing.createDate = listingPerk.create_date;
  }
  setWallacoins(wallacoinsPerk: PerkResponse) {
    this.wallacoins.quantity += wallacoinsPerk.quantity;
  }
  setWallacredits(wallacreditsPerk: PerkResponse) {
    this.wallacredits.quantity += wallacreditsPerk.quantity;
  }
}
