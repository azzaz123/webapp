import {
  Component,
  Output,
  EventEmitter,
  Input,
  OnChanges,
} from '@angular/core';
import { Counters } from '../../../core/user/user-stats.interface';
import { PurchasesModel } from '../../../core/payments/purchase.model';
import { PerksModel } from '../../../core/payments/payment.model';
import { ScheduledStatus } from '../../../core/payments/payment.interface';
import { PaymentService } from '../../../core/payments/payment.service';

@Component({
  selector: 'tsl-plan-data',
  templateUrl: './plan-data.component.html',
  styleUrls: ['./plan-data.component.scss'],
})
export class PlanDataComponent implements OnChanges {
  @Output() subscriptionPlan: EventEmitter<number> = new EventEmitter<number>();
  @Input() counters: Counters;
  public purchases: PurchasesModel = new PurchasesModel();
  public perks: PerksModel;
  public status: ScheduledStatus;
  public loading: boolean = true;

  constructor(private paymentService: PaymentService) {}

  ngOnChanges() {
    this.getPerks(false);
  }

  private getPerks(cache: boolean = true): void {
    this.paymentService.getPerks(cache).subscribe((perks: PerksModel) => {
      this.perks = perks;
      this.subscriptionPlan.emit(
        perks.subscription ? perks.subscription.listing.quantity : 0
      );
      this.paymentService.getStatus().subscribe((status: ScheduledStatus) => {
        this.status = status;
        this.loading = false;
      });
    });
  }
}
