import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DeviceService } from '@core/device/device.service';
import { MockDeviceService } from '@fixtures/device.fixtures.spec';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { SlidesCarouselComponent } from '../carousel-slides/carousel-slides.component';
import { BUMPED_ITEM_FLAG_TYPES, STATUS_ITEM_FLAG_TYPES } from '../item-flag/item-flag-constants';
import { ItemFlagComponent } from '../item-flag/item-flag.component';
import { ItemImagesCarouselComponent } from './item-images-carousel.component';

describe('ItemImagesCarouselComponent', () => {
  let component: ItemImagesCarouselComponent;
  let fixture: ComponentFixture<ItemImagesCarouselComponent>;
  let deviceService: DeviceService;
  const flagRightClass = '.ItemFlag--right';
  const flagLeftClass = '.ItemFlag--left';
  const disabledCarouselClass = '.ItemImagesCarousel--disabled';
  const activeCarouselClass = '.ItemImagesCarousel';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{ provide: DeviceService, useValue: MockDeviceService }],
      imports: [SvgIconModule, HttpClientTestingModule],
      declarations: [ItemImagesCarouselComponent, SlidesCarouselComponent, ItemFlagComponent],
    })
      .overrideComponent(ItemImagesCarouselComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemImagesCarouselComponent);
    deviceService = TestBed.inject(DeviceService);
    component = fixture.componentInstance;
    component.images = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when is an item...', () => {
    describe('and is bumped or country bumped...', () => {
      it('should show one flag on the right when is bumped', () => {
        component.bumpedFlag = BUMPED_ITEM_FLAG_TYPES.BUMPED;
        fixture.detectChanges();

        const bumpedFlag = fixture.debugElement.query(By.css(flagRightClass));

        expect(bumpedFlag).toBeTruthy();
      });

      it('should show one flag on the right when is country bumped', () => {
        component.bumpedFlag = BUMPED_ITEM_FLAG_TYPES.COUNTRY_BUMP;
        fixture.detectChanges();

        const bumpedFlag = fixture.debugElement.query(By.css(flagRightClass));

        expect(bumpedFlag).toBeTruthy();
      });
    });

    describe('and the item is sold, reserved, expired or inactive...', () => {
      it('should show one flag on the left when is sold', () => {
        component.statusFlag = STATUS_ITEM_FLAG_TYPES.SOLD;
        fixture.detectChanges();

        const soldFlag = fixture.debugElement.queryAll(By.css(flagLeftClass));

        expect(soldFlag.length).toBe(1);
      });

      it('should show one flag on the left when is reserved', () => {
        component.statusFlag = STATUS_ITEM_FLAG_TYPES.RESERVED;
        fixture.detectChanges();

        const reservedFlag = fixture.debugElement.queryAll(By.css(flagLeftClass));

        expect(reservedFlag.length).toBe(1);
      });

      it('should show one flag on the left when is expired', () => {
        component.statusFlag = STATUS_ITEM_FLAG_TYPES.EXPIRED;
        fixture.detectChanges();

        const expiredFlag = fixture.debugElement.queryAll(By.css(flagLeftClass));

        expect(expiredFlag.length).toBe(1);
      });

      it('should show one flag on the left when is inactive', () => {
        component.statusFlag = STATUS_ITEM_FLAG_TYPES.INACTIVE;
        fixture.detectChanges();

        const inactiveFlag = fixture.debugElement.queryAll(By.css(flagLeftClass));

        expect(inactiveFlag.length).toBe(1);
      });
    });

    describe('when we received an image click output event...', () => {
      it('should emit the image click event', () => {
        spyOn(component.imageClick, 'emit');
        const slidesCarousel = fixture.nativeElement.querySelector('tsl-carousel-slides');

        slidesCarousel.dispatchEvent(new Event('slideClick'));
        fixture.detectChanges();

        expect(component.imageClick.emit).toHaveBeenCalled();
      });
    });

    describe('when item has more than 10 images', () => {
      beforeEach(() => {
        component.images = [...Array(20)].map(() => (Math.random() * 12345).toString());
      });

      describe('and when user device is a mobile', () => {
        beforeEach(() => {
          spyOn(deviceService, 'isMobile').and.returnValue(true);
          component.ngOnInit();
          fixture.detectChanges();
        });

        it('should show smaller carousel indicators', () => {
          const carouselComponent: SlidesCarouselComponent = fixture.debugElement.query(By.directive(SlidesCarouselComponent))
            .componentInstance;

          expect(carouselComponent.smallerIndicators).toBe(true);
        });
      });

      describe("and when the user's device is not a mobile", () => {
        beforeEach(() => {
          spyOn(deviceService, 'isMobile').and.returnValue(false);
          component.ngOnInit();
          fixture.detectChanges();
        });

        it('should NOT show smaller carousel indicators', () => {
          const carouselComponent: SlidesCarouselComponent = fixture.debugElement.query(By.directive(SlidesCarouselComponent))
            .componentInstance;

          expect(carouselComponent.smallerIndicators).toBe(false);
        });
      });
    });

    describe('when item has less than 10 images', () => {
      beforeEach(() => {
        component.images = [...Array(8)].map(() => (Math.random() * 12345).toString());
      });

      describe('and when user device is a mobile', () => {
        beforeEach(() => {
          spyOn(deviceService, 'isMobile').and.returnValue(true);
          component.ngOnInit();
          fixture.detectChanges();
        });

        it('should NOT show smaller carousel indicators', () => {
          const carouselComponent: SlidesCarouselComponent = fixture.debugElement.query(By.directive(SlidesCarouselComponent))
            .componentInstance;

          expect(carouselComponent.smallerIndicators).toBe(false);
        });
      });

      describe("and when the user's device is not a mobile", () => {
        beforeEach(() => {
          spyOn(deviceService, 'isMobile').and.returnValue(false);
          component.ngOnInit();
          fixture.detectChanges();
        });

        it('should NOT show smaller carousel indicators', () => {
          const carouselComponent: SlidesCarouselComponent = fixture.debugElement.query(By.directive(SlidesCarouselComponent))
            .componentInstance;

          expect(carouselComponent.smallerIndicators).toBe(false);
        });
      });
    });

    describe('when the carousel is active...', () => {
      it('should show the active carousel', () => {
        component.isExpired = false;
        fixture.detectChanges();

        const activeCarousel = fixture.debugElement.query(By.css(activeCarouselClass));
        const disabledCarousel = fixture.debugElement.query(By.css(disabledCarouselClass));

        expect(activeCarousel).toBeTruthy();
        expect(disabledCarousel).toBeFalsy();
      });
    });

    describe('when the carousel is not active...', () => {
      it('should show the disabled carousel', () => {
        component.isExpired = true;
        fixture.detectChanges();

        const disabledCarousel = fixture.debugElement.query(By.css(disabledCarouselClass));

        expect(disabledCarousel).toBeTruthy();
      });
    });
  });
});
