import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CARDEALER_COMMERCIAL_CONTACT_MAIL, SELLBYTEL_PHONE } from '@core/constants';
import { Pack } from '@core/payments/pack';
import { Packs } from '@core/payments/payment.interface';
import { PerksModel } from '@core/payments/payment.model';
import { PaymentService } from '@core/payments/payment.service';

@Component({
  selector: 'tsl-profile-pro-subscription',
  templateUrl: './profile-pro-subscription.component.html',
  styleUrls: ['./profile-pro-subscription.component.scss'],
})
export class ProfileProSubscriptionComponent implements OnInit {
  public packs: Packs;
  public perks: PerksModel;
  public email = CARDEALER_COMMERCIAL_CONTACT_MAIL;
  public sellbytelPhone = SELLBYTEL_PHONE;
  public loading = true;

  constructor(private paymentsService: PaymentService, private router: Router) {}

  ngOnInit() {
    this.paymentsService.getSubscriptionPacks().subscribe((packs: Packs) => {
      this.packs = packs;
      this.paymentsService.getPerks().subscribe((perks: PerksModel) => {
        this.perks = perks;
        const isCustomPack: boolean = !this.packs.listings.find((pack: Pack) => pack.quantity === perks.subscription.listing.quantity);
        if (isCustomPack) {
          this.packs.listings.unshift(new Pack('1', perks.subscription.listing.quantity, 1, 'EUR', 'listings'));
        }
        this.loading = false;
      });
    });
  }

  public getListings(currentTotal: number) {
    if (this.packs) {
      return this.packs.listings
        .filter((listing: Pack) => {
          return listing.quantity >= currentTotal;
        })
        .slice(0, 3);
    } else {
      return [];
    }
  }

  public openFaqs() {
    this.router.navigate(['pro/help', { section: 'Perfil-6' }]);
  }
}
