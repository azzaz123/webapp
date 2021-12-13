import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { BypassHTMLModule } from '@shared/pipes/bypass-html/bypass-html.module';
import { MOCK_TRANSACTION_TRACKING_BANNER_2 } from '@api/fixtures/core/model/transaction/tracking/transaction-tracking-instructions.fixtures.spec';
import { TransactionTrackingBannerComponent } from '@private/features/delivery/pages/transaction-tracking-screen/components/banner/transaction-tracking-banner.component';

describe('TransactionTrackingBannerComponent', () => {
  let component: TransactionTrackingBannerComponent;
  let fixture: ComponentFixture<TransactionTrackingBannerComponent>;
  let de: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionTrackingBannerComponent],
      imports: [BypassHTMLModule],
    }).compileComponents();
  });

  describe('when we have the properties defined...', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(TransactionTrackingBannerComponent);
      de = fixture.debugElement;
      component = fixture.componentInstance;
      component.banner = MOCK_TRANSACTION_TRACKING_BANNER_2;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should show the provided title', () => {
      const descriptionSanitized: HTMLElement = de.query(By.css('.TransactionTrackingBanner__titleWrapper')).nativeElement.innerHTML;

      expect(descriptionSanitized).toEqual(component.banner.title);
    });

    it('should show the provided tracking code', () => {
      const trackingCode: HTMLElement = de.query(By.css('.TransactionTrackingBanner__trackingCodeWrapper')).nativeElement.innerHTML;

      expect(trackingCode).toEqual(component.banner.trackingCode);
    });
  });
});
