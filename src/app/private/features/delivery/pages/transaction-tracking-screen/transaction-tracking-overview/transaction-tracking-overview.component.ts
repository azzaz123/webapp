import { STREAMLINE_PATHS } from '@private/features/delivery/pages/streamline/streamline.routing.constants';
import { PRIVATE_PATHS, PATH_TO_ACCEPT_SCREEN, PATH_TO_PAYVIEW } from '@private/private-routing-constants';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';

import { DELIVERY_PATH_PARAMS, DELIVERY_PATHS } from '@private/features/delivery/delivery-routing-constants';
import { SharedErrorActionService } from '@shared/error-action';
import { TransactionTracking, TransactionTrackingDetails } from '@api/core/model/delivery/transaction/tracking';
import { TransactionTrackingScreenTrackingEventsService } from '@private/features/delivery/pages/transaction-tracking-screen/services/transaction-tracking-screen-tracking-events/transaction-tracking-screen-tracking-events.service';
import { TransactionTrackingService } from '@api/bff/delivery/transaction-tracking/transaction-tracking.service';

import { catchError, tap, filter } from 'rxjs/operators';
import { Observable, throwError, Subscription } from 'rxjs';
import { TransactionTrackingScreenStoreService } from '../services/transaction-tracking-screen-store/transaction-tracking-screen-store.service';
import { DeliveryRealTimeService } from '@private/core/services/delivery-real-time/delivery-real-time.service';

@Component({
  selector: 'tsl-transaction-tracking-overview',
  templateUrl: './transaction-tracking-overview.component.html',
  styleUrls: ['./transaction-tracking-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionTrackingOverviewComponent implements OnInit, OnDestroy {
  public transactionTracking$: Observable<TransactionTracking> = this.storeService.transactionTracking$;
  public transactionTrackingDetails$: Observable<TransactionTrackingDetails> = this.storeService.transactionTrackingDetails$;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private transactionTrackingService: TransactionTrackingService,
    private storeService: TransactionTrackingScreenStoreService,
    private transactionTrackingScreenTrackingEventsService: TransactionTrackingScreenTrackingEventsService,
    private errorActionService: SharedErrorActionService,
    private deliveryRealTimeService: DeliveryRealTimeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const requestId = this.route.snapshot.paramMap.get(DELIVERY_PATH_PARAMS.ID);
    this.initializeTransactionTrackingAndDetails(requestId, true);
    this.listenForDeliveryNotifications(requestId);

    this.checkIfUserGoesBack();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initializeTransactionTrackingAndDetails(requestId: string, trackInitEvent = false): void {
    this.subscriptions.add(this.getTransactionTracking(requestId, trackInitEvent).subscribe({ error: () => {} }));
    this.subscriptions.add(this.getTransactionTrackingDetails(requestId).subscribe({ error: () => {} }));
  }

  private listenForDeliveryNotifications(requestId: string): void {
    this.subscriptions.add(
      this.deliveryRealTimeService.deliveryRealTimeNotifications$.subscribe(() => this.initializeTransactionTrackingAndDetails(requestId))
    );
  }

  private getTransactionTracking(requestId: string, analytics: boolean): Observable<TransactionTracking> {
    return this.transactionTrackingService.get(requestId).pipe(
      tap((transactionTracking: TransactionTracking) => {
        if (analytics) {
          this.trackViewPageEvent(requestId, transactionTracking);
        }
        this.storeService.transactionTracking = transactionTracking;
      }),
      catchError((error: unknown) => this.handleError(error))
    );
  }

  private getTransactionTrackingDetails(requestId: string): Observable<TransactionTrackingDetails> {
    return this.transactionTrackingService.getDetails(requestId).pipe(
      tap((details: TransactionTrackingDetails) => {
        this.storeService.transactionTrackingDetails = details;
      }),
      catchError((error: unknown) => this.handleError(error))
    );
  }

  private trackViewPageEvent(requestId: string, transactionTracking: TransactionTracking): void {
    this.transactionTrackingScreenTrackingEventsService.trackViewTTSScreen(
      requestId,
      transactionTracking.analytics.buyer.country,
      transactionTracking.analytics.seller.country
    );
  }

  private checkIfUserGoesBack(): void {
    this.subscriptions.add(
      this.router.events.pipe(filter((event) => event instanceof NavigationStart)).subscribe((event: NavigationStart) => {
        const isUserGoingBack: boolean = event.navigationTrigger === 'popstate';

        if (isUserGoingBack) {
          if (this.isAcceptScreenRedirection(event.url)) {
            this.redirectToStreamlineOngoing();
          }
          if (this.isPayviewRedirection(event.url)) {
            this.redirectToPage(PRIVATE_PATHS.CHAT);
          }
        }
      })
    );
  }

  private isAcceptScreenRedirection(url: string): boolean {
    return url.includes(PATH_TO_ACCEPT_SCREEN);
  }

  private isPayviewRedirection(url: string): boolean {
    return url.includes(PATH_TO_PAYVIEW);
  }

  private redirectToStreamlineOngoing(): void {
    const pathToStreamlineOngoing: string = `${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.SELLS}/${STREAMLINE_PATHS.ONGOING}`;
    this.redirectToPage(pathToStreamlineOngoing);
  }

  private redirectToPage(page: string): void {
    this.router.navigate([page]);
  }

  private handleError(error: unknown): Observable<never> {
    this.errorActionService.show(error);
    return throwError(error);
  }
}
