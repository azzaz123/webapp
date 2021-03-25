import { ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BUMPED_ITEM_FLAG_TYPES, STATUS_ITEM_FLAG_TYPES } from '../item-flag/item-flag-constants';
import { ItemImagesCarouselComponent } from './item-images-carousel.component';

describe('ItemImagesCarouselComponent', () => {
  let component: ItemImagesCarouselComponent;
  let fixture: ComponentFixture<ItemImagesCarouselComponent>;
  const flagRightClass = '.ItemFlag--right';
  const flagLeftClass = '.ItemFlag--left';
  const disabledCarouselClass = '.ItemImagesCarousel--disabled';
  const activeCarouselClass = '.ItemImagesCarousel';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemImagesCarouselComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(ItemImagesCarouselComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemImagesCarouselComponent);
    component = fixture.componentInstance;
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

    describe('when the carousel is active...', () => {
      it('should show the active carousel', () => {
        component.isActive = true;
        fixture.detectChanges();

        const activeCarousel = fixture.debugElement.query(By.css(activeCarouselClass));
        const disabledCarousel = fixture.debugElement.query(By.css(disabledCarouselClass));

        expect(activeCarousel).toBeTruthy();
        expect(disabledCarousel).toBeFalsy();
      });
    });

    describe('when the carousel is not active...', () => {
      it('should show the disabled carousel', () => {
        component.isActive = false;
        fixture.detectChanges();

        const disabledCarousel = fixture.debugElement.query(By.css(disabledCarouselClass));

        expect(disabledCarousel).toBeTruthy();
      });
    });
  });
});
