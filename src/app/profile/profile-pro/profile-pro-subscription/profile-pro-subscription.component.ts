import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../../core/payments/payment.service';
import { PacksModel, PerksModel } from '../../../core/payments/payment.model';
import { Pack } from '../../../core/payments/payment.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VisibilityProductsModalComponent } from './visibility-products-modal/visibility-products-modal.component';

@Component({
  selector: 'tsl-profile-pro-subscription',
  templateUrl: './profile-pro-subscription.component.html',
  styleUrls: ['./profile-pro-subscription.component.scss']
})
export class ProfileProSubscriptionComponent implements OnInit {

  public packs: PacksModel;
  public perks: PerksModel;
  public email = 'ventas.motor@wallapop.com';
  public loading = true;

  constructor(private paymentsService: PaymentService,
              private modalService: NgbModal) {
  }

  ngOnInit() {
    this.paymentsService.getSubscriptionPacks().subscribe((packs: PacksModel) => {
      this.packs = packs;
      this.paymentsService.getPerks().subscribe((perks: PerksModel) => {
        this.perks = perks;
        const isCustomPack: boolean = !this.packs.listings.find((pack: Pack) => pack.quantity === perks.subscription.listing.quantity);
        if (isCustomPack) {
          this.packs.addCustomListingPack(perks.subscription.listing.quantity);
        }
        this.loading = false;
      });
    });
  }

  public openVisibilityProductsModal() {
    this.modalService.open(VisibilityProductsModalComponent, {windowClass: 'visibility-products'});
  }

}
