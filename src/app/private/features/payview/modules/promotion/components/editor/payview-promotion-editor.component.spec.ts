import { By } from '@angular/platform-browser';
import { ChangeDetectorRef, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { ButtonComponent } from '@shared/button/button.component';
import { ButtonModule } from '@shared/button/button.module';
import {
  PAYVIEW_PROMOTION_DEFAULT_ERROR,
  PAYVIEW_PROMOTION_ERRORS,
} from '@private/features/payview/modules/promotion/constants/payview-promotion-copies';
import { PayviewError } from '@private/features/payview/interfaces/payview-error.interface';
import { PayviewPromotionEditorComponent } from '@private/features/payview/modules/promotion/components/editor/payview-promotion-editor.component';
import { PayviewPromotionService } from '@private/features/payview/modules/promotion/services/payview-promotion.service';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PayviewPromotionEditorComponent', () => {
  const payviewPromotionEditorSelector: string = '.PayviewPromotionEditor';
  const payviewPromotionEditorMessageSelector: string = `${payviewPromotionEditorSelector}__message`;
  const payviewPromotionEditorErrorSelector: string = `${payviewPromotionEditorSelector}__error`;

  let changeDetectorRef: ChangeDetectorRef;
  let component: PayviewPromotionEditorComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<PayviewPromotionEditorComponent>;
  let promotionService: PayviewPromotionService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PayviewPromotionEditorComponent, SvgIconComponent],
      imports: [ButtonModule, FormsModule, HttpClientTestingModule],
      providers: [PayviewPromotionService],
    }).compileComponents();
  });

  beforeEach(() => {
    promotionService = TestBed.inject(PayviewPromotionService);
    fixture = TestBed.createComponent(PayviewPromotionEditorComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    changeDetectorRef = fixture.debugElement.injector.get<ChangeDetectorRef>(ChangeDetectorRef);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('WHEN the title is spplited in two parts', () => {
    it('should show both parts', () => {
      const parts: number = debugElement.queryAll(By.css(payviewPromotionEditorMessageSelector)).length;
      expect(parts).toBe(2);
    });
  });

  describe('WHEN the title is not spplited', () => {
    beforeEach(() => {
      component.firstSentence = 'This_is_the_first_sentence';
      component.secondSentence = null;

      changeDetectorRef.detectChanges();
    });

    it('should show only the first part', () => {
      const parts: number = debugElement.queryAll(By.css(payviewPromotionEditorMessageSelector)).length;
      expect(parts).toBe(1);
    });
  });

  describe('WHEN there is no error', () => {
    it('should not show any error', () => {
      const target = debugElement.query(By.css(payviewPromotionEditorErrorSelector));
      expect(target).toBeFalsy();
    });
  });

  describe('WHEN there is an error', () => {
    beforeEach(() => {
      component.errorMessage = 'There_is_an_error';

      changeDetectorRef.detectChanges();
    });

    it('should show the error message', () => {
      const target = debugElement.query(By.css(payviewPromotionEditorErrorSelector));
      expect(target).toBeTruthy();
    });
  });

  describe('WHEN user clicks over apply button', () => {
    let button: DebugElement;
    beforeEach(() => {
      spyOn(promotionService, 'applyPromocode');
      button = debugElement.query(By.directive(ButtonComponent));
    });

    describe('and the promocode is NOT empty', () => {
      beforeEach(() => {
        component.promocode = 'TRXWEBRULES';

        button.triggerEventHandler('click', null);
      });

      it('should apply the promocode', () => {
        expect(promotionService.applyPromocode).toHaveBeenCalledTimes(1);
      });
    });

    describe('and the promocode is empty', () => {
      beforeEach(() => {
        component.promocode = null;

        button.triggerEventHandler('click', null);
      });

      it('should NOT apply the promocode', () => {
        expect(promotionService.applyPromocode).not.toHaveBeenCalledTimes(1);
      });

      it('should show an error message', () => {
        expect(component.errorMessage).toStrictEqual(PAYVIEW_PROMOTION_ERRORS['promocode does not exist']);
      });
    });
  });

  describe('WHEN there is an error', () => {
    describe('WHEN the error is unknown', () => {
      it('should show the default error message', fakeAsync(() => {
        const fakeError: PayviewError = { code: 'This_is_a_fake_code', message: 'This_is_a_fake_message' };

        promotionService.error(fakeError);
        tick();
        changeDetectorRef.checkNoChanges();

        expect(component.errorMessage).toBe(PAYVIEW_PROMOTION_DEFAULT_ERROR);
      }));
    });

    describe('WHEN the error is known', () => {
      it('should show the specific error message', fakeAsync(() => {
        const code: string = 'promocode already used';
        const fakeError: PayviewError = { code: code, message: 'This_is_a_fake_message' };

        promotionService.error(fakeError);
        tick();
        changeDetectorRef.checkNoChanges();

        expect(component.errorMessage).toBe(PAYVIEW_PROMOTION_ERRORS[code]);
      }));
    });
  });

  describe('WHEN the component has been destroyed', () => {
    beforeEach(() => {
      component.ngOnDestroy();
    });

    it('should not catch any event', fakeAsync(() => {
      const fakeError: PayviewError = { code: 'This_is_a_fake_code', message: 'This_is_a_fake_message' };

      promotionService.error(fakeError);
      tick();
      changeDetectorRef.checkNoChanges();

      expect(component.errorMessage).toBeFalsy();
    }));
  });
});
