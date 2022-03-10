import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MOCK_TRANSACTION_TRACKING } from '@api/fixtures/core/model/transaction/tracking/transaction-tracking.fixtures.spec';
import { ButtonComponent } from '@shared/button/button.component';
import { ButtonModule } from '@shared/button/button.module';
import { LottieComponent } from '@shared/lottie/lottie.component';
import { LottieModule } from '@shared/lottie/lottie.module';
import { BypassHTMLModule } from '@shared/pipes/bypass-html/bypass-html.module';

import { TransactionTrackingGeneralInfoComponent } from './transaction-tracking-general-info.component';

describe('TransactionTrackingGeneralInfoComponent', () => {
  const MOCK_SHIPPING_STATUS = MOCK_TRANSACTION_TRACKING.shippingStatus;
  let component: TransactionTrackingGeneralInfoComponent;
  let fixture: ComponentFixture<TransactionTrackingGeneralInfoComponent>;
  let de: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionTrackingGeneralInfoComponent],
      imports: [ButtonModule, LottieModule, HttpClientTestingModule, BypassHTMLModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionTrackingGeneralInfoComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    component.shippingStatus = MOCK_SHIPPING_STATUS;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when we have the shipping status properties defined...', () => {
    it('should show the provided title', () => {
      const title: HTMLElement = de.query(By.css('.TrackingGeneralInfo__title')).nativeElement.innerHTML;

      expect(title).toEqual(component.shippingStatus.title);
    });

    it('should show the provided description', () => {
      const descriptionSanitized: HTMLElement = de.query(By.css('#shippingStatusDescription')).nativeElement.innerHTML;

      expect(descriptionSanitized).toEqual(component.shippingStatus.description);
    });

    it('should show the animation', () => {
      const animation: DebugElement = de.query(By.directive(LottieComponent));
      expect(animation).toBeTruthy();
    });

    describe('and we have actions', () => {
      it('should have the same action rows as actions', () => {
        const buttons = fixture.debugElement.queryAll(
          By.css('tsl-transaction-tracking-action-selector > .TrackingGeneralInfo__actionButton')
        );
        expect(buttons.length).toEqual(component.shippingStatus.actions.length);
      });

      MOCK_SHIPPING_STATUS.actions.forEach((action, index) => {
        it('should have the received state', () => {
          const CTAButtonElement: DebugElement = fixture.debugElement.queryAll(By.directive(ButtonComponent))[index];

          expect(CTAButtonElement.componentInstance.disabled).toBe(action.state.isDisabled);
        });
      });
    });
  });
});
