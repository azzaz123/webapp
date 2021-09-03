import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SITE_URL } from '@configs/site-url.config';
import { CategoryService } from '@core/category/category.service';
import {
  MOCK_CELLPHONE_PARENT_RESPONSE,
  MOCK_CELLPHONE_RESPONSE,
  MOCK_CELLPHONE_WITHOUT_SUBCATEGORY_RESPONSE,
  MOCK_ITEM_DETAIL_RESPONSE,
  MOCK_ITEM_DETAIL_RESPONSE_ITEM_WITHOUT_LOCATION,
  MOCK_ITEM_DETAIL_RESPONSE_WITHOUT_COORDINATES,
  MOCK_ITEM_DETAIL_RESPONSE_WITHOUT_LOCATION,
  MOCK_ITEM_DETAIL_RESPONSE_WITH_APROX_LOCATION,
} from '@fixtures/item-detail-response.fixtures.spec';
import {
  ITEM_CELLPHONES_EXTRA_INFO,
  ITEM_CELLPHONES_EXTRA_INFO_PARENT_OBJECT_TYPE,
  ITEM_LARGE_IMAGE,
  ITEM_XLARGE_IMAGE,
} from '@fixtures/item.fixtures.spec';
import { MOCK_MAP_SPECIFICATIONS_CAR } from '@fixtures/map-specifications.fixtures.spec';
import { MOCK_SITE_URL } from '@fixtures/site-url.fixtures.spec';
import { MOCK_USER, MOCK_USER_STATS } from '@fixtures/user.fixtures.spec';
import { PublicUserApiService } from '@public/core/services/api/public-user/public-user-api.service';
import { TypeCheckService } from '@public/core/services/type-check/type-check.service';
import { ItemTaxonomies } from '@public/features/item-detail/components/item-taxonomies/interfaces/item-taxonomies.interface';
import { PublicProfileService } from '@public/features/public-profile/core/services/public-profile.service';
import { PUBLIC_PATHS } from '@public/public-routing-constants';
import { ItemDetailRoutePipe } from '@shared/pipes';
import { of } from 'rxjs';
import { MOCK_FASHION_EXTRA_INFO_LABELS } from '../map-extra-info/map-extra-info.fixtures.spec';
import { MapExtraInfoService } from '../map-extra-info/map-extra-info.service';
import { MapSpecificationsService } from '../map-specifications/map-specifications.service';
import { MapItemDetailStoreService } from './map-item-detail-store.service';

