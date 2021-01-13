import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { ImageFallbackModule } from '@public/core/directives/image-fallback/image-fallback.module';

import { ImagesCarouselComponent } from './images-carousel.component';

describe('ImagesCarouselComponent', () => {
  const fallbackIdTemplate = '#fallbackCarousel';
  const defaultIdTemplate = '#defaultCarousel';
  const carouselTag = 'ngb-carousel';
  const carouselImageClass = '.ImagesCarousel__image';

  let component: ImagesCarouselComponent;
  let fixture: ComponentFixture<ImagesCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgbCarouselModule, ImageFallbackModule],
      declarations: [ImagesCarouselComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagesCarouselComponent);
    component = fixture.componentInstance;
    component.images = ['', ''];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    component.ngOnInit();
    fixture.detectChanges();
  });

  describe('when we have images...', () => {
    it('should show the normal image slider', () => {
      const normalSlider = fixture.debugElement.query(
        By.css(defaultIdTemplate)
      );
      const fallbackSlider = fixture.debugElement.query(
        By.css(fallbackIdTemplate)
      );

      expect(normalSlider).toBeTruthy();
      expect(fallbackSlider).toBeFalsy();
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
        By.css(fallbackIdTemplate)
      );

      expect(normalSlider).toBeFalsy();
      expect(fallbackSlider).toBeTruthy();
    });
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
      spyOn(component.currentImageIndex, 'emit');

      fixture.debugElement
        .query(By.css(carouselImageClass))
        .triggerEventHandler('click', {});

      expect(component.currentImageIndex.emit).toHaveBeenCalled();
    });
  });
});
