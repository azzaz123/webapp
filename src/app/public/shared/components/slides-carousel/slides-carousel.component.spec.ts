import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { ImageFallbackModule } from '@public/core/directives/image-fallback/image-fallback.module';

import { SlidesCarouselComponent } from './slides-carousel.component';

describe('SlidesCarouselComponent', () => {
  const defaultIdTemplate = '#defaultCarousel';
  const carouselTag = 'ngb-carousel';
  const carouselSlideClass = '.SlidesCarousel__slide';

  let component: SlidesCarouselComponent;
  let fixture: ComponentFixture<SlidesCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgbCarouselModule, ImageFallbackModule],
      declarations: [SlidesCarouselComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlidesCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    fixture.detectChanges();
  });

  describe('when we have slides...', () => {
    beforeEach(() => {
      // component.slides = [''];
      fixture.detectChanges();
    });

    it('should show the normal slide', () => {
      const normalSlider = fixture.debugElement.query(By.css(defaultIdTemplate));

      expect(normalSlider).toBeTruthy();
    });

    describe('when we swipe in the carousel...', () => {
      it('should show the previous slide if we swipe right', () => {
        spyOn(component.carousel, 'prev');

        fixture.debugElement.query(By.css(carouselTag)).triggerEventHandler('swiperight', {});

        expect(component.carousel.prev).toHaveBeenCalled();
      });

      it('should show the next slide if we swipe left', () => {
        spyOn(component.carousel, 'next');

        fixture.debugElement.query(By.css(carouselTag)).triggerEventHandler('swipeleft', {});

        expect(component.carousel.next).toHaveBeenCalled();
      });
    });

    describe('when we click on the carousel...', () => {
      it('should open the slide slider...', () => {
        spyOn(component.slideClick, 'emit');

        fixture.debugElement.query(By.css(carouselSlideClass)).triggerEventHandler('click', {});

        expect(component.slideClick.emit).toHaveBeenCalled();
      });
    });
  });

  describe(`when we don't have images...`, () => {
    beforeEach(() => {
      component.slides = null;
      fixture.detectChanges();
    });

    it('should show the fallback image slider', () => {
      const normalSlider = fixture.debugElement.query(By.css(defaultIdTemplate));
      // const fallbackSlider = fixture.debugElement.query(By.css(fallbackImageClass));

      expect(normalSlider).toBeFalsy();
      // expect(fallbackSlider).toBeTruthy();
    });
  });
});
