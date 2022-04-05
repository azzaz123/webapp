import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from '@shared/button/button.component';
import { PayviewBuyOverviewComponent } from '@private/features/payview/modules/buy/components/overview/payview-buy-overview.component';
import { PayviewBuyService } from '../../services/payview-buy.service';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { MockToastService } from '@fixtures/toast-service.fixtures.spec';
import {
  MOCK_PAYVIEW_STATE,
  MOCK_PAYVIEW_STATE_DOPO_WITHOUT_LASTADDRESSUSED,
} from '@fixtures/private/delivery/payview/payview-state.fixtures.spec';
import { EmptyPostOfficeAddressError } from '@api/core/errors/delivery/payview/pre-payment';
import { TOAST_TYPES } from '@layout/toast/core/interfaces/toast.interface';
import { By } from '@angular/platform-browser';

describe('PayviewBuyOverviewComponent', () => {
  let component: PayviewBuyOverviewComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<PayviewBuyOverviewComponent>;
  let payviewBuyService: PayviewBuyService;
  let toastService: ToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ButtonComponent, PayviewBuyOverviewComponent],
      imports: [],
      providers: [
        {
          provide: PayviewBuyService,
          useValue: {
            on() {},
            buy() {},
          },
        },
        {
          provide: ToastService,
          useClass: MockToastService,
        },
      ],
    }).compileComponents();
  });

  describe('WHEN initializes', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(PayviewBuyOverviewComponent);
      payviewBuyService = TestBed.inject(PayviewBuyService);
      toastService = TestBed.inject(ToastService);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    describe('and we click on the buy button', () => {
      beforeEach(() => {
        spyOn(toastService, 'show');
        spyOn(payviewBuyService, 'buy');
      });

      describe('and there is any error', () => {
        beforeEach(() => {
          component.payviewState = MOCK_PAYVIEW_STATE_DOPO_WITHOUT_LASTADDRESSUSED;
          fixture.detectChanges();

          fixture.debugElement.query(By.directive(ButtonComponent)).nativeElement.click();
        });

        it('should show a toast error', () => {
          const MOCK_EMPTY_POST_OFFICE_ADDRESS_ERROR: EmptyPostOfficeAddressError = new EmptyPostOfficeAddressError();
          expect(toastService.show).toHaveBeenCalledTimes(1);
          expect(toastService.show).toHaveBeenCalledWith({
            text: MOCK_EMPTY_POST_OFFICE_ADDRESS_ERROR.message,
            type: TOAST_TYPES.ERROR,
          });
        });

        it('should NOT request buy item', () => {
          expect(payviewBuyService.buy).not.toHaveBeenCalled();
        });
      });

      describe('and the request is correct', () => {
        beforeEach(() => {
          component.payviewState = MOCK_PAYVIEW_STATE;
          fixture.detectChanges();

          fixture.debugElement.query(By.directive(ButtonComponent)).nativeElement.click();
        });

        it('should NOT show a toast error', () => {
          expect(toastService.show).not.toHaveBeenCalled();
        });

        it('should request buy item', () => {
          expect(payviewBuyService.buy).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});
