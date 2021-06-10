import { CommonModule, DecimalPipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { DeviceDetectorServiceMock } from '@fixtures/remote-console.fixtures.spec';
import { TypeCheckService } from '@public/core/services/type-check/type-check.service';
import { CustomCurrencyModule } from '@shared/pipes/custom-currency/custom-currency.module';
import { DeviceDetectorService } from 'ngx-device-detector';
import { SlidesCarouselComponent } from '../carousel-slides/carousel-slides.component';
import { SlidesCarouselModule } from '../carousel-slides/carousel-slides.module';
import { FavouriteIconComponent } from '../favourite-icon/favourite-icon.component';
import { FavouriteIconModule } from '../favourite-icon/favourite-icon.module';
import { ItemExtraInfoModule } from '../item-extra-info/item-extra-info.module';

import { ItemCardWideComponent } from './item-card-wide.component';
import { MOCK_ITEM_CARD_WIDE_BUMPED, MOCK_ITEM_CARD_WIDE_GBP } from './item-card-wide.mock.stories';
import { DeviceService } from '@core/device/device.service';
import { MockDeviceService } from '@fixtures/device.fixtures.spec';
import { NgxPermissionsModule, NgxPermissionsService } from 'ngx-permissions';
import { PERMISSIONS } from '@core/user/user-constants';

describe('ItemCardWideComponent', () => {
  const favouriteIconSelector = 'tsl-favourite-icon';
  const componentClass = '.ItemCardWide';
  const itemPriceClass = '.ItemCardWide__price';
  const countryBumpedClass = '.ItemCardWide__icon--contryBumped';
  const bumpedClass = '.ItemCardWide__icon--bumped';
  const currencies = {
    EUR: '€',
    GBP: '£',
  };

  let component: ItemCardWideComponent;
  let fixture: ComponentFixture<ItemCardWideComponent>;
  let decimalPipe: DecimalPipe;
  let permissionService: NgxPermissionsService;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemCardWideComponent, SlidesCarouselComponent],
      imports: [
        CommonModule,
        FavouriteIconModule,
        CustomCurrencyModule,
        SvgIconModule,
        HttpClientTestingModule,
        SlidesCarouselModule,
        ItemExtraInfoModule,
        NgxPermissionsModule.forRoot(),
      ],
      providers: [
        TypeCheckService,
        DecimalPipe,
        NgxPermissionsService,
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceMock },
        { provide: DeviceService, useValue: MockDeviceService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemCardWideComponent);
    component = fixture.componentInstance;
    decimalPipe = TestBed.inject(DecimalPipe);
    permissionService = TestBed.inject(NgxPermissionsService);
    de = fixture.debugElement;
    el = de.nativeElement;
    component.item = MOCK_ITEM_CARD_WIDE_BUMPED;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when we get an item...', () => {
    it('should render the template', () => {
      expect(de.query(By.css(componentClass))).toBeTruthy();
    });

    it('should render the carousel slides component', () => {
      expect(de.query(By.directive(SlidesCarouselComponent))).toBeTruthy();
    });

    describe('when the item currency code is in euros...', () => {
      it('should show the price and the euros symbol', () => {
        expect(el.querySelector(itemPriceClass).innerHTML).toEqual(`${decimalPipe.transform(component.item.salePrice)}${currencies.EUR}`);
      });
    });

    describe('when the item currency code is in dollars...', () => {
      beforeEach(() => {
        component.item = MOCK_ITEM_CARD_WIDE_GBP;

        fixture.detectChanges();
      });
      it('should show the price and the dollar symbol', () => {
        expect(el.querySelector(itemPriceClass).innerHTML).toEqual(`${currencies.GBP}${decimalPipe.transform(component.item.salePrice)}`);
      });
    });

    it('should print their title', () => {
      expect(el.querySelector('.ItemCardWide__title').innerHTML).toEqual(component.item.title);
    });

    it('should print their description', () => {
      expect(el.querySelector('.ItemCardWide__description').innerHTML).toEqual(component.item.description);
    });

    describe('and we recieve the extra info...', () => {
      beforeEach(() => {
        component.itemExtraInfo = ['100cv', 'Diesel'];

        fixture.detectChanges();
      });
      it('should render the extra info component', () => {
        expect(de.query(By.css('tsl-item-extra-info'))).toBeTruthy();
      });
    });

    describe(`and we DON'T recieve the extra info...`, () => {
      beforeEach(() => {
        component.itemExtraInfo = [];

        fixture.detectChanges();
      });
      it('should NOT render the extra info component', () => {
        expect(de.query(By.css('tsl-item-extra-info'))).toBeFalsy();
      });
    });

    describe('favourite', () => {
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
      beforeEach(() => {
        component.item.bumpFlags.country_bumped = false;
      });

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

            expect(de.query(By.css(bumpedClass))).toBeTruthy();
            expect(el.querySelector(`[src*="${iconPartialSrc}"]`)).toBeTruthy();
          });
        });

        describe('and not has visibility permissions', () => {
          beforeEach(() => {
            permissionService.removePermission(PERMISSIONS.bumps);
          });
          it('should show item as bumped', () => {
            fixture.detectChanges();

            expect(de.query(By.css(bumpedClass))).toBeFalsy();
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
          it('should show item as bumped and reserved', () => {
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
          expect(de.query(By.css(bumpedClass))).toBeFalsy();
          expect(el.querySelector(`[src*="${iconPartialSrc}"]`)).toBeFalsy();
        });
      });
    });

    describe('country bumped', () => {
      const iconPartialSrc = 'bumped';

      beforeEach(() => {
        component.item.bumpFlags.bumped = false;
      });
      describe('when is country bumped', () => {
        beforeEach(() => {
          component.item.bumpFlags.country_bumped = true;
        });

        describe('and has visibility permissions', () => {
          beforeEach(() => {
            permissionService.addPermission(PERMISSIONS.bumps);
          });
          it('should show item as country bumped', () => {
            fixture.detectChanges();

            expect(de.query(By.css(countryBumpedClass))).toBeTruthy();
            expect(el.querySelector(`[src*="${iconPartialSrc}"]`)).toBeTruthy();
          });
        });
        describe('and has not visibility permissions', () => {
          beforeEach(() => {
            permissionService.removePermission(PERMISSIONS.bumps);
          });
          it('should not show item as country bumped', () => {
            fixture.detectChanges();

            expect(de.query(By.css(countryBumpedClass))).toBeFalsy();
            expect(el.querySelector(`[src*="${iconPartialSrc}"]`)).toBeFalsy();
          });
        });
      });

      describe('when is NOT country bumped', () => {
        beforeEach(() => {
          component.item.bumpFlags.country_bumped = false;
          fixture.detectChanges();
        });

        it('should NOT show item as country bumped', () => {
          expect(de.query(By.css(countryBumpedClass))).toBeFalsy();
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
  });

  describe(`when we DON'T get an item...`, () => {
    beforeEach(() => {
      component.item = null;

      fixture.detectChanges();
    });
    it('should not render the template', () => {
      expect(de.query(By.css(componentClass))).toBeFalsy();
    });
  });
});
