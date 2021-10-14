import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AnalyticsService } from '@core/analytics/analytics.service';
import { ButtonComponent } from '@shared/button/button.component';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { StepDirective } from '@shared/stepper/step.directive';
import { StepperComponent } from '@shared/stepper/stepper.component';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { WalletTransferAmountComponent } from '@private/features/wallet/modals/transfer/components/amount/wallet-transfer-amount.component';
import { WalletTransferAmountModel } from '@private/features/wallet/modals/transfer/models/wallet-transfer-amount.model';
import { WalletTransferConfirmComponent } from '@private/features/wallet/modals/transfer/components/confirm/wallet-transfer-confirm.component';
import { WalletTransferMainComponent } from '@private/features/wallet/modals/transfer/components/main/wallet-transfer-main.component';
import { WalletTransferTrackingEventService } from '@private/features/wallet/modals/transfer/services/wallet-transfer-tracking-event.service';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('GIVEN the WalletTransferMainComponent', () => {
  let component: WalletTransferMainComponent;
  let fixture: ComponentFixture<WalletTransferMainComponent>;
  let ngbActiveModal: NgbActiveModal;
  let toastService: ToastService;

  const amountStepId = 0;
  const confirmationStepId = 1;
  const walletTransferAmountSelector = 'tsl-wallet-transfer-amount';
  const walletTransferConfirmSelector = 'tsl-wallet-transfer-confirm';
  const walletTransferModalSelector = '.WalletTransferModal';
  const walletTransferModalCloseSelector = `${walletTransferModalSelector}__close`;
  const walletTransferModalContentSelector = `${walletTransferModalSelector}__content`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ButtonComponent,
        StepDirective,
        StepperComponent,
        SvgIconComponent,
        WalletTransferAmountComponent,
        WalletTransferConfirmComponent,
        WalletTransferMainComponent,
      ],
      imports: [HttpClientTestingModule],
      providers: [
        NgbActiveModal,
        ToastService,
        { provide: AnalyticsService, useClass: MockAnalyticsService },
        {
          provide: WalletTransferTrackingEventService,
          useValue: {
            trackConfirmTransferBankAccount() {},
            trackSelectTransferAmount() {},
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    ngbActiveModal = TestBed.inject(NgbActiveModal);
    toastService = TestBed.inject(ToastService);
    fixture = TestBed.createComponent(WalletTransferMainComponent);
    component = fixture.componentInstance;
  });

  describe('WHEN displaying the view', () => {
    it('should be created', () => {
      expect(component).toBeTruthy();
    });

    it('should have the content block ', () => {
      const walletTransferMainContentStyle = fixture.debugElement.query(By.css(walletTransferModalContentSelector));

      expect(walletTransferMainContentStyle).toBeTruthy();
    });

    it('should show the free comissions message', () => {
      const expectedMessage = {
        type: 'success',
        text: $localize`:@@make_transfer_view_snackbar_no_commissions_description:Transfers are free, forget about fees.`,
      };
      spyOn(toastService, 'show').and.callFake(() => {});

      component.ngOnInit();

      expect(toastService.show).toBeCalledTimes(1);
      expect(toastService.show).toHaveBeenCalledWith(jasmine.objectContaining(expectedMessage));
    });
  });

  describe('WHEN they click on the cross button', () => {
    it('should close the modal', () => {
      const closeModalSpy = spyOn(ngbActiveModal, 'close');

      fixture.debugElement.query(By.css(walletTransferModalCloseSelector)).nativeElement.click();

      expect(closeModalSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('WHEN using the stepper', () => {
    describe('AND WHEN they are on the view corresponding to the amount', () => {
      const payload = new WalletTransferAmountModel(13);
      const triggerEventHandler = 'transfered';
      let walletTransferAmountComponent;

      beforeEach(() => {
        component.stepper.activeId = amountStepId;
        fixture.detectChanges();

        walletTransferAmountComponent = fixture.debugElement.query(By.css(walletTransferAmountSelector));
      });

      it('should receive the payload before going to the next step', () => {
        spyOn(component, 'goNextStep');

        walletTransferAmountComponent.triggerEventHandler(triggerEventHandler, payload);

        expect(component.goNextStep).toHaveBeenCalledTimes(1);
        expect(component.goNextStep).toHaveBeenCalledWith(jasmine.objectContaining(payload));
      });

      it('should go to the next step', () => {
        spyOn(component.stepper, 'goNext');

        walletTransferAmountComponent.triggerEventHandler(triggerEventHandler, payload);

        expect(component.stepper.goNext).toHaveBeenCalledTimes(1);
      });
    });
    describe('AND WHEN it is on the view corresponding to the confirmation', () => {
      const payload = undefined;
      const triggerEventHandler = 'canceled';
      let walletTransferConfirmComponent;

      beforeEach(() => {
        component.stepper.activeId = confirmationStepId;
        fixture.detectChanges();

        walletTransferConfirmComponent = fixture.debugElement.query(By.css(walletTransferConfirmSelector));
      });

      it('should not receive any payload before going to the next step', () => {
        spyOn(component, 'goPreviousStep');

        walletTransferConfirmComponent.triggerEventHandler(triggerEventHandler, payload);

        expect(component.goPreviousStep).toHaveBeenCalledTimes(1);
      });

      it('should go to the previous step', () => {
        spyOn(component.stepper, 'goBack');

        walletTransferConfirmComponent.triggerEventHandler(triggerEventHandler, payload);

        expect(component.stepper.goBack).toHaveBeenCalledTimes(1);
      });
    });
  });
});
