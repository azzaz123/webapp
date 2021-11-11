import { Location } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MOCK_TRANSACTION_TRACKING } from '@fixtures/private/delivery/TTS/transaction-tracking.fixtures.spec';
import { of } from 'rxjs';

import { TransactionTrackingOverviewComponent } from './transaction-tracking-overview.component';

describe('TransactionTrackingOverviewComponent', () => {
  const transactionTrackingHeaderSelector = 'tsl-transaction-tracking-header';
  let component: TransactionTrackingOverviewComponent;
  let fixture: ComponentFixture<TransactionTrackingOverviewComponent>;
  let de: DebugElement;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [Location],
      declarations: [TransactionTrackingOverviewComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionTrackingOverviewComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    location = TestBed.inject(Location);
    component.transactionTrackingInfo$ = of(MOCK_TRANSACTION_TRACKING);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when we have tracking info...', () => {
    describe('and we click on header back button...', () => {
      it('should go back to the previous step', () => {
        spyOn(location, 'back');

        const headerComponent = fixture.debugElement.query(By.css(transactionTrackingHeaderSelector));
        headerComponent.triggerEventHandler('backClick', {});

        expect(location.back).toHaveBeenCalledTimes(1);
      });
    });
  });
});
