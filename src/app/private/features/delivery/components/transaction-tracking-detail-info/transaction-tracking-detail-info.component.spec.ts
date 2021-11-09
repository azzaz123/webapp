import { HttpClientModule } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';
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
    it('should show the provided title', () => {
      component.title = 'Helloooooooooo';

      fixture.detectChanges();
      const title: HTMLElement = de.query(By.css('.TrackingDetailInfo__title')).nativeElement;

      expect(title.textContent).toStrictEqual(component.title);
    });

    it('should show the provided subtitle', () => {
      component.subtitle = 'Subtitleeee';

      fixture.detectChanges();
      const title: HTMLElement = de.query(By.css('.TrackingDetailInfo__subtitle')).nativeElement;

      expect(title.textContent).toStrictEqual(component.subtitle);
    });

    describe('and the image src is defined...', () => {
      beforeEach(() => {
        component.imageSrc = '/assets/images/image.svg';
        fixture.detectChanges();
      });

      it('should show the image', () => {
        shouldShowImage(true);
      });

      it('should have the provided src', () => {
        expect(de.nativeElement.querySelector(`[src*="${component.imageSrc}"]`)).toBeTruthy();
      });

      it('should NOT show the fallback svg', () => {
        shouldShowFallbackSvg(false);
      });

      describe('and we specify rounded image style', () => {
        beforeEach(() => {
          component.isRoundedImage = true;
          fixture.detectChanges();
        });

        it('should apply image round style', () => {
          shouldApplyRoundedImageStyle(true);
        });
      });

      describe('and we NOT specify rounded image style', () => {
        beforeEach(() => {
          component.isRoundedImage = false;
          fixture.detectChanges();
        });

        it('should NOT apply image round style', () => {
          shouldApplyRoundedImageStyle(false);
        });
      });
    });

    describe('and the image src is not defined', () => {
      beforeEach(() => {
        component.imageSrc = null;
        fixture.detectChanges();
      });

      describe('and the fallback svg is defined', () => {
        beforeEach(() => {
          component.fallbackSvgSrc = '/assets/images/fb.svg';
          fixture.detectChanges();
        });

        it('should not show any image', () => {
          shouldShowImage(false);
        });

        it('should show the fallback svg', () => {
          shouldShowFallbackSvg(true);
        });

        it('should have the provided src', () => {
          const fallbackSvg: SvgIconComponent = fixture.debugElement.query(By.css('#fallbackSvg')).componentInstance;

          expect(fallbackSvg.src).toEqual(component.fallbackSvgSrc);
        });
      });

      describe('and the fallback svg is not defined', () => {
        beforeEach(() => {
          component.fallbackSvgSrc = null;
          fixture.detectChanges();
        });

        it('should not show any image', () => {
          shouldShowImage(false);
        });

        it('should not show the fallback svg', () => {
          shouldShowFallbackSvg(false);
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
    const image: DebugElement = de.query(By.css('.TrackingDetailInfo__image'));
    if (shouldBeInTemplate) {
      expect(image).toBeTruthy();
    } else {
      expect(image).toBeFalsy();
    }
  }

  function shouldShowFallbackSvg(shouldBeInTemplate: boolean): void {
    const fallbackSvg: DebugElement = de.query(By.css('#fallbackSvg'));
    if (shouldBeInTemplate) {
      expect(fallbackSvg).toBeTruthy();
    } else {
      expect(fallbackSvg).toBeFalsy();
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
    const roundedImageStyles: DebugElement = de.query(By.css('.TrackingDetailInfo__image--round'));
    if (shouldBeInTemplate) {
      expect(roundedImageStyles).toBeTruthy();
    } else {
      expect(roundedImageStyles).toBeFalsy();
    }
  }
});
