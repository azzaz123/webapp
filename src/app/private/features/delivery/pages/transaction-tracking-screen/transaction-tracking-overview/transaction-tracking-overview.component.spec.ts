import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TransactionTrackingService } from '@api/bff/delivery/transaction-tracking/transaction-tracking.service';
import { TransactionTracking, TransactionTrackingDetails } from '@api/core/model/delivery/transaction/tracking';
import { MOCK_TRANSACTION_TRACKING_DETAILS } from '@api/fixtures/core/model/transaction/tracking/transaction-tracking-details.fixtures.spec';
import { MOCK_TRANSACTION_TRACKING } from '@api/fixtures/core/model/transaction/tracking/transaction-tracking.fixtures.spec';
import { of } from 'rxjs';

import { TransactionTrackingOverviewComponent } from './transaction-tracking-overview.component';

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionTrackingOverviewComponent],
      providers: [
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
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionTrackingOverviewComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    transactionTrackingService = TestBed.inject(TransactionTrackingService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when we initialize the component...', () => {
    beforeEach(() => {
      spyOn(transactionTrackingService, 'get').and.returnValue(of(MOCK_TRANSACTION_TRACKING));
      spyOn(transactionTrackingService, 'getDetails').and.returnValue(of(MOCK_TRANSACTION_TRACKING_DETAILS));

      fixture.detectChanges();
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

      expect(transactionTrackingExpected).toStrictEqual(MOCK_TRANSACTION_TRACKING);
    });

    it('should save the requested transaction tracking details', () => {
      let transactionTrackingDetailsExpected: TransactionTrackingDetails;
      component.transactionTrackingDetails$.subscribe((transactionTrackingDetailsReceived: TransactionTrackingDetails) => {
        transactionTrackingDetailsExpected = transactionTrackingDetailsReceived;
      });

      expect(transactionTrackingDetailsExpected).toStrictEqual(MOCK_TRANSACTION_TRACKING_DETAILS);
    });
  });

  describe('when we NOT receive tracking info', () => {
    beforeEach(() => {
      spyOn(transactionTrackingService, 'get').and.returnValue(of(null));

      fixture.detectChanges();
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

    it('should NOT render the transaction tracking status info ', () => {
      expect(de.query(By.css(transactionTrackingDetailsStatusInfoWrapperSelector))).toBeFalsy();
    });
  });

  describe('when we receive tracking info...', () => {
    beforeEach(() => {
      spyOn(transactionTrackingService, 'get').and.returnValue(of(MOCK_TRANSACTION_TRACKING));

      fixture.detectChanges();
    });

    it('should render the transaction tracking header ', () => {
      expect(de.query(By.css(transactionTrackingHeaderSelector))).toBeTruthy();
    });

    it('should render the general info ', () => {
      expect(de.query(By.css(generalInfoSelector))).toBeTruthy();
    });

    it('should render the transaction tracking status info ', () => {
      expect(de.query(By.css(transactionTrackingStatusInfoWrapperSelector))).toBeTruthy();
    });
  });

  describe('when we receive tracking details info...', () => {
    beforeEach(() => {
      spyOn(transactionTrackingService, 'getDetails').and.returnValue(of(MOCK_TRANSACTION_TRACKING_DETAILS));

      fixture.detectChanges();
    });

    it('should render the transaction tracking status info ', () => {
      expect(de.query(By.css(transactionTrackingDetailsStatusInfoWrapperSelector))).toBeTruthy();
    });
  });
});
