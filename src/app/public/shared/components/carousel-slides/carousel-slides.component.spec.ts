import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { ImageFallbackModule } from '@public/core/directives/image-fallback/image-fallback.module';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SlidesCarouselComponent } from './carousel-slides.component';
import { DeviceDetectorServiceMock } from '@fixtures/remote-console.fixtures.spec';

import { DeviceDetectorService } from 'ngx-device-detector';
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
  const hideControllerClass = '.hideControllers';
  const noBackgroundIndicatorsClass = '.SlidesCarousel__noBackgroundIndicators';

  let component: SlidesCarouselComponent;
  let fixture: ComponentFixture<TestWrapperComponent>;
  let deviceDetectorService: DeviceDetectorService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgbCarouselModule, ImageFallbackModule],
      declarations: [SlidesCarouselComponent, TestWrapperComponent, CarouselSliderDirective],
      providers: [
        {
          provide: DeviceDetectorService,
          useClass: DeviceDetectorServiceMock,
        },
      ],
    })
      .overrideComponent(SlidesCarouselComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestWrapperComponent);
    component = fixture.debugElement.children[0].componentInstance;
    deviceDetectorService = TestBed.inject(DeviceDetectorService);
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

    describe('when is the carousel is full screen and our device...', () => {
      describe('is a mobile...', () => {
        it('should hide the controllers', () => {
          component.isFullScreen = true;
          spyOn(deviceDetectorService, 'isMobile').and.returnValue(true);

          component.ngAfterContentInit();
          fixture.detectChanges();

          expect(fixture.debugElement.query(By.css(hideControllerClass))).toBeTruthy();
        });
      });

      describe('is a NOT mobile...', () => {
        it('should NOT hide the controllers', () => {
          component.isFullScreen = true;

          component.ngAfterContentInit();
          fixture.detectChanges();

          expect(fixture.debugElement.query(By.css(hideControllerClass))).toBeFalsy();
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

  describe('when showCarouselControllers input is true... ', () => {
    describe('and hide controllers handle is false', () => {
      it('should show the carousel controllers', () => {
        component.showCarouselControllers = true;

        fixture.detectChanges();

        expect(fixture.debugElement.query(By.css(hideControllerClass))).toBeFalsy();
      });
    });

    describe('and hide controllers handle is true', () => {
      it('should not show the carousel controllers', () => {
        spyOn(deviceDetectorService, 'isMobile').and.returnValue(true);
        component.isFullScreen = true;
        component.showCarouselControllers = true;

        component.ngAfterContentInit();
        fixture.detectChanges();

        expect(fixture.debugElement.query(By.css(hideControllerClass))).toBeTruthy();
      });
    });
  });

  describe('when showCarouselControllers input is false... ', () => {
    it('should hide the carousel controllers', () => {
      component.showCarouselControllers = false;

      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css(hideControllerClass))).toBeTruthy();
    });
  });
});
