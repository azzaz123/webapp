import { ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';

import { MOCK_TRANSACTION_TRACKING } from '@api/fixtures/core/model/transaction/tracking/transaction-tracking.fixtures.spec';
import { MOCK_TRANSACTION_TRACKING_DETAILS } from '@api/fixtures/core/model/transaction/tracking/transaction-tracking-details.fixtures.spec';
import { MockSharedErrorActionService } from '@fixtures/private/wallet/shared/wallet-shared-error-action.fixtures.spec';
import { SharedErrorActionService } from '@shared/error-action';
import { TransactionTracking, TransactionTrackingDetails } from '@api/core/model/delivery/transaction/tracking';
import { TransactionTrackingOverviewComponent } from '@private/features/delivery/pages/transaction-tracking-screen/transaction-tracking-overview/transaction-tracking-overview.component';
import { TransactionTrackingScreenStoreService } from '@private/features/delivery/pages/transaction-tracking-screen/services/transaction-tracking-screen-store/transaction-tracking-screen-store.service';
import { TransactionTrackingScreenTrackingEventsService } from '@private/features/delivery/pages/transaction-tracking-screen/services/transaction-tracking-screen-tracking-events/transaction-tracking-screen-tracking-events.service';
import { TransactionTrackingService } from '@api/bff/delivery/transaction-tracking/transaction-tracking.service';

import { of, throwError } from 'rxjs';

describe('TransactionTrackingOverviewComponent', () => {
  const MOCK_TRANSACTION_TRACKING_ID = 'Laia';

  const transactionTrackingHeaderSelector = 'tsl-transaction-tracking-header';
  const generalInfoSelector = 'tsl-transaction-tracking-general-info';
  const transactionTrackingStatusInfoWrapperSelector = '#transactionTrackingStatusInfoWrapper';
  const transactionTrackingDetailsStatusInfoWrapperSelector = '#transactionTrackingDetailsStatusInfoWrapper';

  let component: TransactionTrackingOverviewComponent;
  let fixture: ComponentFixture<TransactionTrackingOverviewComponent>;
  let de: DebugElement;
  let transactionTrackingService: TransactionTrackingService;
  let transactionTrackingScreenStoreService: TransactionTrackingScreenStoreService;
  let transactionTrackingScreenTrackingEventsService: TransactionTrackingScreenTrackingEventsService;
  let errorActionService: SharedErrorActionService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionTrackingOverviewComponent],
      providers: [
        {
          provide: TransactionTrackingScreenTrackingEventsService,
          useValue: {
            trackViewTTSScreen() {},
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => MOCK_TRANSACTION_TRACKING_ID,
              },
            },
          },
        },
        {
          provide: TransactionTrackingService,
          useValue: {
            get() {
              return of(MOCK_TRANSACTION_TRACKING);
            },
            getDetails() {
              return of(MOCK_TRANSACTION_TRACKING_DETAILS);
            },
          },
        },
        {
          provide: SharedErrorActionService,
          useValue: MockSharedErrorActionService,
        },
        TransactionTrackingScreenStoreService,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionTrackingOverviewComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    transactionTrackingService = TestBed.inject(TransactionTrackingService);
    transactionTrackingScreenStoreService = TestBed.inject(TransactionTrackingScreenStoreService);
    transactionTrackingScreenTrackingEventsService = TestBed.inject(TransactionTrackingScreenTrackingEventsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when we enter the TTS page', () => {
    beforeEach(() => {
      spyOn(transactionTrackingService, 'get').and.returnValue(of(MOCK_TRANSACTION_TRACKING));
      spyOn(transactionTrackingService, 'getDetails').and.returnValue(of(MOCK_TRANSACTION_TRACKING_DETAILS));
      spyOn(transactionTrackingScreenTrackingEventsService, 'trackViewTTSScreen');

      fixture.detectChanges();
    });

    it('should update the transaction tracking store', () => {
      transactionTrackingScreenStoreService.transactionTracking$.subscribe((expectedValue: TransactionTracking) => {
        expect(expectedValue).toStrictEqual(MOCK_TRANSACTION_TRACKING);
      });
    });

    it('should update the transaction tracking details store', () => {
      transactionTrackingScreenStoreService.transactionTrackingDetails$.subscribe((expectedValue: TransactionTrackingDetails) => {
        expect(expectedValue).toStrictEqual(MOCK_TRANSACTION_TRACKING_DETAILS);
      });
    });

    it('should track the view TTS screen event', () => {
      expect(transactionTrackingScreenTrackingEventsService.trackViewTTSScreen).toHaveBeenCalledTimes(1);
      expect(transactionTrackingScreenTrackingEventsService.trackViewTTSScreen).toHaveBeenCalledWith(
        MOCK_TRANSACTION_TRACKING_ID,
        MOCK_TRANSACTION_TRACKING.analytics.buyer.country,
        MOCK_TRANSACTION_TRACKING.analytics.seller.country
      );
    });

    it('should request the transaction tracking with the id param', () => {
      expect(transactionTrackingService.get).toHaveBeenCalledTimes(1);
      expect(transactionTrackingService.get).toHaveBeenCalledWith(MOCK_TRANSACTION_TRACKING_ID);
    });

    it('should request the transaction tracking details with the id param', () => {
      expect(transactionTrackingService.getDetails).toHaveBeenCalledTimes(1);
      expect(transactionTrackingService.getDetails).toHaveBeenCalledWith(MOCK_TRANSACTION_TRACKING_ID);
    });

    it('should save the requested transaction tracking', () => {
      let transactionTrackingExpected: TransactionTracking;
      component.transactionTracking$.subscribe((transactionTrackingReceived: TransactionTracking) => {
        transactionTrackingExpected = transactionTrackingReceived;
      });

      component.ngOnInit();

      expect(transactionTrackingExpected).toStrictEqual(MOCK_TRANSACTION_TRACKING);
    });

    it('should save the requested transaction tracking details', () => {
      let transactionTrackingDetailsExpected: TransactionTrackingDetails;
      component.transactionTrackingDetails$.subscribe((transactionTrackingDetailsReceived: TransactionTrackingDetails) => {
        transactionTrackingDetailsExpected = transactionTrackingDetailsReceived;
      });

      component.ngOnInit();

      expect(transactionTrackingDetailsExpected).toStrictEqual(MOCK_TRANSACTION_TRACKING_DETAILS);
    });
  });

  describe('when we NOT receive tracking info', () => {
    beforeEach(() => {
      spyOn(transactionTrackingService, 'get').and.returnValue(of(null));

      fixture.detectChanges();
    });

    it('should update the transaction tracking store', () => {
      transactionTrackingScreenStoreService.transactionTracking$.subscribe((expectedValue: TransactionTracking) => {
        expect(expectedValue).toStrictEqual(null);
      });
    });

    it('should NOT render the transaction tracking header ', () => {
      expect(de.query(By.css(transactionTrackingHeaderSelector))).toBeFalsy();
    });

    it('should NOT render the general info ', () => {
      expect(de.query(By.css(generalInfoSelector))).toBeFalsy();
    });

    it('should NOT render the transaction tracking status info ', () => {
      expect(de.query(By.css(transactionTrackingStatusInfoWrapperSelector))).toBeFalsy();
    });
  });

  describe('when we NOT receive tracking details info', () => {
    beforeEach(() => {
      spyOn(transactionTrackingService, 'getDetails').and.returnValue(of(null));

      fixture.detectChanges();
    });

    it('should update the transaction tracking store', () => {
      transactionTrackingScreenStoreService.transactionTrackingDetails$.subscribe((expectedValue: TransactionTrackingDetails) => {
        expect(expectedValue).toStrictEqual(null);
      });
    });

    it('should NOT render the transaction tracking status info ', () => {
      expect(de.query(By.css(transactionTrackingDetailsStatusInfoWrapperSelector))).toBeFalsy();
    });
  });

  describe('when we receive tracking info...', () => {
    beforeEach(() => {
      spyOn(transactionTrackingService, 'get').and.returnValue(of(MOCK_TRANSACTION_TRACKING));

      fixture.detectChanges();
    });

    it('should render the transaction tracking header ', fakeAsync(() => {
      component.transactionTracking$.subscribe(() => {
        fixture.detectChanges();

        expect(de.query(By.css(transactionTrackingHeaderSelector))).toBeTruthy();

        flush();
      });

      component.ngOnInit();
      tick();
    }));

    it('should render the general info ', fakeAsync(() => {
      component.transactionTracking$.subscribe(() => {
        fixture.detectChanges();

        expect(de.query(By.css(generalInfoSelector))).toBeTruthy();

        flush();
      });

      component.ngOnInit();
      tick();
    }));

    it('should render the transaction tracking status info ', fakeAsync(() => {
      component.transactionTracking$.subscribe(() => {
        fixture.detectChanges();

        expect(de.query(By.css(transactionTrackingStatusInfoWrapperSelector))).toBeTruthy();

        flush();
      });

      component.ngOnInit();
      tick();
    }));
  });

  describe('when we receive tracking details info...', () => {
    beforeEach(() => {
      spyOn(transactionTrackingService, 'getDetails').and.returnValue(of(MOCK_TRANSACTION_TRACKING_DETAILS));

      fixture.detectChanges();
    });

    it('should render the transaction tracking status info ', fakeAsync(() => {
      component.transactionTrackingDetails$.subscribe(() => {
        fixture.detectChanges();

        expect(de.query(By.css(transactionTrackingDetailsStatusInfoWrapperSelector))).toBeTruthy();

        flush();
      });

      component.ngOnInit();
      tick();
    }));
  });

  describe('WHEN there is an error retrieving data', () => {
    let errorActionSpy;

    beforeEach(() => {
      errorActionService = TestBed.inject(SharedErrorActionService);
      errorActionSpy = spyOn(errorActionService, 'show');
    });

    describe('WHEN there is an error retrieving the transaction tracking', () => {
      beforeEach(() => {
        transactionTrackingService = TestBed.inject(TransactionTrackingService);
        spyOn(transactionTrackingService, 'get').and.returnValue(throwError('The server is broken'));

        fixture = TestBed.createComponent(TransactionTrackingOverviewComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;

        fixture.detectChanges();
      });

      it('should show the generic error catcher', fakeAsync(() => {
        expect(errorActionSpy).toHaveBeenCalledTimes(1);
      }));
    });

    describe('WHEN there is an error retrieving the transaction tracking details', () => {
      beforeEach(() => {
        transactionTrackingService = TestBed.inject(TransactionTrackingService);
        spyOn(transactionTrackingService, 'getDetails').and.returnValue(throwError('The server is broken'));

        fixture = TestBed.createComponent(TransactionTrackingOverviewComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;

        fixture.detectChanges();
      });

      it('should show the generic error catcher', fakeAsync(() => {
        expect(errorActionSpy).toHaveBeenCalledTimes(1);
      }));
    });
  });
});
