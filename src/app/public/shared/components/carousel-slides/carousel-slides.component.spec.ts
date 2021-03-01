import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { ImageFallbackModule } from '@public/core/directives/image-fallback/image-fallback.module';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SlidesCarouselComponent } from './carousel-slides.component';

import { CarouselSliderDirective } from './directives/carousel-slider.directive';

@Component({
  selector: 'tsl-carousel-slides-test',
  template: `<tsl-carousel-slides>
    <ng-template *ngFor="let img of images" carousel-slider>
      <img />
    </ng-template>
  </tsl-carousel-slides>`,
})
class TestWrapperComponent {
  public images = new Array(7);
}

describe('SlidesCarouselComponent', () => {
  const defaultIdTemplate = '#defaultCarousel';
  const slideIdContainer = '#slideContainer';
  const carouselTag = 'ngb-carousel';
  const fallbackImageClass = '.SlidesCarousel__fallbackImage';
  const hideControllerClass = '.SlidesCarousel--hideControllers';
  const noBackgroundIndicatorsClass = '.SlidesCarousel--noBackgroundIndicators';

  let component: SlidesCarouselComponent;
  let fixture: ComponentFixture<TestWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgbCarouselModule, ImageFallbackModule],
      declarations: [SlidesCarouselComponent, TestWrapperComponent, CarouselSliderDirective],
    })
      .overrideComponent(SlidesCarouselComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestWrapperComponent);
    component = fixture.debugElement.children[0].componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    fixture.detectChanges();
  });

  describe('when we have slides...', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should detect the inner child elements', () => {
      expect(component.slides.length).toBe(7);
    });

    it('should show the normal slide style', () => {
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

        fixture.debugElement.query(By.css(slideIdContainer)).triggerEventHandler('click', {});

        expect(component.slideClick.emit).toHaveBeenCalled();
      });
    });

    describe('when the hidecontrollers input is true...', () => {
      it('should hide the controllers', () => {
        component.hideControllers = true;

        fixture.detectChanges();

        expect(fixture.debugElement.query(By.css(hideControllerClass))).toBeTruthy();
      });
    });

    describe('when the hidecontrollers input is false...', () => {
      beforeEach(() => {
        component.hideControllers = false;
      });
      describe('and we have more than one slide...', () => {
        it('should NOT hide the controllers', () => {
          fixture.componentInstance.images = new Array(2);

          fixture.detectChanges();
          component.ngAfterContentInit();

          expect(fixture.debugElement.query(By.css(hideControllerClass))).toBeFalsy();
        });
      });
      describe('and we have ONLY one slide...', () => {
        it('should hide the controllers', () => {
          fixture.componentInstance.images = new Array(1);

          fixture.detectChanges();
          component.ngAfterContentInit();

          expect(fixture.debugElement.query(By.css(hideControllerClass))).toBeTruthy();
        });
      });
    });
  });

  describe(`when we don't have slides...`, () => {
    it('should show the fallback image slider', () => {
      fixture.componentInstance.images = [];

      fixture.detectChanges();
      component.ngAfterContentInit();

      expect(fixture.debugElement.query(By.css(defaultIdTemplate))).toBeFalsy();
      expect(fixture.debugElement.query(By.css(fallbackImageClass))).toBeTruthy();
    });
  });

  describe('when noBackgroundIndicators input is true...', () => {
    it('should hide the bottom background indicator', () => {
      component.noBackgroundIndicators = true;

      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css(noBackgroundIndicatorsClass))).toBeTruthy();
    });
  });
});
