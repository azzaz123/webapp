import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TIER_WITH_DISCOUNT } from '@fixtures/subscriptions.fixtures.spec';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ButtonComponent } from '@shared/button/button.component';
import { SuggestProModalComponent } from './suggest-pro-modal.component';

describe('SuggestProModalComponent', () => {
  let component: SuggestProModalComponent;
  let fixture: ComponentFixture<SuggestProModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SuggestProModalComponent, ButtonComponent],
      providers: [NgbActiveModal],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestProModalComponent);
    component = fixture.componentInstance;
    spyOn(window as any, '$localize');
  });

  describe('Title', () => {
    it('should show title', () => {
      component.title = 'Test title';

      fixture.detectChanges();

      const titleHtml: HTMLElement = fixture.debugElement.query(By.css('.SuggestProModal__title')).nativeElement;
      expect(titleHtml.textContent).toBe('Test title');
    });
  });

  describe('Description', () => {
    describe('when has trial available', () => {
      it('should show trial text', () => {
        component.isFreeTrial = true;

        fixture.detectChanges();

        expect(window['$localize']).toHaveBeenCalledWith([expect.stringMatching(':@@web_suggest_pro_modal_description_trial:')]);
      });
    });
    describe('when has not trial available', () => {
      beforeEach(() => {
        component.isFreeTrial = false;
      });
      it('should show discount text', () => {
        component.tierWithDiscount = TIER_WITH_DISCOUNT;
        fixture.detectChanges();

        expect(window['$localize']).toHaveBeenCalledWith(
          [
            expect.stringMatching(':@@pro_after_reactivation_non_subscribed_user_start_with_discount_button:'),
            expect.stringMatching(':INTERPOLATION:'),
          ],
          component.tierWithDiscount.discount.percentage
        );
      });
      it('should show default text', () => {
        component.isFreeTrial = false;

        fixture.detectChanges();

        expect(window['$localize']).toHaveBeenCalledWith([expect.stringMatching(':@@web_suggest_pro_modal_description_plans:')]);
      });
    });
  });

  describe('CTA button', () => {
    describe('when has trial available', () => {
      it('should show trial text', () => {
        component.isFreeTrial = true;

        fixture.detectChanges();

        expect(window['$localize']).toHaveBeenCalledWith([expect.stringMatching(':@@web_start_free_trial:')]);
      });
    });
    describe('when has not trial available', () => {
      it('should show default text', () => {
        component.isFreeTrial = false;

        fixture.detectChanges();

        expect(window['$localize']).toHaveBeenCalledWith([expect.stringMatching(':@@web_see_plans:')]);
      });
    });
    describe('when click', () => {
      it('should close modal', () => {
        spyOn(component.activeModal, 'close');
        const ctaButton: HTMLElement = fixture.debugElement.query(By.directive(ButtonComponent)).nativeElement;

        ctaButton.click();

        expect(component.activeModal.close).toBeCalledTimes(1);
        expect(component.activeModal.close).toHaveBeenCalledWith();
      });
    });
  });

  describe('Secondary button', () => {
    describe('when click', () => {
      it('should dismiss modal reloading item', () => {
        spyOn(component.activeModal, 'dismiss');
        const secondaryButton: HTMLElement = fixture.debugElement.query(By.css('.Dismiss')).nativeElement;

        secondaryButton.click();

        expect(component.activeModal.dismiss).toBeCalledTimes(1);
        expect(component.activeModal.dismiss).toHaveBeenCalledWith();
      });
    });
  });

  describe('Close icon', () => {
    describe('when click', () => {
      it('should dismiss modal', () => {
        spyOn(component.activeModal, 'dismiss');
        const secondaryButton: HTMLElement = fixture.debugElement.query(By.css('.SuggestProModal__close')).nativeElement;

        secondaryButton.click();

        expect(component.activeModal.dismiss).toBeCalledTimes(1);
        expect(component.activeModal.dismiss).toHaveBeenCalledWith();
      });
    });
  });
});
