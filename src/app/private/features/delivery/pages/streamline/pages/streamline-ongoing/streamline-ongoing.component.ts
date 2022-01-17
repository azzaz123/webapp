import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DELIVERY_PATHS } from '@private/features/delivery/delivery-routing-constants';
import { HistoricElement } from '@shared/historic-list/interfaces/historic-element.interface';
import { HistoricList } from '@shared/historic-list/interfaces/historic-list.interface';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { SharedErrorActionService } from '@shared/error-action';
import { StreamlineOngoingUIService } from '@private/features/delivery/pages/streamline/services/streamline-ongoing-ui/streamline-ongoing-ui.service';

import { Observable, throwError } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { Request } from '@api/core/model/delivery';
import { AcceptScreenAwarenessModalComponent } from '@private/features/delivery/modals/accept-screen-awareness-modal/accept-screen-awareness-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeliveryPendingTransaction } from '@api/core/model/delivery/transaction/delivery-pending-transaction.interface';
import { DELIVERY_ONGOING_STATUS } from '@api/core/model/delivery/transaction/delivery-status/delivery-ongoing-status.enum';
import { FeatureFlagService } from '@core/user/featureflag.service';
import { FEATURE_FLAGS_ENUM } from '@core/user/featureflag-constants';

export const PATH_TO_ACCEPT_SCREEN: string = `${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.ACCEPT_SCREEN}/`;
@Component({
  selector: 'tsl-streamline-ongoing',
  templateUrl: './streamline-ongoing.component.html',
  styleUrls: ['./streamline-ongoing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StreamlineOngoingComponent implements OnInit, OnDestroy {
  public readonly loadingIconSrc: string = '/assets/icons/spinner.svg';
  public readonly loadingIconSizePixels: number = 32;

  private isDeliveryFlagEnabled: boolean;

  constructor(
    private streamlineOngoingUIService: StreamlineOngoingUIService,
    private router: Router,
    private errorActionService: SharedErrorActionService,
    private modalService: NgbModal,
    private featureflagService: FeatureFlagService
  ) {}

  public get historicList$(): Observable<HistoricList> {
    return this.streamlineOngoingUIService.historicList$.pipe(
      catchError((error: unknown) => {
        this.errorActionService.show(error);
        return throwError(error);
      })
    );
  }

  public get loading$(): Observable<boolean> {
    return this.streamlineOngoingUIService.loading$;
  }

  ngOnInit(): void {
    this.streamlineOngoingUIService.getItems(this.isSellsPage);
  }

  ngOnDestroy(): void {
    this.streamlineOngoingUIService.reset();
  }

  public onItemClick(historicElement: HistoricElement<DeliveryPendingTransaction | Request>): void {
    const isPendingTransaction: boolean = this.isPendingTransaction(historicElement);
    const isRequestAndSeller: boolean = !isPendingTransaction && historicElement.payload.isCurrentUserTheSeller;
    this.checkDeliveryFlagStatus();

    if (isRequestAndSeller) {
      if (this.isDeliveryFlagEnabled) {
        this.redirectToAcceptScreen();
      } else {
        this.openAcceptScreenAwarenessModal();
      }
      return;
    }

    this.redirectToTTS(historicElement.id);
  }

  private redirectToTTS(requestId: string): void {
    const pathToTransactionTracking = `${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.TRACKING}/${requestId}`;
    this.router.navigate([pathToTransactionTracking]);
  }

  private redirectToAcceptScreen(): void {
    this.router.navigate([`${PATH_TO_ACCEPT_SCREEN}`]);
  }

  private checkDeliveryFlagStatus(): void {
    this.featureflagService
      .getLocalFlag(FEATURE_FLAGS_ENUM.DELIVERY)
      .pipe(take(1))
      .subscribe((isActive: boolean) => {
        this.isDeliveryFlagEnabled = isActive;
      });
  }

  private openAcceptScreenAwarenessModal(): void {
    this.modalService.open(AcceptScreenAwarenessModalComponent).result.then(
      () => {},
      () => {}
    );
  }

  private isPendingTransaction(
    input: HistoricElement<DeliveryPendingTransaction | Request>
  ): input is HistoricElement<DeliveryPendingTransaction> {
    return (<HistoricElement<DeliveryPendingTransaction>>input).payload.status.name !== DELIVERY_ONGOING_STATUS.REQUEST_CREATED;
  }

  private get isSellsPage(): boolean {
    return this.router.url.includes(`/${DELIVERY_PATHS.SELLS}`);
  }
}
