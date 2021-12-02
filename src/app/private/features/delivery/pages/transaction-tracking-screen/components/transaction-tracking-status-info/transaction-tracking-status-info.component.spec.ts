import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MOCK_TRANSACTION_TRACKING_STATUS_INFO_CARRIER_TRACKING_WEBVIEW_1 } from '@api/fixtures/core/model/transaction/tracking/transaction-tracking.fixtures.spec';
import { ImageFallbackModule } from '@public/core/directives/image-fallback/image-fallback.module';
import { BypassHTMLModule } from '@shared/pipes/bypass-html/bypass-html.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { TransactionTrackingActionSelectorComponent } from '../transaction-tracking-action-details/transaction-tracking-action-selector/transaction-tracking-action-selector.component';
import { TransactionTrackingStatusInfoComponent } from './transaction-tracking-status-info.component';

describe('TransactionTrackingStatusInfoComponent', () => {
  const safeDescriptionSelector = '#safeDescription';
  let component: TransactionTrackingStatusInfoComponent;
  let fixture: ComponentFixture<TransactionTrackingStatusInfoComponent>;
  let de: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionTrackingStatusInfoComponent, TransactionTrackingActionSelectorComponent],
      imports: [SvgIconModule, HttpClientTestingModule, ImageFallbackModule, BypassHTMLModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionTrackingStatusInfoComponent);
    de = fixture.debugElement;
    component = fixture.componentInstance;
    component.transactionTrackingStatusInfo = MOCK_TRANSACTION_TRACKING_STATUS_INFO_CARRIER_TRACKING_WEBVIEW_1;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when we have the properties defined...', () => {
    describe('and the icon src is defined...', () => {
      beforeEach(() => {
        fixture.detectChanges();
      });

      it('should show the provided icon', () => {
        shouldShowImage(true);
      });

      it('should have the provided src', () => {
        expect(de.nativeElement.querySelector(`[src*="${component.transactionTrackingStatusInfo.icon.url}"]`)).toBeTruthy();
      });

      describe('and we specify rounded icon style', () => {
        beforeEach(() => {
          component.transactionTrackingStatusInfo.icon.style.className = 'rounded';
          fixture.detectChanges();
        });

        it('should apply icon round style', () => {
          shouldApplyRoundedImageStyle(true);
        });
      });

      describe('and we NOT specify rounded icon style', () => {
        beforeEach(() => {
          component.transactionTrackingStatusInfo.icon.style.className = 'circle';
          fixture.detectChanges();
        });

        it('should NOT apply icon round style', () => {
          shouldApplyRoundedImageStyle(false);
        });
      });

      describe('and we specify circle icon style', () => {
        beforeEach(() => {
          component.transactionTrackingStatusInfo.icon.style.className = 'circle';
          fixture.detectChanges();
        });

        it('should apply icon circle style', () => {
          shouldApplyCircleImageStyle(true);
        });
      });

      describe('and we NOT specify circle icon style', () => {
        beforeEach(() => {
          component.transactionTrackingStatusInfo.icon.style.className = 'rounded';
          fixture.detectChanges();
        });

        it('should NOT apply icon circle style', () => {
          shouldApplyCircleImageStyle(false);
        });
      });

      describe('and we NOT specify any style', () => {
        beforeEach(() => {
          component.transactionTrackingStatusInfo.icon.style.className = 'none';
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

    describe('and the information comes with action', () => {
      beforeEach(() => {
        fixture.detectChanges();
      });

      it('should show the action selector component', () => {
        shouldShowActionSelector(true);
      });

      it('should NOT show the info description directly', () => {
        checkIfStyleIsInTemplate(safeDescriptionSelector, false);
      });
    });

    describe('and the information does NOT comes with action', () => {
      beforeEach(() => {
        component.transactionTrackingStatusInfo.action = null;
        fixture.detectChanges();
      });

      it('should NOT show the action selector component', () => {
        shouldShowActionSelector(false);
      });

      it('should show the info description directly', () => {
        const descriptionSanitized: HTMLElement = de.query(By.css(safeDescriptionSelector)).nativeElement.innerHTML;

        expect(descriptionSanitized).toEqual(component.transactionTrackingStatusInfo.description);
      });
    });

    describe('and we specify showing caret', () => {
      beforeEach(() => {
        component.transactionTrackingStatusInfo.showCaret = true;
        fixture.detectChanges();
      });

      it('should show caret svg', () => {
        shouldShowCaret(true);
      });
    });

    describe('and we specify not showing caret', () => {
      beforeEach(() => {
        component.transactionTrackingStatusInfo.showCaret = false;
        fixture.detectChanges();
      });

      it('should not show caret svg', () => {
        shouldShowCaret(false);
      });
    });

    describe('and we specify apply border bottom style', () => {
      it('should apply border bottom style', () => {
        component.hasBorderBottom = true;

        fixture.detectChanges();

        shouldApplyBorderBottomStyle(true);
      });
    });

    describe('and we specify NOT apply border bottom style', () => {
      it('should NOT apply border bottom style', () => {
        component.hasBorderBottom = false;

        fixture.detectChanges();

        shouldApplyBorderBottomStyle(false);
      });
    });
  });

  function shouldShowActionSelector(shouldBeInTemplate: boolean): void {
    const actionSelector: DebugElement = de.query(By.directive(TransactionTrackingActionSelectorComponent));
    if (shouldBeInTemplate) {
      expect(actionSelector).toBeTruthy();
    } else {
      expect(actionSelector).toBeFalsy();
    }
  }

  function shouldShowImage(shouldBeInTemplate: boolean): void {
    checkIfStyleIsInTemplate('.TransactionTrackingStatusInfo__icon', shouldBeInTemplate);
  }

  function shouldShowCaret(shouldBeInTemplate: boolean): void {
    checkIfStyleIsInTemplate('.TransactionTrackingStatusInfo__arrowRight', shouldBeInTemplate);
  }

  function shouldApplyRoundedImageStyle(shouldBeInTemplate: boolean): void {
    checkIfStyleIsInTemplate('.TransactionTrackingStatusInfo__icon--rounded', shouldBeInTemplate);
  }

  function shouldApplyCircleImageStyle(shouldBeInTemplate: boolean): void {
    checkIfStyleIsInTemplate('.TransactionTrackingStatusInfo__icon--circle', shouldBeInTemplate);
  }

  function shouldApplyBorderBottomStyle(shouldBeInTemplate: boolean): void {
    checkIfStyleIsInTemplate('.TransactionTrackingStatusInfo--borderBottom', shouldBeInTemplate);
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
