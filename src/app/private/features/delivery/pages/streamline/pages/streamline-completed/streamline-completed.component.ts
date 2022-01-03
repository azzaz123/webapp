import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DELIVERY_PATHS } from '@private/features/delivery/delivery-routing-constants';
import { HistoricElement } from '@shared/historic-list/interfaces/historic-element.interface';
import { HistoricList } from '@shared/historic-list/interfaces/historic-list.interface';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { SharedErrorActionService } from '@shared/error-action';
import { StreamlineCompletedUIService } from '@private/features/delivery/pages/streamline/services/streamline-completed-ui/streamline-completed-ui.service';

import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { HistoricTransaction } from '@api/core/model';

@Component({
  selector: 'tsl-streamline-completed',
  templateUrl: './streamline-completed.component.html',
  styleUrls: ['./streamline-completed.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StreamlineCompletedComponent implements OnInit, OnDestroy {
  public loadingIconSrc: string = '/assets/icons/spinner.svg';
  public loadingIconSizePixels: number = 32;

  constructor(
    private streamlineCompletedUIService: StreamlineCompletedUIService,
    private router: Router,
    private errorActionService: SharedErrorActionService
  ) {}

  public get infiniteScrollDisabled(): boolean {
    return this.streamlineCompletedUIService.infiniteScrollDisabled;
  }

  public get loading$(): Observable<boolean> {
    return this.streamlineCompletedUIService.loading$;
  }

  public get historicList$(): Observable<HistoricList> {
    return this.streamlineCompletedUIService.historicList$.pipe(
      catchError((error: unknown) => {
        this.errorActionService.show(error);
        return throwError(error);
      })
    );
  }

  ngOnInit() {
    this.getItems();
  }

  ngOnDestroy() {
    this.streamlineCompletedUIService.reset();
  }

  public getItems(): void {
    this.streamlineCompletedUIService.getItems();
  }

  public onItemClick(historicElement: HistoricElement<HistoricTransaction>): void {
    const pathToTransactionTracking = `${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.TRACKING}/${historicElement.payload.requestId}`;
    this.router.navigate([pathToTransactionTracking]);
  }
}
