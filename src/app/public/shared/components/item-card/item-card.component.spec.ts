import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChangeDetectionStrategy, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { MOCK_ITEM_CARD } from '@fixtures/item-card.fixtures.spec';
import { ImageFallbackModule } from '@public/core/directives/image-fallback/image-fallback.module';
import { FavouriteIconModule } from '@public/shared/components/favourite-icon/favourite-icon.module';
import { CustomCurrencyModule } from '@shared/pipes/custom-currency/custom-currency.module';
import { FavouriteIconComponent } from '../favourite-icon/favourite-icon.component';

import { ItemCardComponent } from './item-card.component';
import { NgxPermissionsModule, NgxPermissionsService } from 'ngx-permissions';
import { PERMISSIONS } from '@core/user/user-constants';
import { ToggleFavoriteInterface } from '@public/shared/components/item-card-list/interfaces/toggle-favorite.interface';
import { MOCK_ITEM_CARD_WIDE } from '@public/shared/components/item-card-wide/item-card-wide.mock.stories';
import { LOGIN_SOURCE } from '@public/shared/components/item-card-list/enums/login-source.enum';

describe('ItemCardComponent', () => {
  let component: ItemCardComponent;
  let fixture: ComponentFixture<ItemCardComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let permissionService: NgxPermissionsService;
  const mockToggleFavoriteInterface: ToggleFavoriteInterface = {
    item: MOCK_ITEM_CARD,
    loginSource: LOGIN_SOURCE.FAVORITE_ITEM,
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemCardComponent],
      imports: [
        CommonModule,
        FavouriteIconModule,
        CustomCurrencyModule,
        SvgIconModule,
        ImageFallbackModule,
        HttpClientTestingModule,
        NgxPermissionsModule.forRoot(),
      ],
    })
      .overrideComponent(ItemCardComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemCardComponent);
    permissionService = TestBed.inject(NgxPermissionsService);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    el = de.nativeElement;
    component.item = MOCK_ITEM_CARD;
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

          expect(component.toggleFavourite.emit).toBeCalledWith(mockToggleFavoriteInterface);
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
        component.item.bumpFlags.bumped = true;
      });
      describe('and has visibility permissions', () => {
        beforeEach(() => {
          permissionService.addPermission(PERMISSIONS.bumps);
        });
        it('should show item as bumped', () => {
          fixture.detectChanges();

          expect(el.querySelector(`[src*="${iconPartialSrc}"]`)).toBeTruthy();
        });
      });
      describe('and has not visibility permissions', () => {
        beforeEach(() => {
          permissionService.removePermission(PERMISSIONS.bumps);
        });
        it('should not show item as bumped', () => {
          fixture.detectChanges();

          expect(el.querySelector(`[src*="${iconPartialSrc}"]`)).toBeFalsy();
        });
      });
    });

    describe('when is bumped and reserved', () => {
      beforeEach(() => {
        component.item.bumpFlags.bumped = true;
        component.item.flags.reserved = true;
      });

      describe('and has visibility permissions', () => {
        beforeEach(() => {
          permissionService.addPermission(PERMISSIONS.bumps);
        });
        it('should show item as bumped and reserved', () => {
          const reservedPartialSrc = 'reserved';

          fixture.detectChanges();

          expect(el.querySelector(`[src*="${iconPartialSrc}"]`)).toBeTruthy();
          expect(el.querySelector(`[src*="${reservedPartialSrc}"]`)).toBeTruthy();
        });
      });
      describe('and has not visibility permissions', () => {
        beforeEach(() => {
          permissionService.removePermission(PERMISSIONS.bumps);
        });
        it('should show item as reserved', () => {
          const reservedPartialSrc = 'reserved';

          fixture.detectChanges();

          expect(el.querySelector(`[src*="${iconPartialSrc}"]`)).toBeFalsy();
          expect(el.querySelector(`[src*="${reservedPartialSrc}"]`)).toBeTruthy();
        });
      });
    });

    describe('when is NOT bumped', () => {
      beforeEach(() => {
        component.item.bumpFlags.bumped = false;
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

  describe(`when we click on the item's favourite icon`, () => {
    it('should emit the toggle favourite click event', () => {
      spyOn(component.toggleFavourite, 'emit');
      const favouriteIcon = fixture.debugElement.query(By.directive(FavouriteIconComponent)).nativeElement;

      favouriteIcon.click();

      expect(component.toggleFavourite.emit).toHaveBeenCalled();
    });
  });

  describe('when it loads the image', () => {
    it('and it is the second item and, considered Largest Contentful Paint (LCP), the image should be eager loaded', () => {
      component.index = 1;

      fixture.detectChanges();
      const image = fixture.debugElement.query(By.css('.ItemCard__image > img'));

      expect(image.attributes.loading).toBe('eager');
    });

    it('and it is NOT the second item, the image should be lazy loaded', () => {
      component.index = 0;

      fixture.detectChanges();
      const image = fixture.debugElement.query(By.css('.ItemCard__image > img'));

      expect(image.attributes.loading).toBe('lazy');
    });
  });
});