describe('MapItemDetailStoreService', () => {
  const titleCopy = $localize`:@@ItemDetailShareTitle:Share this product with your friends`;
  const twitterCopy = $localize`:@@ItemDetailShareTwitterText:Look what I found @wallapop:`;

  const MOCK_ICON = '/patch/icon.svg';

  let service: MapItemDetailStoreService;
  let mapSpecificationsService: MapSpecificationsService;
  let publicProfileService: PublicProfileService;
  let mapExtraInfoService: MapExtraInfoService;
  let categoryService: CategoryService;
  let typeCheckService: TypeCheckService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        MapItemDetailStoreService,
        TypeCheckService,
        MapSpecificationsService,
        ItemDetailRoutePipe,
        {
          provide: MapExtraInfoService,
          useValue: {
            mapExtraInfo: () => {},
          },
        },
        PublicProfileService,
        CategoryService,
        PublicUserApiService,
        {
          provide: SITE_URL,
          useValue: MOCK_SITE_URL,
        },
      ],
    });
    service = TestBed.inject(MapItemDetailStoreService);
    mapSpecificationsService = TestBed.inject(MapSpecificationsService);
    publicProfileService = TestBed.inject(PublicProfileService);
    mapExtraInfoService = TestBed.inject(MapExtraInfoService);
    categoryService = TestBed.inject(CategoryService);
    typeCheckService = TestBed.inject(TypeCheckService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when mapping the item detail response...', () => {
    describe('when we handle the item...', () => {
      it('should return the item from the response', () => {
        const itemDetail = service.mapItemDetailStore(MOCK_ITEM_DETAIL_RESPONSE);

        expect(itemDetail.item).toBe(MOCK_ITEM_DETAIL_RESPONSE.item);
      });
    });

    describe('when we handle the user...', () => {
      it('should return the user from the response', () => {
        const itemDetail = service.mapItemDetailStore(MOCK_ITEM_DETAIL_RESPONSE);

        expect(itemDetail.user).toBe(MOCK_ITEM_DETAIL_RESPONSE.user);
      });
    });

    describe('when we handle the images...', () => {
      it('should get the large image', () => {
        const itemDetail = service.mapItemDetailStore(MOCK_ITEM_DETAIL_RESPONSE);

        expect(itemDetail.images).toStrictEqual([ITEM_LARGE_IMAGE]);
      });
    });

    describe('when we handle the bigImages...', () => {
      it('should get the xlarge image', () => {
        const itemDetail = service.mapItemDetailStore(MOCK_ITEM_DETAIL_RESPONSE);

        expect(itemDetail.images).toStrictEqual([ITEM_XLARGE_IMAGE]);
      });
    });

    describe('when we handle the coordinate...', () => {
      it('should return the mapped coordinate', () => {
        const itemDetail = service.mapItemDetailStore(MOCK_ITEM_DETAIL_RESPONSE);
        const coordinate = {
          latitude: itemDetail.item.location.approximated_latitude,
          longitude: itemDetail.item.location.approximated_longitude,
        };
        expect(itemDetail.coordinate).toStrictEqual(coordinate);
      });
    });

    describe('when we handle the location...', () => {
      it('should return the location formatted', () => {
        const itemDetail = service.mapItemDetailStore(MOCK_ITEM_DETAIL_RESPONSE);

        expect(itemDetail.location).toStrictEqual({
          zip: itemDetail.item.location.zip,
          city: itemDetail.item.location.city,
          latitude: itemDetail.item.location.approximated_latitude,
          longitude: itemDetail.item.location.approximated_longitude,
        });
      });

      describe('when the item NOT have location...', () => {
        it('the location setted should be the user one', () => {
          const itemDetail = service.mapItemDetailStore(MOCK_ITEM_DETAIL_RESPONSE_ITEM_WITHOUT_LOCATION);
          const userLocation = {
            zip: MOCK_USER.location.zip,
            city: MOCK_USER.location.city,
            latitude: MOCK_USER.location.approximated_latitude,
            longitude: MOCK_USER.location.approximated_longitude,
          };

          expect(itemDetail.location).toStrictEqual(userLocation);
        });
      });

      describe('when we handle the locationSpecifications...', () => {
        describe('when the zip and the city are defined', () => {
          it('should return the zip and the city', () => {
            const itemDetail = service.mapItemDetailStore(MOCK_ITEM_DETAIL_RESPONSE);
            expect(itemDetail.locationSpecifications).toBe(`${itemDetail.item.location.zip}, ${itemDetail.item.location.city}`);
          });
        });
        describe('when the zip and the city are NOT defined', () => {
          it('should return an undefined copy', () => {
            const itemDetailWithoutLocation = service.mapItemDetailStore(MOCK_ITEM_DETAIL_RESPONSE_WITHOUT_LOCATION);
            expect(itemDetailWithoutLocation.locationSpecifications).toBe($localize`:@@Undefined:Undefined`);
          });
        });
      });

      describe('when we handle the taxonomiesSpecifications...', () => {
        describe('when the item have default taxonomy defined', () => {
          beforeEach(() => {
            spyOn(categoryService, 'getCategoryIconById').and.returnValue(of(MOCK_ICON));
          });

          it('should ask for the taxonomy category icon', () => {
            const itemDetail = service.mapItemDetailStore(MOCK_CELLPHONE_RESPONSE);

            expect(categoryService.getCategoryIconById).toHaveBeenCalled();
            itemDetail.taxonomiesSpecifications.subscribe((specifications) => {
              expect(specifications.icon).toBe(MOCK_ICON);
            });
          });

          describe('and the parent object is NOT defined...', () => {
            it('the parent taxonomy will be the default object type', () => {
              service.mapItemDetailStore(MOCK_CELLPHONE_RESPONSE).taxonomiesSpecifications.subscribe((specifications) => {
                expect(specifications.parentTaxonomy).toBe(ITEM_CELLPHONES_EXTRA_INFO.object_type.name);
              });
            });

            it('the child taxonomy will be null', () => {
              service.mapItemDetailStore(MOCK_CELLPHONE_RESPONSE).taxonomiesSpecifications.subscribe((specifications) => {
                expect(specifications.childTaxonomy).toBe(null);
              });
            });
          });

          describe('and the parent object is defined...', () => {
            it('the parent taxonomy will be the parent object type', () => {
              service.mapItemDetailStore(MOCK_CELLPHONE_PARENT_RESPONSE).taxonomiesSpecifications.subscribe((specifications) => {
                expect(specifications.parentTaxonomy).toBe(
                  ITEM_CELLPHONES_EXTRA_INFO_PARENT_OBJECT_TYPE.object_type.parent_object_type.name
                );
              });
            });
            it('the child taxonomy will be the default object type', () => {
              service.mapItemDetailStore(MOCK_CELLPHONE_PARENT_RESPONSE).taxonomiesSpecifications.subscribe((specifications) => {
                expect(specifications.childTaxonomy).toBe(ITEM_CELLPHONES_EXTRA_INFO_PARENT_OBJECT_TYPE.object_type.name);
              });
            });
          });
        });

        describe(`when the item don't have default taxonomy defined`, () => {
          it('the taxonomies will be null', () => {
            const itemDetailWithoutExtraInfo = service.mapItemDetailStore(MOCK_CELLPHONE_WITHOUT_SUBCATEGORY_RESPONSE);
            const emptyTaxonomies: ItemTaxonomies = {
              parentTaxonomy: null,
              childTaxonomy: null,
              icon: null,
            };

            itemDetailWithoutExtraInfo.taxonomiesSpecifications.subscribe((specifications) => {
              expect(specifications).toStrictEqual(emptyTaxonomies);
            });
          });
        });
      });

      describe('when we handle the counterSpecifications...', () => {
        it('should get the specifications', () => {
          spyOn(mapSpecificationsService, 'mapSpecification').and.returnValue(MOCK_MAP_SPECIFICATIONS_CAR);

          const itemDetail = service.mapItemDetailStore(MOCK_ITEM_DETAIL_RESPONSE);
          expect(itemDetail.counterSpecifications).toBe(MOCK_MAP_SPECIFICATIONS_CAR);
        });
      });

      describe('when we handle the userStats...', () => {
        it('should get the stats', () => {
          spyOn(publicProfileService, 'getStats').and.returnValue(of(MOCK_USER_STATS));

          const itemDetail = service.mapItemDetailStore(MOCK_ITEM_DETAIL_RESPONSE);
          itemDetail.userStats.subscribe((stats) => {
            expect(stats).toStrictEqual(MOCK_USER_STATS);
          });
        });
      });

      describe('when we handle the extraInfo...', () => {
        it('should get the extra info', () => {
          spyOn(mapExtraInfoService, 'mapExtraInfo').and.returnValue(MOCK_FASHION_EXTRA_INFO_LABELS);

          const itemDetail = service.mapItemDetailStore(MOCK_ITEM_DETAIL_RESPONSE);
          expect(itemDetail.extraInfo).toBe(MOCK_FASHION_EXTRA_INFO_LABELS);
        });
      });

      describe('when we handle the haveCoordinates...', () => {
        describe('when the item location have latitude and longitude...', () => {
          it('should return true', () => {
            const itemDetail = service.mapItemDetailStore(MOCK_ITEM_DETAIL_RESPONSE);
            expect(itemDetail.haveCoordinates).toBe(true);
          });
        });

        describe(`when the item location don't have latitude and longitude...`, () => {
          it('should return false', () => {
            const itemDetailWithoutCoordinates = MOCK_ITEM_DETAIL_RESPONSE_WITHOUT_COORDINATES;
            expect(service.mapItemDetailStore(itemDetailWithoutCoordinates).haveCoordinates).toBe(false);
          });
        });
      });

      describe('when we handle the isApproximatedLocation...', () => {
        describe('when the approximated location is defined', () => {
          it('should return true', () => {
            const itemDetail = service.mapItemDetailStore(MOCK_ITEM_DETAIL_RESPONSE_WITH_APROX_LOCATION);
            expect(itemDetail.isApproximatedLocation).toBe(true);
          });
        });

        describe('when the approximated location is NOT defined', () => {
          it('should return false', () => {
            const itemDetailWithoutLocation = service.mapItemDetailStore(MOCK_ITEM_DETAIL_RESPONSE_WITHOUT_LOCATION);
            expect(itemDetailWithoutLocation.isApproximatedLocation).toBe(false);
          });
        });
      });

      describe('when we handle the isItemACar...', () => {
        it('should be true if the service returns that type is car', () => {
          spyOn(typeCheckService, 'isCar').and.returnValue(true);
          const itemDetail = service.mapItemDetailStore(MOCK_ITEM_DETAIL_RESPONSE);

          expect(itemDetail.isItemACar).toBe(true);
        });
        it('should be false if the service returns that type is NOT a car', () => {
          spyOn(typeCheckService, 'isCar').and.returnValue(false);
          const itemDetail = service.mapItemDetailStore(MOCK_ITEM_DETAIL_RESPONSE);

          expect(itemDetail.isItemACar).toBe(false);
        });
      });

      describe('when we handle the isItemAPhone...', () => {
        it('should be true if the service returns that type is phone', () => {
          spyOn(typeCheckService, 'isCellPhoneAccessories').and.returnValue(true);
          const itemDetail = service.mapItemDetailStore(MOCK_ITEM_DETAIL_RESPONSE);

          expect(itemDetail.isItemAPhone).toBe(true);
        });
        it('should be false if the service returns that type is NOT a phone', () => {
          spyOn(typeCheckService, 'isCellPhoneAccessories').and.returnValue(false);
          const itemDetail = service.mapItemDetailStore(MOCK_ITEM_DETAIL_RESPONSE);

          expect(itemDetail.isItemAPhone).toBe(false);
        });

        describe('when we handle the isAFashionItem...', () => {
          it('should be true if the service returns that type is fashion', () => {
            spyOn(typeCheckService, 'isFashion').and.returnValue(true);
            const itemDetail = service.mapItemDetailStore(MOCK_ITEM_DETAIL_RESPONSE);

            expect(itemDetail.isAFashionItem).toBe(true);
          });
          it('should be false if the service returns that type is NOT an item fashion', () => {
            spyOn(typeCheckService, 'isFashion').and.returnValue(false);
            const itemDetail = service.mapItemDetailStore(MOCK_ITEM_DETAIL_RESPONSE);

            expect(itemDetail.isAFashionItem).toBe(false);
          });
        });

        describe('when we handle the socialShare...', () => {
          it('should return the formatted social share data', () => {
            const itemDetail = service.mapItemDetailStore(MOCK_ITEM_DETAIL_RESPONSE);
            const itemWebLink = `${MOCK_SITE_URL}${PUBLIC_PATHS.ITEM_DETAIL}/${MOCK_ITEM_DETAIL_RESPONSE?.item.webSlug}`;
            const itemTitle = MOCK_ITEM_DETAIL_RESPONSE?.item.title;
            const itemDescription = MOCK_ITEM_DETAIL_RESPONSE?.item.description;
            const emailcopy = $localize`:@@ItemDetailShareEmailText:This may interest you - ` + itemDescription;

            expect(itemDetail.socialShare).toStrictEqual({
              title: titleCopy,
              facebook: {
                url: itemWebLink,
              },
              twitter: {
                url: itemWebLink,
                text: twitterCopy,
              },
              email: {
                url: itemWebLink,
                subject: itemTitle,
                message: emailcopy,
              },
            });
          });
        });
      });
    });
  });
});
