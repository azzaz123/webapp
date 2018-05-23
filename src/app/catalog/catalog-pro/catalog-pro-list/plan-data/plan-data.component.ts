import { Component, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { PaymentService } from '../../../../core/payments/payment.service';
import { PurchasesModel } from '../../../../core/payments/purchase.model';
import { ScheduledStatus } from '../../../../core/payments/payment.interface';
import { PurchaseService } from '../../../../core/payments/purchase.service';
import { PerksModel } from '../../../../core/payments/payment.model';
import { Counters } from '../../../../core/user/user-stats.interface';
import { ItemService } from '../../../../core/item/item.service';

@Component({
  selector: 'tsl-plan-data',
  templateUrl: './plan-data.component.html',
  styleUrls: ['./plan-data.component.scss']
})
export class PlanDataComponent implements OnChanges {

  @Output() subscriptionPlan: EventEmitter<number> = new EventEmitter<number>();
  @Input() counters: Counters;
  public purchases: PurchasesModel = new PurchasesModel();
  public perks: PerksModel;
  public status: ScheduledStatus;
  public loading: boolean = true;
  public cityBumpsInUse = 0;
  public countryBumpsInUse = 0;
  
  constructor(private paymentService: PaymentService,
              private purchaseService: PurchaseService,
              private itemService: ItemService) { }

  ngOnChanges() {
    this.getPerks(false);
  }

  private getPerks(cache: boolean = true) {
    this.paymentService.getPerks(cache).subscribe((perks: PerksModel) => {
      this.perks = perks;
      this.subscriptionPlan.emit(perks.subscription ? perks.subscription.listing.quantity : 0);
      this.paymentService.getStatus().subscribe((status: ScheduledStatus) => {
        this.status = status;
        this.cityBumpsInUse = this.itemService.cityBumpsInUse;
        this.countryBumpsInUse = this.itemService.countryBumpsInUse;
      });
      this.purchaseService.query().subscribe((purchases: PurchasesModel) => {
        this.purchases = purchases;
        this.loading = false;
      }, () => {
        this.loading = false;
      });
    });
  }

}
