import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { TransactionTrackingBannerComponent } from '@private/features/delivery/pages/transaction-tracking-screen/components/banner/transaction-tracking-banner.component';

describe('TransactionTrackingBannerComponent', () => {
  let component: TransactionTrackingBannerComponent;
  let fixture: ComponentFixture<TransactionTrackingBannerComponent>;
  let de: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionTrackingBannerComponent],
      imports: [],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionTrackingBannerComponent);
    de = fixture.debugElement;
    component = fixture.componentInstance;
    component.banner = {
      title: 'Código de envío',
      trackingCode: '1234567890',
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when we have the properties defined...', () => {
    beforeEach(() => {
      fixture.detectChanges();
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
