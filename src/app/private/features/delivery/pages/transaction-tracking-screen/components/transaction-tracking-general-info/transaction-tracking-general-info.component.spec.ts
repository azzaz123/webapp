import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MOCK_TRANSACTION_TRACKING } from '@api/fixtures/core/model/transaction/tracking/transaction-tracking.fixtures.spec';
import { TransactionTrackingActionsService } from '@private/features/delivery/services/transaction-tracking/transaction-tracking-actions/transaction-tracking-actions.service';
import { ButtonComponent } from '@shared/button/button.component';
import { ButtonModule } from '@shared/button/button.module';
import { LottieComponent } from '@shared/lottie/lottie.component';
import { LottieModule } from '@shared/lottie/lottie.module';

import { TransactionTrackingGeneralInfoComponent } from './transaction-tracking-general-info.component';

describe('TransactionTrackingGeneralInfoComponent', () => {
  const MOCK_SHIPPING_STATUS = MOCK_TRANSACTION_TRACKING.shippingStatus;
  let transactionTrackingActionsService: TransactionTrackingActionsService;
  let component: TransactionTrackingGeneralInfoComponent;
  let fixture: ComponentFixture<TransactionTrackingGeneralInfoComponent>;
  let de: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionTrackingGeneralInfoComponent],
      imports: [ButtonModule, LottieModule, HttpClientTestingModule],
      providers: [TransactionTrackingActionsService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionTrackingGeneralInfoComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    transactionTrackingActionsService = TestBed.inject(TransactionTrackingActionsService);
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
      it('should have the same buttons as actions', () => {
        const buttons = fixture.debugElement.queryAll(By.directive(ButtonComponent));
        expect(buttons.length).toEqual(component.shippingStatus.actions.length);
      });

      MOCK_SHIPPING_STATUS.actions.forEach((action, index) => {
        it('should have the received state', () => {
          const CTAButtonElement: DebugElement = fixture.debugElement.queryAll(By.directive(ButtonComponent))[index];

          expect(CTAButtonElement.componentInstance.disabled).toBe(action.state.isDisabled);
        });

        describe('and we click on the CTA button', () => {
          it('should manage the provided action', () => {
            spyOn(transactionTrackingActionsService, 'manageAction');
            const CTAButtonElement: DebugElement = fixture.debugElement.queryAll(By.directive(ButtonComponent))[index];

            CTAButtonElement.nativeElement.click();

            expect(transactionTrackingActionsService.manageAction).toHaveBeenCalledTimes(1);
            expect(transactionTrackingActionsService.manageAction).toHaveBeenCalledWith(action.action);
          });
        });
      });
    });
  });
});
