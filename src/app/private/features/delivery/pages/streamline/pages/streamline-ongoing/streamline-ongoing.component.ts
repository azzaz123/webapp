import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DELIVERY_PATHS } from '@private/features/delivery/delivery-routing-constants';
import { HistoricElement } from '@shared/historic-list/interfaces/historic-element.interface';
import { HistoricList } from '@shared/historic-list/interfaces/historic-list.interface';
import { PATH_TO_ACCEPT_SCREEN, PRIVATE_PATHS } from '@private/private-routing-constants';
import { SharedErrorActionService } from '@shared/error-action';
import { StreamlineOngoingUIService } from '@private/features/delivery/pages/streamline/services/streamline-ongoing-ui/streamline-ongoing-ui.service';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Request } from '@api/core/model/delivery';
import { DeliveryPendingTransaction } from '@api/core/model/delivery/transaction/delivery-pending-transaction.interface';
import { DELIVERY_ONGOING_STATUS } from '@api/core/model/delivery/transaction/delivery-status/delivery-ongoing-status.enum';

@Component({
  selector: 'tsl-streamline-ongoing',
  templateUrl: './streamline-ongoing.component.html',
  styleUrls: ['./streamline-ongoing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StreamlineOngoingComponent implements OnInit, OnDestroy {
  public readonly loadingIconSrc: string = '/assets/icons/spinner.svg';
  public readonly loadingIconSizePixels: number = 32;

  constructor(
    private streamlineOngoingUIService: StreamlineOngoingUIService,
    private router: Router,
    private errorActionService: SharedErrorActionService
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
    const requestId: string = historicElement.id;

    if (isRequestAndSeller) {
      this.redirectToAcceptScreen(requestId);
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
  }

  private redirectToPage(page: string): void {
    this.router.navigate([page]);
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
