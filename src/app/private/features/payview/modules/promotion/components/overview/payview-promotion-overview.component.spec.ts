import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { ChangeDetectorRef, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ButtonComponent } from '@shared/button/button.component';
import { MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITH_PROMOTION } from '@api/fixtures/delivery/buyer/delivery-buyer-calculator-costs-dto.fixtures.spec';
import { MOCK_PAYVIEW_STATE } from '@fixtures/private/delivery/payview/payview-state.fixtures.spec';
import { PayviewPromotionOverviewComponent } from '@private/features/payview/modules/promotion/components/overview/payview-promotion-overview.component';
import { PayviewPromotionService } from '@private/features/payview/modules/promotion/services/payview-promotion.service';

import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';

describe('PayviewPromotionOverviewComponent', () => {
  const payviewPromotionSelector: string = '.PayviewPromotion';
  const payviewPromotionCodeDescriptionSelector: string = `${payviewPromotionSelector}__codeDescription`;
  const payviewPromotionCodeCheckSelector: string = `${payviewPromotionSelector}__codeCheck`;

  let changeDetectorRef: ChangeDetectorRef;
  let component: PayviewPromotionOverviewComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<PayviewPromotionOverviewComponent>;
  let promotionService: PayviewPromotionService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ButtonComponent, PayviewPromotionOverviewComponent, SvgIconComponent],
      imports: [BrowserAnimationsModule, HttpClientTestingModule],
      providers: [PayviewPromotionService],
    }).compileComponents();
  });

  describe('WHEN initializes', () => {
    beforeEach(() => {
      promotionService = TestBed.inject(PayviewPromotionService);
      fixture = TestBed.createComponent(PayviewPromotionOverviewComponent);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
      changeDetectorRef = fixture.debugElement.injector.get<ChangeDetectorRef>(ChangeDetectorRef);

      component.costs = MOCK_PAYVIEW_STATE.costs;

      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    describe('WHEN costs have been reported', () => {
      it('should show the promotion block', () => {
        const target = debugElement.query(By.css(payviewPromotionSelector));

        expect(target).toBeTruthy();
      });

      describe('WHEN there is no promotion', () => {
        it('should show the corresponding placeholder', () => {
          const target: HTMLDivElement = debugElement.query(By.css(payviewPromotionCodeDescriptionSelector))
            .nativeElement as HTMLDivElement;

          expect(target.innerHTML).toContain($localize`:@@pay_view_buyer_promo_code_title:Promotional code`);
        });

        it('should not show the code check', () => {
          const target = debugElement.query(By.css(payviewPromotionCodeCheckSelector));

          expect(target).toBeFalsy();
        });

        it('should show the "add" button', () => {
          const target: HTMLButtonElement = debugElement.query(By.directive(ButtonComponent)).nativeElement as HTMLButtonElement;

          expect(target.innerHTML).toContain($localize`:@@pay_view_buyer_promo_code_add_button:Add`);
        });

        describe('WHEN user clicks over add button', () => {
          beforeEach(() => {
            spyOn(promotionService, 'openPromocodeEditor');
          });

          it('should send the corresponding event', () => {
            const button = debugElement.query(By.directive(ButtonComponent));

            button.triggerEventHandler('click', null);

            expect(promotionService.openPromocodeEditor).toHaveBeenCalledTimes(1);
          });
        });
      });
      describe('WHEN there is a promotion', () => {
        beforeEach(() => {
          component.costs = MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITH_PROMOTION;

          changeDetectorRef.detectChanges();
        });

        it('should show the promocode', () => {
          const target: HTMLDivElement = debugElement.query(By.css(payviewPromotionCodeDescriptionSelector))
            .nativeElement as HTMLDivElement;

          expect(target.innerHTML).toContain(component.costs.promotion.promocode.toUpperCase());
        });

        it('should show the code check', () => {
          const target = debugElement.query(By.css(payviewPromotionCodeCheckSelector));

          expect(target).toBeTruthy();
        });

        it('should show the "cancel" button', () => {
          const target: HTMLButtonElement = debugElement.query(By.directive(ButtonComponent)).nativeElement as HTMLButtonElement;

          expect(target.innerHTML).toContain($localize`:@@pay_view_buyer_promo_code_cancel_button:Cancel`);
        });

        describe('WHEN user clicks over cancel button', () => {
          beforeEach(() => {
            spyOn(promotionService, 'removePromocode');
          });

          it('should send the corresponding event', () => {
            const button = debugElement.query(By.directive(ButtonComponent));

            button.triggerEventHandler('click', null);

            expect(promotionService.removePromocode).toHaveBeenCalledTimes(1);
          });
        });
      });
    });

    describe('WHEN costs have not been reported', () => {
      beforeEach(() => {
        fixture = TestBed.createComponent(PayviewPromotionOverviewComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;

        component.costs = null;

        fixture.detectChanges();
      });

      it('should not show the promotion block', () => {
        const target = debugElement.query(By.css(payviewPromotionSelector));

        expect(target).toBeFalsy();
      });
    });
  });
});
