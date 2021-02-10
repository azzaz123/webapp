import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { MOCK_ITEM } from '@fixtures/item.fixtures.spec';
import { ImageFallbackModule } from '@public/core/directives/image-fallback/image-fallback.module';
import { FavouriteIconModule } from '@public/shared/components/favourite-icon/favourite-icon.module';
import { CustomCurrencyModule } from '@shared/pipes/custom-currency/custom-currency.module';
import { FavouriteIconComponent } from '../favourite-icon/favourite-icon.component';

import { ItemCardComponent } from './item-card.component';

describe('ItemCardComponent', () => {
  let component: ItemCardComponent;
  let fixture: ComponentFixture<ItemCardComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemCardComponent],
      imports: [CommonModule, FavouriteIconModule, CustomCurrencyModule, SvgIconModule, ImageFallbackModule, HttpClientTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemCardComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    el = de.nativeElement;
    component.item = MOCK_ITEM;
    fixture.detectChanges();
  });

  describe('favourite', () => {
    const favouriteIconSelector = 'tsl-favourite-icon';

    describe('when icon should be displayed', () => {
      const favouriteIconAttr = 'ng-reflect-active';
      let favouriteIconElement: HTMLElement;
      describe('when is favourite', () => {
        beforeEach(() => {
          component.item.flags.favorite = true;
          fixture.detectChanges();
          favouriteIconElement = el.querySelector(favouriteIconSelector);
        });

        it('should show item as favourite', () => {
          expect(favouriteIconElement.getAttribute(favouriteIconAttr) === 'true').toBeTruthy();
        });

        it('should change favourite state on favourite icon click', () => {
          spyOn(component.toggleFavourite, 'emit');

          favouriteIconElement.click();

          expect(component.toggleFavourite.emit).toBeCalled();
        });
      });

      describe('when is NOT favourite', () => {
        beforeEach(() => {
          component.item.flags.favorite = false;
          fixture.detectChanges();
          favouriteIconElement = el.querySelector(favouriteIconSelector);
        });

        it('should show item as NOT favourite', () => {
          expect(favouriteIconElement.getAttribute(favouriteIconAttr) === 'false').toBeTruthy();
        });

        it('should change favourite state on favourite icon click', () => {
          spyOn(component.toggleFavourite, 'emit');

          favouriteIconElement.click();

          expect(component.toggleFavourite.emit).toBeCalled();
        });
      });
    });

    describe('when icon should not be displayed', () => {
      beforeEach(() => {
        component.showFavourite = false;
        fixture.detectChanges();
      });

      it('should not show favourite icon', () => {
        expect(el.querySelector(favouriteIconSelector)).toBeFalsy();
      });
    });
  });

  describe('bumped', () => {
    const iconPartialSrc = 'bumped';

    describe('when is bumped', () => {
      beforeEach(() => {
        component.item.flags.bumped = true;
        fixture.detectChanges();
      });

      it('should show item as bumped', () => {
        expect(el.querySelector(`[src*="${iconPartialSrc}"]`)).toBeTruthy();
      });
    });

    describe('when is bumped and reserved', () => {
      beforeEach(() => {
        component.item.flags.bumped = true;
        component.item.flags.reserved = true;
        fixture.detectChanges();
      });

      it('should show item as bumped and reserved', () => {
        const reservedPartialSrc = 'reserved';

        expect(el.querySelector(`[src*="${iconPartialSrc}"]`)).toBeTruthy();
        expect(el.querySelector(`[src*="${reservedPartialSrc}"]`)).toBeTruthy();
      });
    });

    describe('when is NOT bumped', () => {
      beforeEach(() => {
        component.item.flags.bumped = false;
        fixture.detectChanges();
      });

      it('should NOT show item as bumped', () => {
        expect(el.querySelector(`[src*="${iconPartialSrc}"]`)).toBeFalsy();
      });
    });
  });

  describe('sold', () => {
    const iconPartialSrc = 'sold';

    describe('when is sold', () => {
      beforeEach(() => {
        component.item.flags.sold = true;
        fixture.detectChanges();
      });

      it('should show item as sold', () => {
        expect(el.querySelector(`[src*="${iconPartialSrc}"]`)).toBeTruthy();
      });
    });

    describe('when is NOT sold', () => {
      beforeEach(() => {
        component.item.flags.sold = false;
        fixture.detectChanges();
      });

      it('should NOT show item as sold', () => {
        expect(el.querySelector(`[src*="${iconPartialSrc}"]`)).toBeFalsy();
      });
    });
  });

  describe('reserved', () => {
    const iconPartialSrc = 'reserved';

    describe('when is reserved', () => {
      beforeEach(() => {
        component.item.flags.reserved = true;
        fixture.detectChanges();
      });

      it('should show item as reserved', () => {
        expect(el.querySelector(`[src*="${iconPartialSrc}"]`)).toBeTruthy();
      });
    });

    describe('when is NOT reserved', () => {
      beforeEach(() => {
        component.item.flags.reserved = false;
        fixture.detectChanges();
      });

      it('should NOT show item as reserved', () => {
        expect(el.querySelector(`[src*="${iconPartialSrc}"]`)).toBeFalsy();
      });
    });
  });

  describe('when we click on the item...', () => {
    it('should emit the item click event', fakeAsync(() => {
      spyOn(component.itemClick, 'emit');
      spyOn(component.toggleFavourite, 'emit');
      const itemCard = fixture.debugElement.nativeElement.querySelector('.ItemCard');

      itemCard.click();
      tick();

      expect(component.itemClick.emit).toHaveBeenCalled();
      expect(component.toggleFavourite.emit).not.toHaveBeenCalled();
    }));
  });

  describe(`when we click on the item's favourite icon`, () => {
    it('should emit the toggle favourite click event', () => {
      spyOn(component.itemClick, 'emit');
      spyOn(component.toggleFavourite, 'emit');
      const favouriteIcon = fixture.debugElement.query(By.directive(FavouriteIconComponent)).nativeElement;

      favouriteIcon.click();

      expect(component.itemClick.emit).not.toHaveBeenCalled();
      expect(component.toggleFavourite.emit).toHaveBeenCalled();
    });
  });
});
