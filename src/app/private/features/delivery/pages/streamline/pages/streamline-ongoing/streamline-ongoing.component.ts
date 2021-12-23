import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DELIVERY_PATHS } from '@private/features/delivery/delivery-routing-constants';
import { HistoricElement } from '@shared/historic-list/interfaces/historic-element.interface';
import { HistoricList } from '@shared/historic-list/interfaces/historic-list.interface';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { SharedErrorActionService } from '@shared/error-action';
import { StreamlineOngoingUIService } from '@private/features/delivery/pages/streamline/services/streamline-ongoing-ui/streamline-ongoing-ui.service';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PendingTransaction } from '@api/core/model';
import { Request } from '@api/core/model/delivery';

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
    this.streamlineOngoingUIService.getItems();
  }

  ngOnDestroy(): void {
    this.streamlineOngoingUIService.reset();
  }

  public onItemClick(historicElement: HistoricElement<PendingTransaction | Request>): void {
    const requestId: string = this.isPendingTransaction(historicElement) ? historicElement.payload.requestId : historicElement.id;
    const pathToTransactionTracking = `${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.TRACKING}/${requestId}`;
    this.router.navigate([pathToTransactionTracking]);
  }

  private isPendingTransaction(input: HistoricElement<PendingTransaction | Request>): input is HistoricElement<PendingTransaction> {
    return (<HistoricElement<PendingTransaction>>input).payload.requestId !== undefined;
  }
}
