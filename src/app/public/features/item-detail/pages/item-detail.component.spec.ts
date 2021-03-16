import { CookieService } from 'ngx-cookie';
import { DeviceDetectorService } from 'ngx-device-detector';
import { BehaviorSubject, of } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, DebugElement, Renderer2 } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AdsService } from '@core/ads/services';
import { DeviceService } from '@core/device/device.service';
import { DeviceType } from '@core/device/deviceType.enum';
import { MockAdsService } from '@fixtures/ads.fixtures.spec';
import {
  MOCK_CAR_ITEM_DETAIL,
  MOCK_CAR_ITEM_DETAIL_WITHOUT_COUNTER,
  MOCK_CAR_ITEM_DETAIL_WITH_VIEWS,
  MOCK_ITEM_DETAIL_FASHION,
  MOCK_ITEM_DETAIL_GBP,
  MOCK_ITEM_DETAIL_WITHOUT_EXTRA_INFO,
  MOCK_ITEM_DETAIL_WITHOUT_ITEM,
  MOCK_ITEM_DETAIL_WITHOUT_LOCATION,
  MOCK_ITEM_DETAIL_WITHOUT_TAXONOMIES,
} from '@fixtures/item-detail.fixtures.spec';
import { MOCK_ITEM, MOCK_ITEM_GBP } from '@fixtures/item.fixtures.spec';
import { IsCurrentUserStub } from '@fixtures/public/core';
import { DeviceDetectorServiceMock } from '@fixtures/remote-console.fixtures.spec';
import { AdComponentStub } from '@fixtures/shared';
import { ItemApiService } from '@public/core/services/api/item/item-api.service';
import { CheckSessionService } from '@public/core/services/check-session/check-session.service';
import { ItemCardService } from '@public/core/services/item-card/item-card.service';
import {
  EMPTY_RECOMMENDED_ITEMS_MOCK,
  RECOMMENDED_ITEMS_MOCK,
} from '@public/features/item-detail/components/recommended-items/constants/recommended-items.fixtures.spec';
import { CustomCurrencyPipe } from '@shared/pipes';
import { ItemFullScreenCarouselComponent } from '../components/item-fullscreen-carousel/item-fullscreen-carousel.component';
import { ItemSpecificationsComponent } from '../components/item-specifications/item-specifications.component';
import { ItemSpecificationsModule } from '../components/item-specifications/item-specifications.module';
import { ItemTaxonomiesComponent } from '../components/item-taxonomies/item-taxonomies.component';
import { ADS_ITEM_DETAIL } from '../core/ads/item-detail-ads.config';
import { EllapsedTimeModule } from '../core/directives/ellapsed-time.module';
import { ItemDetailStoreService } from '../core/services/item-detail-store/item-detail-store.service';
import { ItemDetailService } from '../core/services/item-detail/item-detail.service';
import { MapExtraInfoService } from '../core/services/map-extra-info/map-extra-info.service';
import { ItemDetail } from '../interfaces/item-detail.interface';
import { ItemDetailComponent } from './item-detail.component';

