import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { MOCK_ITEM } from '@fixtures/item.fixtures.spec';
import { ItemApiModule } from '@public/core/services/api/item/item-api.module';
import { FavouriteIconModule } from '@public/shared/components/favourite-icon/favourite-icon.module';
import { CustomCurrencyModule } from '@shared/pipes/custom-currency/custom-currency.module';
import { SanitizedBackgroundModule } from '@shared/sanitized-background/sanitized-background.module';

import { ItemCardComponent } from './item-card.component';
import { ItemCardService } from './services/item-card.service';

describe('ItemCardComponent', () => {
  let component: ItemCardComponent;
  let fixture: ComponentFixture<ItemCardComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemCardComponent],
      imports: [
        CommonModule,
        FavouriteIconModule,
        CustomCurrencyModule,
        SvgIconModule,
        SanitizedBackgroundModule,
        ItemApiModule,
        HttpClientTestingModule,
      ],
      providers: [ItemCardService],
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
    const favouriteIconAttr = 'ng-reflect-active';
    let favouriteIconElement: HTMLElement;

    describe('when is favourite', () => {
      beforeEach(() => {
        component.item.flags.favorite = true;
        fixture.detectChanges();
        favouriteIconElement = el.querySelector(favouriteIconSelector);
      });

      it('should show item as favourite', () => {
        expect(
          favouriteIconElement.getAttribute(favouriteIconAttr) === 'true'
        ).toBeTruthy();
      });

      it('should change favourite state on favourite icon click', () => {
        favouriteIconElement.click();
        fixture.detectChanges();

        expect(
          favouriteIconElement.getAttribute(favouriteIconAttr) === 'false'
        ).toBeTruthy();
      });
    });

    describe('when is NOT favourite', () => {
      beforeEach(() => {
        component.item.flags.favorite = false;
        fixture.detectChanges();
        favouriteIconElement = el.querySelector(favouriteIconSelector);
      });

      it('should show item as NOT favourite', () => {
        expect(
          favouriteIconElement.getAttribute(favouriteIconAttr) === 'false'
        ).toBeTruthy();
      });

      it('should change favourite state on favourite icon click', () => {
        favouriteIconElement.click();
        fixture.detectChanges();

        expect(
          favouriteIconElement.getAttribute(favouriteIconAttr) === 'true'
        ).toBeTruthy();
      });
    });
  });

  describe('favourite', () => {
    const favouriteIconSelector = 'tsl-favourite-icon';
    const favouriteIconAttr = 'ng-reflect-active';
    let favouriteIconElement: HTMLElement;

    describe('when is favourite', () => {
      beforeEach(() => {
        component.item.flags.favorite = true;
        fixture.detectChanges();
        favouriteIconElement = el.querySelector(favouriteIconSelector);
      });

      it('should show item as favourite', () => {
        expect(
          favouriteIconElement.getAttribute(favouriteIconAttr) === 'true'
        ).toBeTruthy();
      });

      it('should change favourite state on favourite icon click', () => {
        favouriteIconElement.click();
        fixture.detectChanges();

        expect(
          favouriteIconElement.getAttribute(favouriteIconAttr) === 'false'
        ).toBeTruthy();
      });
    });

    describe('when is NOT favourite', () => {
      beforeEach(() => {
        component.item.flags.favorite = false;
        fixture.detectChanges();
        favouriteIconElement = el.querySelector(favouriteIconSelector);
      });

      it('should show item as NOT favourite', () => {
        expect(
          favouriteIconElement.getAttribute(favouriteIconAttr) === 'false'
        ).toBeTruthy();
      });

      it('should change favourite state on favourite icon click', () => {
        favouriteIconElement.click();
        fixture.detectChanges();

        expect(
          favouriteIconElement.getAttribute(favouriteIconAttr) === 'true'
        ).toBeTruthy();
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
});
