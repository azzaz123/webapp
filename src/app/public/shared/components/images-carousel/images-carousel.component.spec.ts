import { ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ITEM_FLAGS } from '@fixtures/item.fixtures.spec';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { ImageFallbackModule } from '@public/core/directives/image-fallback/image-fallback.module';

import { ImagesCarouselComponent } from './images-carousel.component';

describe('ImagesCarouselComponent', () => {
  const fallbackImageClass = '.ImagesCarousel__image--fallback';
  const defaultIdTemplate = '#defaultCarousel';
  const carouselTag = 'ngb-carousel';
  const carouselImageClass = '.ImagesCarousel__image';
  const flagRightClass = '.ItemFlag--right';
  const flagLeftClass = '.ItemFlag--left';

  let component: ImagesCarouselComponent;
  let fixture: ComponentFixture<ImagesCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgbCarouselModule, ImageFallbackModule],
      declarations: [ImagesCarouselComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(ImagesCarouselComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagesCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    fixture.detectChanges();
  });

  describe('when we have images...', () => {
    beforeEach(() => {
      component.images = [''];
      fixture.detectChanges();
    });

    it('should show the normal image slider', () => {
      const normalSlider = fixture.debugElement.query(
        By.css(defaultIdTemplate)
      );
      const fallbackSlider = fixture.debugElement.query(
        By.css(fallbackImageClass)
      );

      expect(normalSlider).toBeTruthy();
      expect(fallbackSlider).toBeFalsy();
    });

    describe('when we swipe in the carousel...', () => {
      it('should show the previous image if we swipe right', () => {
        spyOn(component.carousel, 'prev');

        fixture.debugElement
          .query(By.css(carouselTag))
          .triggerEventHandler('swiperight', {});

        expect(component.carousel.prev).toHaveBeenCalled();
      });

      it('should show the next image if we swipe left', () => {
        spyOn(component.carousel, 'next');

        fixture.debugElement
          .query(By.css(carouselTag))
          .triggerEventHandler('swipeleft', {});

        expect(component.carousel.next).toHaveBeenCalled();
      });
    });

    describe('when we click on the carousel...', () => {
      it('should open the image slider...', () => {
        spyOn(component.imageClick, 'emit');

        fixture.debugElement
          .query(By.css(carouselImageClass))
          .triggerEventHandler('click', {});

        expect(component.imageClick.emit).toHaveBeenCalled();
      });
    });
  });

  describe(`when we don't have images...`, () => {
    beforeEach(() => {
      component.images = null;
      fixture.detectChanges();
    });

    it('should show the fallback image slider', () => {
      const normalSlider = fixture.debugElement.query(
        By.css(defaultIdTemplate)
      );
      const fallbackSlider = fixture.debugElement.query(
        By.css(fallbackImageClass)
      );

      expect(normalSlider).toBeFalsy();
      expect(fallbackSlider).toBeTruthy();
    });
  });

  describe('when is an item...', () => {
    beforeEach(() => {
      component.itemFlags = ITEM_FLAGS;
      fixture.detectChanges();
    });

    describe('and is bumped...', () => {
      it('should show one flag on the right', () => {
        component.itemFlags.bumped = true;
        fixture.detectChanges();

        const bumpedFlag = fixture.debugElement.query(By.css(flagRightClass));

        expect(bumpedFlag).toBeTruthy();
      });
    });

    describe('and the item is sold, reserved, expired or inactive...', () => {
      it('should show one flag on the left when is sold', () => {
        component.itemFlags.sold = true;
        fixture.detectChanges();

        const soldFlag = fixture.debugElement.queryAll(By.css(flagLeftClass));

        expect(soldFlag).toBeTruthy();
      });

      it('should show one flag on the left when is reserved', () => {
        component.itemFlags.reserved = true;
        fixture.detectChanges();

        const reservedFlag = fixture.debugElement.queryAll(
          By.css(flagLeftClass)
        );

        expect(reservedFlag).toBeTruthy();
      });

      it('should show one flag on the left when is expired', () => {
        component.itemFlags.expired = true;
        fixture.detectChanges();

        const expiredFlag = fixture.debugElement.queryAll(
          By.css(flagLeftClass)
        );

        expect(expiredFlag).toBeTruthy();
      });

      it('should show one flag on the left when is inactive', () => {
        component.itemFlags.onhold = true;
        fixture.detectChanges();

        const inactiveFlag = fixture.debugElement.queryAll(
          By.css(flagLeftClass)
        );

        expect(inactiveFlag).toBeTruthy();
      });
    });
  });
});
