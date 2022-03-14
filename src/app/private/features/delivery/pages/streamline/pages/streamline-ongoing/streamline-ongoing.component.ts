import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Router, RouteConfigLoadStart } from '@angular/router';

import { DELIVERY_PATHS } from '@private/features/delivery/delivery-routing-constants';
import { HistoricElement } from '@shared/historic-list/interfaces/historic-element.interface';
import { HistoricList } from '@shared/historic-list/interfaces/historic-list.interface';
import { PATH_TO_ACCEPT_SCREEN, PRIVATE_PATHS } from '@private/private-routing-constants';
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
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'tsl-streamline-ongoing',
  templateUrl: './streamline-ongoing.component.html',
  styleUrls: ['./streamline-ongoing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StreamlineOngoingComponent implements OnInit, OnDestroy {
  public readonly loadingIconSrc: string = '/assets/icons/spinner.svg';
  public readonly loadingIconSizePixels: number = 32;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private streamlineOngoingUIService: StreamlineOngoingUIService,
    private router: Router,
    private errorActionService: SharedErrorActionService,
    private modalService: NgbModal,
    private featureflagService: FeatureFlagService,
    private renderer2: Renderer2
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
    this.subscriptions.unsubscribe();
  }

  public onItemClick(historicElement: HistoricElement<DeliveryPendingTransaction | Request>): void {
    const isPendingTransaction: boolean = this.isPendingTransaction(historicElement);
    const isRequestAndSeller: boolean = !isPendingTransaction && historicElement.payload.isCurrentUserTheSeller;
    const requestId: string = historicElement.id;

    if (isRequestAndSeller) {
      this.isDeliveryFlagEnabled.subscribe((isEnabled: boolean) => {
        if (isEnabled) {
          this.redirectToAcceptScreen(requestId);
        } else {
          this.openAcceptScreenAwarenessModal();
        }
      });
    } else {
      this.redirectToTTS(requestId);
    }
  }

  private redirectToTTS(requestId: string): void {
    const pathToTransactionTracking = `${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.TRACKING}/${requestId}`;
    this.redirectToPage(pathToTransactionTracking);
  }

  private redirectToAcceptScreen(requestId: string): void {
    const pathToAcceptScreenWithRequestId: string = `${PATH_TO_ACCEPT_SCREEN}/${requestId}`;
    this.redirectToPage(pathToAcceptScreenWithRequestId);
    this.removeRouteLoadingSpinner();
  }

  private removeRouteLoadingSpinner(): void {
    const subscription: Subscription = this.router.events.subscribe((event) => {
      if (event instanceof RouteConfigLoadStart) {
        this.renderer2.removeClass(document.body, 'route-loading');
      }
    });
    this.subscriptions.add(subscription);
  }

  private redirectToPage(page: string): void {
    this.router.navigate([page]);
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

  private get isDeliveryFlagEnabled(): Observable<boolean> {
    return this.featureflagService.getLocalFlag(FEATURE_FLAGS_ENUM.DELIVERY).pipe(take(1));
  }

  private get isSellsPage(): boolean {
    return this.router.url.includes(`/${DELIVERY_PATHS.SELLS}`);
  }
}
