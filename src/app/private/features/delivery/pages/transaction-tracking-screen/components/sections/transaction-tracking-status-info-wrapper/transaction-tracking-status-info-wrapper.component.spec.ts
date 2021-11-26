import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MOCK_TRANSACTION_TRACKING_DETAILS } from '@api/fixtures/core/model/transaction/tracking/transaction-tracking-details.fixtures.spec';
import { ImageFallbackModule } from '@public/core/directives/image-fallback/image-fallback.module';
import { BypassHTMLModule } from '@shared/pipes/bypass-html/bypass-html.module';
import { TransactionTrackingStatusInfoComponent } from '../../transaction-tracking-status-info/transaction-tracking-status-info.component';

import { TransactionTrackingStatusInfoWrapperComponent } from './transaction-tracking-status-info-wrapper.component';

describe('TransactionTrackingStatusInfoWrapperComponent', () => {
  let component: TransactionTrackingStatusInfoWrapperComponent;
  let fixture: ComponentFixture<TransactionTrackingStatusInfoWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BypassHTMLModule, ImageFallbackModule],
      declarations: [TransactionTrackingStatusInfoWrapperComponent, TransactionTrackingStatusInfoComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionTrackingStatusInfoWrapperComponent);
    component = fixture.componentInstance;
    component.transactionTrackingsStatusInfo = MOCK_TRANSACTION_TRACKING_DETAILS.info;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when getting multiple transaction tracking status info ...', () => {
    it('should show the same slots as info', () => {
      const slots = fixture.debugElement.queryAll(By.directive(TransactionTrackingStatusInfoComponent)).length;
      expect(slots).toEqual(MOCK_TRANSACTION_TRACKING_DETAILS.info.length);
    });
  });
});
