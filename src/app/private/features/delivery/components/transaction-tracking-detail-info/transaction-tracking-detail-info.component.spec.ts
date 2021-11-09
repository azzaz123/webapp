import { HttpClientModule } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';

import { TransactionTrackingDetailInfoComponent } from './transaction-tracking-detail-info.component';

describe('TransactionTrackingDetailInfoComponent', () => {
  let component: TransactionTrackingDetailInfoComponent;
  let fixture: ComponentFixture<TransactionTrackingDetailInfoComponent>;
  let de: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionTrackingDetailInfoComponent],
      imports: [SvgIconModule, HttpClientModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionTrackingDetailInfoComponent);
    de = fixture.debugElement;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when we have the properties defined...', () => {
    it('should show the provided description', () => {
      component.description = '<span style="color: #AFB6B6">Total:</span><br>5.90€';

      fixture.detectChanges();
      const descriptionSanitized: HTMLElement = de.query(By.css('.TrackingDetailInfo__descriptionWrapper')).nativeElement.innerHTML;

      expect(descriptionSanitized).toEqual(component.description);
    });

    describe('and the icon src is defined...', () => {
      beforeEach(() => {
        component.iconSrc =
          'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/transaction_tracking_details/price_element.png';
        fixture.detectChanges();
      });

      it('should show the provided icon', () => {
        shouldShowImage(true);
      });

      it('should have the provided src', () => {
        expect(de.nativeElement.querySelector(`[src*="${component.iconSrc}"]`)).toBeTruthy();
      });

      describe('and we specify rounded icon style', () => {
        beforeEach(() => {
          component.isRoundedIcon = true;
          fixture.detectChanges();
        });

        it('should apply icon round style', () => {
          shouldApplyRoundedImageStyle(true);
        });
      });

      describe('and we NOT specify rounded icon style', () => {
        beforeEach(() => {
          component.isRoundedIcon = false;
          fixture.detectChanges();
        });

        it('should NOT apply icon round style', () => {
          shouldApplyRoundedImageStyle(false);
        });
      });
    });

    describe('and we specify showing caret', () => {
      beforeEach(() => {
        component.showCaret = true;
        fixture.detectChanges();
      });

      it('should show caret svg', () => {
        shouldShowCaret(true);
      });
    });

    describe('and we specify not showing caret', () => {
      beforeEach(() => {
        component.showCaret = false;
        fixture.detectChanges();
      });

      it('should not show caret svg', () => {
        shouldShowCaret(false);
      });
    });
  });

  function shouldShowImage(shouldBeInTemplate: boolean): void {
    const icon: DebugElement = de.query(By.css('.TrackingDetailInfo__icon'));
    if (shouldBeInTemplate) {
      expect(icon).toBeTruthy();
    } else {
      expect(icon).toBeFalsy();
    }
  }

  function shouldShowCaret(shouldBeInTemplate: boolean): void {
    const caretSvg: DebugElement = de.query(By.css('.TrackingDetailInfo__arrowRight'));
    if (shouldBeInTemplate) {
      expect(caretSvg).toBeTruthy();
    } else {
      expect(caretSvg).toBeFalsy();
    }
  }

  function shouldApplyRoundedImageStyle(shouldBeInTemplate: boolean): void {
    const roundedImageStyles: DebugElement = de.query(By.css('.TrackingDetailInfo__icon--round'));
    if (shouldBeInTemplate) {
      expect(roundedImageStyles).toBeTruthy();
    } else {
      expect(roundedImageStyles).toBeFalsy();
    }
  }
});