describe('ItemDetailComponent', () => {
  const mapTag = 'tsl-here-maps';
  const recommendedItemsTag = 'tsl-recommended-items';
  const currencies = {
    EUR: '€',
    GBP: '£',
  };
  const itemPriceClass = '.ItemDetail__price';
  const fallbackMapClass = '.ItemDetail__fakeMap';
  const locationClass = '.ItemDetail__location';
  const itemContentClass = '.ItemDetail__content';
  const carExtraInfoClass = '.ItemExtraInfo--car';
  const itemId = '123';

  const itemDetailSubjectMock: BehaviorSubject<ItemDetail> = new BehaviorSubject<ItemDetail>(MOCK_ITEM_DETAIL_GBP);
  const itemDetailStoreServiceMock = {
    markItemAsReserved: () => of(),
    markItemAsSold: () => {},
    initializeItem: () => {},
    itemDetail$: itemDetailSubjectMock.asObservable(),
  };

  let component: ItemDetailComponent;
  let fixture: ComponentFixture<ItemDetailComponent>;
  let itemDetailService: ItemDetailService;
  let mapExtraInfoService: MapExtraInfoService;
  let deviceService: DeviceService;
  let decimalPipe: DecimalPipe;
  let itemDetailImagesModal: ItemFullScreenCarouselComponent;
  let itemDetailStoreService: ItemDetailStoreService;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ItemDetailComponent,
        CustomCurrencyPipe,
        IsCurrentUserStub,
        AdComponentStub,
        ItemSpecificationsComponent,
        ItemTaxonomiesComponent,
      ],
      imports: [HttpClientTestingModule, ItemSpecificationsModule, EllapsedTimeModule],
      providers: [
        CheckSessionService,
        ItemCardService,
        DecimalPipe,
        ItemApiService,
        ItemFullScreenCarouselComponent,
        Renderer2,
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceMock },
        {
          provide: CookieService,
          useValue: {},
        },
        {
          provide: Router,
          useValue: {},
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => itemId,
              },
            },
          },
        },
        {
          provide: AdsService,
          useValue: MockAdsService,
        },
        {
          provide: ItemDetailService,
          useValue: {
            getRecommendedItems: () => {
              return of(RECOMMENDED_ITEMS_MOCK);
            },
          },
        },
        {
          provide: ItemDetailStoreService,
          useValue: itemDetailStoreServiceMock,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(ItemDetailComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemDetailComponent);
    component = fixture.componentInstance;
    deviceService = TestBed.inject(DeviceService);
    decimalPipe = TestBed.inject(DecimalPipe);
    itemDetailService = TestBed.inject(ItemDetailService);
    mapExtraInfoService = TestBed.inject(MapExtraInfoService);
    de = fixture.debugElement;
    el = de.nativeElement;
    itemDetailStoreService = TestBed.inject(ItemDetailStoreService);
    itemDetailImagesModal = TestBed.inject(ItemFullScreenCarouselComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when we are on MOBILE...', () => {
    it('should only show AD on description', () => {
      spyOn(deviceService, 'getDeviceType').and.returnValue(DeviceType.MOBILE);

      component.ngOnInit();
      fixture.detectChanges();

      const ads = fixture.debugElement.queryAll(By.directive(AdComponentStub));

      expect(ads.length).toBe(2);
    });
  });

  describe('when we are on TABLET...', () => {
    it('should show only the top AD', () => {
      spyOn(deviceService, 'getDeviceType').and.returnValue(DeviceType.TABLET);

      component.ngOnInit();
      fixture.detectChanges();
      const ads = fixture.debugElement.queryAll(By.directive(AdComponentStub));

      expect(ads.length).toBe(2);
    });
  });

  describe('when we are on DESKTOP...', () => {
    it('should show the three ADS', () => {
      spyOn(deviceService, 'getDeviceType').and.returnValue(DeviceType.DESKTOP);

      component.ngOnInit();
      fixture.detectChanges();
      const ads = fixture.debugElement.queryAll(By.directive(AdComponentStub));

      expect(ads.length).toBe(3);
    });
  });

  describe('when component inits', () => {
    describe('and we get the item...', () => {
      it('should ask for item data', () => {
        spyOn(itemDetailStoreService, 'initializeItem');

        component.ngOnInit();

        expect(itemDetailStoreService.initializeItem).toHaveBeenCalledWith(itemId);
      });

      it('should set ads configuration', () => {
        itemDetailSubjectMock.next(MOCK_CAR_ITEM_DETAIL);
        spyOn(MockAdsService, 'setAdKeywords').and.callThrough();
        spyOn(MockAdsService, 'setSlots').and.callThrough();

        component.ngOnInit();

        expect(MockAdsService.setAdKeywords).toHaveBeenCalledWith({ category: MOCK_CAR_ITEM_DETAIL.item.categoryId.toString() });
        expect(MockAdsService.setSlots).toHaveBeenCalledWith([ADS_ITEM_DETAIL.item1, ADS_ITEM_DETAIL.item2l, ADS_ITEM_DETAIL.item3r]);
      });
    });

    describe('and we NOT get the item...', () => {
      it('should not render the view', () => {
        itemDetailSubjectMock.next(MOCK_ITEM_DETAIL_WITHOUT_ITEM);

        fixture.detectChanges();
        const containerPage = fixture.debugElement.query(By.css(itemContentClass));

        expect(containerPage).toBeFalsy();
      });
    });
  });

  describe('when we have an item...', () => {
    beforeEach(() => {
      itemDetailSubjectMock.next(MOCK_CAR_ITEM_DETAIL);

      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should print their title', () => {
      expect(el.querySelector('.ItemDetail__title').innerHTML).toEqual(MOCK_CAR_ITEM_DETAIL.item.title);
    });

    it('should print their description', () => {
      expect(el.querySelector('.ItemDetail__description').innerHTML).toEqual(MOCK_CAR_ITEM_DETAIL.item.description);
    });

    it('should show the item detail header', () => {
      expect(fixture.debugElement.query(By.css('tsl-item-detail-header'))).toBeTruthy();
    });

    describe('when the favorites and views are NOT defined...', () => {
      it('should show the 0 stat', () => {
        expect(el.querySelector('#favorites').innerHTML).toEqual('0');
        expect(el.querySelector('#views').innerHTML).toEqual('0');
      });
    });

    describe('when the favorites and views are defined...', () => {
      beforeEach(() => {
        itemDetailSubjectMock.next(MOCK_CAR_ITEM_DETAIL_WITH_VIEWS);

        fixture.detectChanges();
      });

      it('should print their favorites stat', () => {
        expect(el.querySelector('#favorites').innerHTML).toEqual(MOCK_CAR_ITEM_DETAIL_WITH_VIEWS.item.favorites.toString());
      });
      it('should print their views stat', () => {
        expect(el.querySelector('#views').innerHTML).toEqual(MOCK_CAR_ITEM_DETAIL_WITH_VIEWS.item.views.toString());
      });
    });

    describe('when the item currency code is in euros...', () => {
      it('should show the price and the euros symbol', () => {
        expect(el.querySelector(itemPriceClass).innerHTML).toEqual(
          `${decimalPipe.transform(MOCK_CAR_ITEM_DETAIL.item.salePrice)}${currencies.EUR}`
        );
      });
    });

    describe('when the item currency code is in dollars...', () => {
      beforeEach(() => {
        itemDetailSubjectMock.next(MOCK_ITEM_DETAIL_GBP);

        fixture.detectChanges();
      });

      it('should show the price and the dollar symbol', () => {
        expect(el.querySelector(itemPriceClass).innerHTML).toEqual(`${currencies.GBP}${decimalPipe.transform(MOCK_ITEM_GBP.salePrice)}`);
      });
    });

    describe('when the item have recommended items...', () => {
      beforeEach(() => {
        spyOn(itemDetailService, 'getRecommendedItems').and.returnValue(of(RECOMMENDED_ITEMS_MOCK));

        component.ngOnInit();
        fixture.detectChanges();
      });
      it('should show the recommended items', () => {
        expect(fixture.debugElement.query(By.css(recommendedItemsTag))).toBeTruthy();
      });
    });

    describe(`when the item don't have recommended items`, () => {
      beforeEach(() => {
        spyOn(itemDetailService, 'getRecommendedItems').and.returnValue(of(EMPTY_RECOMMENDED_ITEMS_MOCK));

        component.ngOnInit();
        fixture.detectChanges();
      });
      it('should NOT show the recommended items', () => {
        expect(fixture.debugElement.query(By.css(recommendedItemsTag))).toBeFalsy();
      });
    });

    describe('when we click on the carousel image...', () => {
      beforeEach(() => {
        component.itemDetailImagesModal = itemDetailImagesModal;
        spyOn(component.itemDetailImagesModal, 'show');

        const itemImagesCarousel = fixture.debugElement.query(By.css('tsl-item-images-carousel'));
        itemImagesCarousel.triggerEventHandler('imageClick', { index: 4 });

        fixture.detectChanges();
      });

      it('should call to the modal show method', () => {
        expect(component.itemDetailImagesModal.show).toHaveBeenCalled();
      });

      it('should set the images property', () => {
        expect(component.itemDetailImagesModal.images).toStrictEqual(MOCK_CAR_ITEM_DETAIL.bigImages);
      });

      it('should set the item property', () => {
        expect(component.itemDetailImagesModal.item).toBe(MOCK_CAR_ITEM_DETAIL.item);
      });

      it('should set the image index property', () => {
        expect(component.itemDetailImagesModal.imageIndex).toBe(4);
      });
    });
  });

  describe('when we handle the location...', () => {
    describe('when the location is defined', () => {
      it('should show the specified location', () => {
        const map = fixture.debugElement.query(By.css(mapTag));
        const fallbackMap = fixture.debugElement.query(By.css(fallbackMapClass));

        expect(el.querySelector(locationClass).innerHTML).toContain(MOCK_CAR_ITEM_DETAIL.locationSpecifications);
        expect(map).toBeTruthy();
        expect(fallbackMap).toBeFalsy();
      });
    });

    describe('when the location is NOT defined', () => {
      beforeEach(() => {
        itemDetailSubjectMock.next(MOCK_ITEM_DETAIL_WITHOUT_LOCATION);

        fixture.detectChanges();
      });

      it('should have an undefined location', () => {
        expect(el.querySelector(locationClass).innerHTML).toContain($localize`:@@Undefined:Undefined`);
      });

      it('should show the fallback map', () => {
        const map = fixture.debugElement.query(By.css(mapTag));
        const fallbackMap = fixture.debugElement.query(By.css(fallbackMapClass));

        expect(map).toBeFalsy();
        expect(fallbackMap).toBeTruthy();
      });
    });
  });

  describe('when we handle the item specifications...', () => {
    describe('and the counter specifications are defined...', () => {
      it('should show the item specifications...', () => {
        expect(fixture.debugElement.query(By.directive(ItemSpecificationsComponent))).toBeTruthy();
      });
    });

    describe('and the counter specifications are NOT defined...', () => {
      beforeEach(() => {
        itemDetailSubjectMock.next(MOCK_CAR_ITEM_DETAIL_WITHOUT_COUNTER);

        fixture.detectChanges();
      });

      it('should NOT show the item specifications...', () => {
        expect(fixture.debugElement.query(By.directive(ItemSpecificationsComponent))).toBeFalsy();
      });
    });
  });

  describe('when we handle the item extra info...', () => {
    describe('and the extra info is defined...', () => {
      it('should be shown the item extra info content', () => {
        const extraInfo = fixture.debugElement.query(By.css('tsl-item-extra-info'));

        expect(extraInfo).toBeTruthy();
      });

      describe('and the item is a car...', () => {
        it('should apply the car specifications style', () => {
          const carExtraInfoStyle = fixture.debugElement.query(By.css(carExtraInfoClass));

          expect(carExtraInfoStyle).toBeTruthy();
        });
      });

      describe('and the item is NOT a car...', () => {
        beforeEach(() => {
          spyOn(mapExtraInfoService, 'mapExtraInfo');
          itemDetailSubjectMock.next(MOCK_ITEM_DETAIL_FASHION);

          component.ngOnInit();
          fixture.detectChanges();
        });
        it('should NOT apply the car specifications style', () => {
          const carExtraInfoStyle = fixture.debugElement.query(By.css(carExtraInfoClass));

          expect(carExtraInfoStyle).toBeFalsy();
          expect(mapExtraInfoService.mapExtraInfo).not.toHaveBeenCalled();
        });
      });
    });

    describe('and we NOT have extra info...', () => {
      beforeEach(() => {
        itemDetailSubjectMock.next(MOCK_ITEM_DETAIL_WITHOUT_EXTRA_INFO);

        fixture.detectChanges();
      });
      it('should NOT be shown the item extra info content', () => {
        const extraInfo = fixture.debugElement.query(By.css('tsl-item-extra-info'));
        const carExtraInfoStyle = fixture.debugElement.query(By.css(carExtraInfoClass));

        expect(carExtraInfoStyle).toBeFalsy();
        expect(extraInfo).toBeFalsy();
      });
    });
  });

  describe('when we handle the item taxonomies...', () => {
    describe('and the taxonomies are defined...', () => {
      it('should show the item specifications...', () => {
        expect(fixture.debugElement.query(By.directive(ItemTaxonomiesComponent))).toBeTruthy();
      });
    });

    describe('and the taxonomies are NOT defined...', () => {
      beforeEach(() => {
        itemDetailSubjectMock.next(MOCK_ITEM_DETAIL_WITHOUT_TAXONOMIES);

        component.ngOnInit();
        fixture.detectChanges();
      });

      it('should NOT show the item specifications...', () => {
        expect(fixture.debugElement.query(By.directive(ItemTaxonomiesComponent))).toBeFalsy();
      });
    });
  });
});
