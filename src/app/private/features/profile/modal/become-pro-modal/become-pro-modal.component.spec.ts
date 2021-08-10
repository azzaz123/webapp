import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TIER_WITH_DISCOUNT } from '@fixtures/subscriptions.fixtures.spec';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BecomeProModalComponent } from './become-pro-modal.component';

describe('BecomeProModalComponent', () => {
  let component: BecomeProModalComponent;
  let fixture: ComponentFixture<BecomeProModalComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [BecomeProModalComponent],
        providers: [NgbActiveModal],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(BecomeProModalComponent);
    component = fixture.componentInstance;
  });

  describe('CTA text', () => {
    beforeEach(() => {
      spyOn(window as any, '$localize');
    });

    it('should show trial text', () => {
      component.hasTrialAvailable = true;
      fixture.detectChanges();

      expect(window['$localize']).toHaveBeenCalledWith([expect.stringMatching(':@@web_free_trial:')]);
    });

    it('should show discount text', () => {
      component.hasTrialAvailable = false;
      component.tierWithDiscount = TIER_WITH_DISCOUNT;
      fixture.detectChanges();

      expect(window['$localize']).toHaveBeenCalledWith(
        [expect.stringMatching(':@@listing_limit_non_pro_users_discount_modal_start_button:'), expect.stringMatching(':INTERPOLATION:')],
        component.tierWithDiscount.discount.percentage
      );
    });

    it('should show default text', () => {
      fixture.detectChanges();

      expect(window['$localize']).toHaveBeenCalledWith([expect.stringMatching(':@@web_know_more:')]);
    });
  });
});
