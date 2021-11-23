import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ImageFallbackModule } from '@public/core/directives/image-fallback/image-fallback.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';

import { TransactionDetailComponent } from './transaction-detail.component';

describe('TransactionDetailComponent', () => {
  let component: TransactionDetailComponent;
  let fixture: ComponentFixture<TransactionDetailComponent>;
  let de: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionDetailComponent],
      imports: [SvgIconModule, HttpClientTestingModule, ImageFallbackModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionDetailComponent);
    de = fixture.debugElement;
    component = fixture.componentInstance;
    component.transactionDetail = {
      description: '<span style="color: #AFB6B6">Total:</span><br>5.90€',
      iconSrc: 'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/transaction_tracking_details/price_element.png',
      iconClassName: 'rounded',
      showCaret: true,
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when we have the properties defined...', () => {
    it('should show the provided description', () => {
      fixture.detectChanges();
      const descriptionSanitized: HTMLElement = de.query(By.css('.TrackingDetailInfo__descriptionWrapper')).nativeElement.innerHTML;

      expect(descriptionSanitized).toEqual(component.transactionDetail.description);
    });

    describe('and the icon src is defined...', () => {
      beforeEach(() => {
        fixture.detectChanges();
      });

      it('should show the provided icon', () => {
        shouldShowImage(true);
      });

      it('should have the provided src', () => {
        expect(de.nativeElement.querySelector(`[src*="${component.transactionDetail.iconSrc}"]`)).toBeTruthy();
      });

      describe('and we specify rounded icon style', () => {
        beforeEach(() => {
          component.transactionDetail.iconClassName = 'rounded';
          fixture.detectChanges();
        });

        it('should apply icon round style', () => {
          shouldApplyRoundedImageStyle(true);
        });
      });

      describe('and we NOT specify rounded icon style', () => {
        beforeEach(() => {
          component.transactionDetail.iconClassName = 'circle';
          fixture.detectChanges();
        });

        it('should NOT apply icon round style', () => {
          shouldApplyRoundedImageStyle(false);
        });
      });

      describe('and we specify circle icon style', () => {
        beforeEach(() => {
          component.transactionDetail.iconClassName = 'circle';
          fixture.detectChanges();
        });

        it('should apply icon circle style', () => {
          shouldApplyCircleImageStyle(true);
        });
      });

      describe('and we NOT specify circle icon style', () => {
        beforeEach(() => {
          component.transactionDetail.iconClassName = 'rounded';
          fixture.detectChanges();
        });

        it('should NOT apply icon circle style', () => {
          shouldApplyCircleImageStyle(false);
        });
      });

      describe('and we NOT specify any style', () => {
        beforeEach(() => {
          component.transactionDetail.iconClassName = 'none';
          fixture.detectChanges();
        });

        it('should NOT apply icon round style', () => {
          shouldApplyRoundedImageStyle(false);
        });

        it('should NOT apply icon circle style', () => {
          shouldApplyCircleImageStyle(false);
        });
      });
    });

    describe('and we specify showing caret', () => {
      beforeEach(() => {
        fixture.detectChanges();
      });

      it('should show caret svg', () => {
        shouldShowCaret(true);
      });

      describe('and we click in caret...', () => {
        it('should emit the click to the parent', () => {
          spyOn(component.caretClick, 'emit');
          const caretIcon = fixture.debugElement.query(By.css('.TrackingDetailInfo__arrowRight')).nativeElement;

          caretIcon.click();

          expect(component.caretClick.emit).toBeCalledTimes(1);
        });
      });
    });

    describe('and we specify not showing caret', () => {
      beforeEach(() => {
        component.transactionDetail.showCaret = false;
        fixture.detectChanges();
      });

      it('should not show caret svg', () => {
        shouldShowCaret(false);
      });
    });

    describe('and we specify apply border bottom style', () => {
      it('should apply border bottom style', () => {
        component.isBorderBottom = true;

        fixture.detectChanges();

        shouldApplyBorderBottomStyle(true);
      });
    });

    describe('and we specify NOT apply border bottom style', () => {
      it('should NOT apply border bottom style', () => {
        component.isBorderBottom = false;

        fixture.detectChanges();

        shouldApplyBorderBottomStyle(false);
      });
    });

    describe('and the action is clickable', () => {
      beforeEach(() => {
        component.isClickableAction = true;

        fixture.detectChanges();
      });

      it('should apply clickable style', () => {
        shouldApplyClickableActionStyle(true);
      });

      describe('and we click on the action...', () => {
        it('should emit click', () => {
          expectActionClickEmited(true);
        });
      });
    });

    describe('and the action is NOT clickable', () => {
      beforeEach(() => {
        component.isClickableAction = false;

        fixture.detectChanges();
      });

      it('should NOT apply clickable style', () => {
        shouldApplyClickableActionStyle(false);
      });

      describe('and we click on the action...', () => {
        it('should NOT emit click', () => {
          expectActionClickEmited(false);
        });
      });
    });
  });

  function shouldShowImage(shouldBeInTemplate: boolean): void {
    checkIfStyleIsInTemplate('.TrackingDetailInfo__icon', shouldBeInTemplate);
  }

  function shouldShowCaret(shouldBeInTemplate: boolean): void {
    checkIfStyleIsInTemplate('.TrackingDetailInfo__arrowRight', shouldBeInTemplate);
  }

  function shouldApplyRoundedImageStyle(shouldBeInTemplate: boolean): void {
    checkIfStyleIsInTemplate('.TrackingDetailInfo__icon--rounded', shouldBeInTemplate);
  }

  function shouldApplyCircleImageStyle(shouldBeInTemplate: boolean): void {
    checkIfStyleIsInTemplate('.TrackingDetailInfo__icon--circle', shouldBeInTemplate);
  }

  function shouldApplyBorderBottomStyle(shouldBeInTemplate: boolean): void {
    checkIfStyleIsInTemplate('.TrackingDetailInfo--borderBottom', shouldBeInTemplate);
  }

  function shouldApplyClickableActionStyle(shouldBeInTemplate: boolean): void {
    checkIfStyleIsInTemplate('.TrackingDetailInfo__descriptionWrapper--clickable', shouldBeInTemplate);
  }

  function expectActionClickEmited(shouldBeEmitted: boolean): void {
    spyOn(component.actionClick, 'emit');
    const submitButton: HTMLElement = fixture.debugElement.query(By.css('.TrackingDetailInfo__descriptionWrapper')).nativeElement;

    submitButton.click();

    const expectedCalledTimes = shouldBeEmitted ? 1 : 0;
    expect(component.actionClick.emit).toBeCalledTimes(expectedCalledTimes);
  }

  function checkIfStyleIsInTemplate(selector: string, shouldBeInTemplate: boolean): void {
    const styles: DebugElement = de.query(By.css(selector));
    if (shouldBeInTemplate) {
      expect(styles).toBeTruthy();
    } else {
      expect(styles).toBeFalsy();
    }
  }
});
