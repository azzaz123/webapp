import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { ImageFallbackModule } from '@public/core/directives/image-fallback/image-fallback.module';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CAROUSEL_CONTROL_SIZE,
  NEXT_CONTROL_CLASS_NAME,
  PREV_CONTROL_CLASS_NAME,
  SlidesCarouselComponent,
} from './carousel-slides.component';
import { CarouselSliderDirective } from './directives/carousel-slider.directive';
import { DeviceService } from '@core/device/device.service';
import { MockDeviceService } from '@fixtures/device.fixtures.spec';

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
  const hideIndicatorsClass = '.SlidesCarousel--hideIndicators';
  const noBackgroundIndicatorsClass = '.SlidesCarousel--noBackgroundIndicators';
  const manyImagesClass = '.SlidesCarousel--manyImages';

  let component: SlidesCarouselComponent;
  let fixture: ComponentFixture<TestWrapperComponent>;
  let deviceService: DeviceService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgbCarouselModule, ImageFallbackModule],
      providers: [{ provide: DeviceService, useValue: MockDeviceService }],
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
    deviceService = TestBed.inject(DeviceService);
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
      describe('and we are NOT on a touch screen device', () => {
        beforeEach(() => {
          resetTouchProperties();
        });
        it('should NOT do anything if we swipe right', () => {
          spyOn(component.carousel, 'prev');

          fixture.debugElement.query(By.css(carouselTag)).triggerEventHandler('swiperight', {});

          expect(component.carousel.prev).not.toHaveBeenCalled();
        });

        it('should NOT do anything if we swipe left', () => {
          spyOn(component.carousel, 'next');

          fixture.debugElement.query(By.css(carouselTag)).triggerEventHandler('swipeleft', {});

          expect(component.carousel.next).not.toHaveBeenCalled();
        });
      });

      describe('and we are on a touch screen device', () => {
        beforeEach(() => {
          setTouchProperties();
        });
        it('should call to the previous slide if we swipe right', () => {
          spyOn(component.carousel, 'prev');

          fixture.debugElement.query(By.css(carouselTag)).triggerEventHandler('swiperight', {});

          expect(component.carousel.prev).toHaveBeenCalled();
        });

        it('should call to the next slide if we swipe left', () => {
          spyOn(component.carousel, 'next');

          fixture.debugElement.query(By.css(carouselTag)).triggerEventHandler('swipeleft', {});

          expect(component.carousel.next).toHaveBeenCalled();
        });
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

    describe('when the hideIndicators input is true...', () => {
      it('should hide the indicators', () => {
        component.hideIndicators = true;

        fixture.detectChanges();

        expect(fixture.debugElement.query(By.css(hideIndicatorsClass))).toBeTruthy();
      });
    });

    describe('when the hideIndicators input is false...', () => {
      it('should NOT hide the indicators', () => {
        component.hideIndicators = false;

        fixture.detectChanges();

        expect(fixture.debugElement.query(By.css(hideIndicatorsClass))).toBeFalsy();
      });
    });

    describe('when the component has a small controls configuration', () => {
      it('should show the controls with a small size', () => {
        component.controlsSize = CAROUSEL_CONTROL_SIZE.SMALL;

        fixture.detectChanges();
        const carouselSlidesElement = fixture.debugElement.query(By.css('.SlidesCarousel')).nativeElement;

        expect(carouselSlidesElement.classList).toContain('SlidesCarousel--smallControls');
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

  describe('when clicking in the carousel controls', () => {
    it('should not propagate the click event', () => {
      const carouselElement = fixture.debugElement.nativeElement;
      const controlElements = carouselElement.querySelectorAll(`${PREV_CONTROL_CLASS_NAME}, ${NEXT_CONTROL_CLASS_NAME}`);

      controlElements.forEach((e: HTMLInputElement) => {
        const event = new Event('click');
        spyOn(event, 'stopPropagation');

        e.dispatchEvent(event);

        expect(event.stopPropagation).toHaveBeenCalledTimes(1);
      });
    });
  });

  function setTouchProperties(): void {
    Object.defineProperty(window, 'ontouchstart', {
      value: true,
    });
  }

  function resetTouchProperties(): void {
    Object.defineProperty(navigator, 'maxTouchPoints', {
      value: 0,
    });
    Object.defineProperty(navigator, 'msMaxTouchPoints', {
      value: 0,
    });
  }
});
