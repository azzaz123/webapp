import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TransactionTrackingService } from '@api/bff/delivery/transaction-tracking/transaction-tracking.service';
import { MOCK_TRANSACTION_TRACKING } from '@api/fixtures/core/model/transaction/tracking/transaction-tracking.fixtures.spec';
import { of } from 'rxjs';

import { TransactionTrackingOverviewComponent } from './transaction-tracking-overview.component';

describe('TransactionTrackingOverviewComponent', () => {
  const transactionTrackingHeaderSelector = 'tsl-transaction-tracking-header';
  let component: TransactionTrackingOverviewComponent;
  let fixture: ComponentFixture<TransactionTrackingOverviewComponent>;
  let de: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionTrackingOverviewComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '123',
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
    component.transactionTracking$ = of(MOCK_TRANSACTION_TRACKING);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when we have tracking info...', () => {
    it('should render the transaction tracking header ', () => {
      expect(de.query(By.css(transactionTrackingHeaderSelector))).toBeTruthy();
    });
  });
});
