import { ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ITEM_EXTENDED_FLAGS, ITEM_FLAGS } from '@fixtures/item.fixtures.spec';
import { ItemImagesCarouselComponent } from './item-images-carousel.component';

describe('ItemImagesCarouselComponent', () => {
  let component: ItemImagesCarouselComponent;
  let fixture: ComponentFixture<ItemImagesCarouselComponent>;
  const flagRightClass = '.ItemFlag--right';
  const flagLeftClass = '.ItemFlag--left';

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
    beforeEach(() => {
      component.itemFlags = ITEM_EXTENDED_FLAGS;
      fixture.detectChanges();
    });

    describe('and is bumped or country bumped...', () => {
      it('should show one flag on the right when is bumped', () => {
        component.itemFlags.bumped = true;
        fixture.detectChanges();

        const bumpedFlag = fixture.debugElement.query(By.css(flagRightClass));

        expect(bumpedFlag).toBeTruthy();
      });

      it('should show one flag on the right when is country bumped', () => {
        component.itemFlags.country_bumped = true;
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

        const reservedFlag = fixture.debugElement.queryAll(By.css(flagLeftClass));

        expect(reservedFlag).toBeTruthy();
      });

      it('should show one flag on the left when is expired', () => {
        component.itemFlags.expired = true;
        fixture.detectChanges();

        const expiredFlag = fixture.debugElement.queryAll(By.css(flagLeftClass));

        expect(expiredFlag).toBeTruthy();
      });

      it('should show one flag on the left when is inactive', () => {
        component.itemFlags.onhold = true;
        fixture.detectChanges();

        const inactiveFlag = fixture.debugElement.queryAll(By.css(flagLeftClass));

        expect(inactiveFlag).toBeTruthy();
      });
    });
  });
});
