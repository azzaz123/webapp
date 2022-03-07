import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';

import { DeliveryBuyerDeliveryMethod } from '@api/core/model/delivery/buyer/delivery-methods';
import { PayviewDeliveryService } from '@private/features/payview/modules/delivery/services/payview-delivery.service';
import { PayviewService } from '@private/features/payview/services/payview/payview.service';
import { PayviewState } from '@private/features/payview/interfaces/payview-state.interface';
import { PayviewStateManagementService } from '@private/features/payview/services/state-management/payview-state-management.service';

import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'tsl-payview-modal',
  templateUrl: './payview-modal.component.html',
  styleUrls: ['./payview-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [PayviewService, PayviewStateManagementService],
})
export class PayviewModalComponent implements OnDestroy, OnInit {
  @Input() public itemHash: string;

  private deliveryMethodSubscription: Subscription;

  constructor(private payviewStateManagementService: PayviewStateManagementService, private deliveryService: PayviewDeliveryService) {}

  public ngOnDestroy(): void {
    this.unsubscribe();
  }

  public ngOnInit(): void {
    this.payviewStateManagementService.itemHash = this.itemHash;
    this.subscribe();
  }

  public get payviewState$(): Observable<PayviewState> {
    return this.payviewStateManagementService.payViewState$;
  }

  private subscribe(): void {
    this.subscribeToDeliveryMethod();
  }

  private subscribeToDeliveryMethod(): void {
    this.deliveryMethodSubscription = this.deliveryService.deliveryMethodSelected.subscribe(
      (deliveryMethod: DeliveryBuyerDeliveryMethod) => {
        this.payviewStateManagementService.setDeliveryMethod(deliveryMethod);
      }
    );
  }

  private unsubscribe(): void {
    this.unsubscribeFromDeliveryMethod();
  }

  private unsubscribeFromDeliveryMethod(): void {
    if (!!this.deliveryMethodSubscription) {
      this.deliveryMethodSubscription.unsubscribe();
    }
  }
}
