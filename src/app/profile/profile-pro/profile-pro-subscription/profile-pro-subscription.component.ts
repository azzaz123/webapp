import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../../core/payments/payment.service';
import { PerksModel } from '../../../core/payments/payment.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VisibilityProductsModalComponent } from './visibility-products-modal/visibility-products-modal.component';
import { Packs } from '../../../core/payments/payment.interface';
import { Pack } from '../../../core/payments/pack';

@Component({
  selector: 'tsl-profile-pro-subscription',
  templateUrl: './profile-pro-subscription.component.html',
  styleUrls: ['./profile-pro-subscription.component.scss']
})
export class ProfileProSubscriptionComponent implements OnInit {

  public packs: Packs;
  public perks: PerksModel;
  public email = 'ventas.motor@wallapop.com';
  public loading = true;

  constructor(private paymentsService: PaymentService,
              private modalService: NgbModal) {
  }

  ngOnInit() {
    this.paymentsService.getSubscriptionPacks().subscribe((packs: Packs) => {
      this.packs = packs;
      this.paymentsService.getPerks().subscribe((perks: PerksModel) => {
        this.perks = perks;
        const isCustomPack: boolean = !this.packs.listings.find((pack: Pack) => pack.quantity === perks.subscription.listing.quantity);
        if (isCustomPack) {
          this.packs.listings.unshift(new Pack(
            '1',
            perks.subscription.listing.quantity,
            1,
            'EUR',
            'listings'
          ));
        }
        this.loading = false;
      });
    });
  }

  public getListings(currentTotal: number) {
    if (this.packs) {
      return this.packs.listings.filter((listing: Pack) => {
        return listing.quantity >= currentTotal;
      }).slice(0, 3);
    } else {
      return [];
    }
  }

  public openVisibilityProductsModal() {
    this.modalService.open(VisibilityProductsModalComponent, {windowClass: 'visibility-products'});
  }
}
