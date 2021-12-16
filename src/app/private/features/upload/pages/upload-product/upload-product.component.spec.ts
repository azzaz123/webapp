import {
  MOCK_CONDITIONS,
  MOCK_OBJECT_TYPES,
  MOCK_OBJECT_TYPES_RESPONSE,
  MOCK_OBJECT_TYPES_WITH_CHILDREN,
} from '@fixtures/extra-info.fixtures.spec';
import {
  MOCK_ITEM_CELLPHONES,
  MOCK_ITEM_CELLPHONES_NO_SUBCATEGORY,
  MOCK_ITEM_RESPONSE_CONTENT,
  UPLOAD_FORM_ITEM_VALUES,
  ITEM_CATEGORY_ID,
  ITEM_DELIVERY_INFO,
  MOCK_ITEM,
  MOCK_ITEM_FASHION,
} from '@fixtures/item.fixtures.spec';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';

import { Component, Input, NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NgbModal, NgbPopoverConfig, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { UploadProductComponent } from './upload-product.component';
import { CategoryService } from '@core/category/category.service';
import {
  CATEGORIES_OPTIONS_CONSUMER_GOODS,
  CATEGORIES_DATA_CONSUMER_GOODS,
  SUGGESTED_CATEGORY_TV_AUDIO_CAMERAS,
  SUGGESTED_CATEGORY_COMPUTERS_ELECTRONICS,
} from '@fixtures/category.fixtures.spec';
import { PreviewModalComponent } from '../../modals/preview-modal/preview-modal.component';
import { ErrorsService } from '@core/errors/errors.service';
import { User } from '@core/user/user';
import { MOCK_USER, USER_ID } from '@fixtures/user.fixtures.spec';
import { UserLocation } from '@core/user/user-response.interface';
import { GeneralSuggestionsService } from '../../core/services/general-suggestions/general-suggestions.service';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { UserService } from '@core/user/user.service';
import { ItemContent } from '@core/item/item-response.interface';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DeviceDetectorServiceMock } from '@fixtures/remote-console.fixtures.spec';

import {
  ANALYTIC_EVENT_TYPES,
  ANALYTICS_EVENT_NAMES,
  SCREEN_IDS,
  AnalyticsEvent,
  EditItemCG,
  ListItemCG,
} from '@core/analytics/analytics-constants';
import { BrandModel } from '../../core/models/brand-model.interface';
import { CATEGORY_IDS } from '@core/category/category-ids';
import { CategoryOption, CategoryResponse } from '@core/category/category-response.interface';
import { I18nService } from '@core/i18n/i18n.service';
import { UploadService } from '../../core/services/upload/upload.service';
import {
  MockUploadService,
  MOCK_UPLOAD_ITEM_OUTPUT_DONE,
  MOCK_UPLOAD_OUTPUT_DONE,
  MOCK_UPLOAD_OUTPUT_PENDING,
  UPLOAD_FILE_2,
  UPLOAD_FILE_DONE,
  UPLOAD_FILE_DONE_2,
} from '@fixtures/upload.fixtures.spec';
import { ITEM_TYPES } from '@core/item/item';
import { UPLOAD_ACTION } from '@shared/uploader/upload.interface';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { MockSubscriptionService } from '@fixtures/subscriptions.fixtures.spec';
import { By } from '@angular/platform-browser';
import { ItemReactivationService } from '../../core/services/item-reactivation/item-reactivation.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ShippingToggleService } from './services/shipping-toggle/shipping-toggle.service';
import { FALLBACK_SHIPPING_RULES_RESPONSE } from '@api/bff/delivery/rules/constants/fallback-shipping-rules-response';
import { mapShippingRulesResponseToShippingRules } from '@api/bff/delivery/rules/mappers/shipping-rules-mapper';
import {
  MOCK_UPLOAD_PRODUCT_EDIT_ITEM_CG_SHIPPABLE_EVENT,
  MOCK_UPLOAD_PRODUCT_LIST_ITEM_CG_SHIPPABLE_EVENT,
} from '@fixtures/private/upload/events/upload-events.fixtures.spec';
import { UploadTrackingEventService } from './upload-tracking-event/upload-tracking-event.service';
import { CategoriesApiService } from '@api/categories/categories-api.service';
import { NgxPermissionsModule, NgxPermissionsService } from 'ngx-permissions';
import { PERMISSIONS } from '@core/user/user-constants';
export const MOCK_USER_NO_LOCATION: User = new User(USER_ID);

export const USER_LOCATION: UserLocation = {
  id: 101,
  approximated_latitude: 41.399132621722174,
  approximated_longitude: 2.17585484411869,
  city: 'Barcelona',
  zip: '08009',
  approxRadius: 0,
  title: '08009, Barcelona',
  full_address: 'Carrer Sant Pere Mes Baix, Barcelona',
};

MOCK_USER.location = USER_LOCATION;

describe('UploadProductComponent', () => {
  let component: UploadProductComponent;
  let fixture: ComponentFixture<UploadProductComponent>;
  let errorService: ErrorsService;
  let generalSuggestionsService: GeneralSuggestionsService;
  let router: Router;
  let modalService: NgbModal;
  let analyticsService: AnalyticsService;
  let deviceService: DeviceDetectorService;
  let userService: UserService;
  let categoryService: CategoryService;
  let categoriesApiService: CategoriesApiService;
  let uploadService: UploadService;
  let itemReactivationService: ItemReactivationService;
  let shippingToggleService: ShippingToggleService;
  let uploadTrackingEventService: UploadTrackingEventService;
  let permissionService: NgxPermissionsService;
  const componentInstance: any = {};

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [NgbPopoverModule, HttpClientTestingModule, NgxPermissionsModule.forRoot()],
        providers: [
          FormBuilder,
          NgbPopoverConfig,
          NgxPermissionsService,
          { provide: AnalyticsService, useClass: MockAnalyticsService },
          { provide: UploadService, useClass: MockUploadService },
          {
            provide: DeviceDetectorService,
            useClass: DeviceDetectorServiceMock,
          },
          {
            provide: ItemReactivationService,
            useValue: {
              reactivationValidation() {},
            },
          },
          {
            provide: UserService,
            useValue: {
              isProUser() {
                return false;
              },
              isPro: false,
            },
          },
          {
            provide: Router,
            useValue: {
              navigate() {},
            },
          },
          {
            provide: ErrorsService,
            useValue: {
              i18nSuccess() {},
              i18nError() {},
            },
          },
          {
            provide: CategoryService,
            useValue: {
              getCategories() {
                return of(CATEGORIES_DATA_CONSUMER_GOODS);
              },
              getSuggestedCategory() {
                return of(SUGGESTED_CATEGORY_TV_AUDIO_CAMERAS);
              },
            },
          },
          {
            provide: CategoriesApiService,
            useValue: {
              getUploadCategories() {
                return of(CATEGORIES_DATA_CONSUMER_GOODS);
              },
            },
          },
          {
            provide: NgbModal,
            useValue: {
              open() {
                return {
                  result: Promise.resolve(),
                  componentInstance: componentInstance,
                };
              },
            },
          },
          {
            provide: GeneralSuggestionsService,
            useValue: {
              getObjectTypes() {
                return of([]);
              },
              getBrands() {
                return of({});
              },
              getModels() {
                return of(['iPhone 2G', 'iPhone 3G', 'iPhone 4']);
              },
              getBrandsAndModels() {
                return of([
                  { brand: 'Apple', model: 'iPhone XSX' },
                  { brand: 'Samsung', model: 'Galaxy S20' },
                ]);
              },
              getSizes() {
                return of([
                  { value: '1', label: 'XXXS / 30 / 2' },
                  { value: '2', label: 'XXS / 32 / 4' },
                ]);
              },
              getConditions() {
                return of({ MOCK_CONDITIONS });
              },
            },
          },
          {
            provide: SubscriptionsService,
            useClass: MockSubscriptionService,
          },
          I18nService,
          {
            provide: ShippingToggleService,
            useValue: {
              isActive() {
                return of(false);
              },
              isAllowed() {
                return of({
                  category: true,
                  subcategory: true,
                  price: true,
                });
              },
              shippingRules: mapShippingRulesResponseToShippingRules(FALLBACK_SHIPPING_RULES_RESPONSE),
            },
          },
          {
            provide: UploadTrackingEventService,
            useValue: {
              trackClickHelpTransactionalEvent() {},
            },
          },
        ],
        declarations: [UploadProductComponent],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadProductComponent);
    component = fixture.componentInstance;
    errorService = TestBed.inject(ErrorsService);
    generalSuggestionsService = TestBed.inject(GeneralSuggestionsService);
    router = TestBed.inject(Router);
    modalService = TestBed.inject(NgbModal);
    analyticsService = TestBed.inject(AnalyticsService);
    deviceService = TestBed.inject(DeviceDetectorService);
    userService = TestBed.inject(UserService);
    categoryService = TestBed.inject(CategoryService);
    categoriesApiService = TestBed.inject(CategoriesApiService);
    uploadService = TestBed.inject(UploadService);
    itemReactivationService = TestBed.inject(ItemReactivationService);
    shippingToggleService = TestBed.inject(ShippingToggleService);
    uploadTrackingEventService = TestBed.inject(UploadTrackingEventService);
    permissionService = TestBed.inject(NgxPermissionsService);
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should set item if exists', () => {
      component.item = MOCK_ITEM;

      component.ngOnInit();

      expect(component.uploadForm.value).toEqual({
        id: MOCK_ITEM.id,
        title: MOCK_ITEM.title,
        sale_price: MOCK_ITEM.salePrice,
        currency_code: MOCK_ITEM.currencyCode,
        description: MOCK_ITEM.description,
        sale_conditions: MOCK_ITEM.saleConditions,
        category_id: ITEM_CATEGORY_ID + '',
        delivery_info: ITEM_DELIVERY_INFO,
        images: [],
        location: {
          address: '',
          latitude: '',
          longitude: '',
        },
        extra_info: {
          condition: null,
        },
        hashtags: [],
      });
    });

    it('should set item with second subcategory', () => {
      component.item = MOCK_ITEM_CELLPHONES;
      spyOn(generalSuggestionsService, 'getObjectTypes').and.returnValue(of(MOCK_OBJECT_TYPES_WITH_CHILDREN));
      const expectedUploadFormValue = {
        id: MOCK_ITEM_CELLPHONES.id,
        title: MOCK_ITEM_CELLPHONES.title,
        sale_price: MOCK_ITEM_CELLPHONES.salePrice,
        currency_code: MOCK_ITEM_CELLPHONES.currencyCode,
        description: MOCK_ITEM_CELLPHONES.description,
        sale_conditions: MOCK_ITEM_CELLPHONES.saleConditions,
        category_id: MOCK_ITEM_CELLPHONES.categoryId + '',
        delivery_info: ITEM_DELIVERY_INFO,
        images: [],
        location: {
          address: '',
          latitude: '',
          longitude: '',
        },
        extra_info: {
          condition: null,
          object_type: {
            id: MOCK_OBJECT_TYPES_WITH_CHILDREN[0].id,
          },
          brand: MOCK_ITEM_CELLPHONES.extraInfo.brand,
          model: MOCK_ITEM_CELLPHONES.extraInfo.model,
          object_type_2: {
            id: MOCK_OBJECT_TYPES_WITH_CHILDREN[0].children[0].id,
          },
        },
        hashtags: [],
      };

      component.ngOnInit();
      component.getObjectTypes();
      fixture.detectChanges();

      expect(component.uploadForm.value).toEqual(expectedUploadFormValue);
    });

    it('should not set second subcategory item if there are not category options', () => {
      component.item = MOCK_ITEM_CELLPHONES;
      spyOn(generalSuggestionsService, 'getObjectTypes').and.returnValue(of([]));
      const expectedUploadFormValue = {
        id: MOCK_ITEM_CELLPHONES.id,
        title: MOCK_ITEM_CELLPHONES.title,
        sale_price: MOCK_ITEM_CELLPHONES.salePrice,
        currency_code: MOCK_ITEM_CELLPHONES.currencyCode,
        description: MOCK_ITEM_CELLPHONES.description,
        sale_conditions: MOCK_ITEM_CELLPHONES.saleConditions,
        category_id: MOCK_ITEM_CELLPHONES.categoryId + '',
        delivery_info: ITEM_DELIVERY_INFO,
        images: [],
        location: {
          address: '',
          latitude: '',
          longitude: '',
        },
        extra_info: {
          condition: null,
          object_type: {
            id: MOCK_ITEM_CELLPHONES.extraInfo.object_type.id,
          },
          brand: MOCK_ITEM_CELLPHONES.extraInfo.brand,
          model: MOCK_ITEM_CELLPHONES.extraInfo.model,
        },
        hashtags: [],
      };

      component.ngOnInit();
      component.getObjectTypes();
      fixture.detectChanges();

      expect(component.uploadForm.value).toEqual(expectedUploadFormValue);
    });

    it('should not set subcategory field if item do not have subcategory', () => {
      component.item = MOCK_ITEM_CELLPHONES_NO_SUBCATEGORY;
      spyOn(generalSuggestionsService, 'getObjectTypes').and.returnValue(of(MOCK_OBJECT_TYPES_WITH_CHILDREN));
      const expectedUploadFormValue = {
        id: MOCK_ITEM_CELLPHONES.id,
        title: MOCK_ITEM_CELLPHONES.title,
        sale_price: MOCK_ITEM_CELLPHONES.salePrice,
        currency_code: MOCK_ITEM_CELLPHONES.currencyCode,
        description: MOCK_ITEM_CELLPHONES.description,
        sale_conditions: MOCK_ITEM_CELLPHONES.saleConditions,
        category_id: MOCK_ITEM_CELLPHONES.categoryId + '',
        delivery_info: ITEM_DELIVERY_INFO,
        images: [],
        location: {
          address: '',
          latitude: '',
          longitude: '',
        },
        extra_info: {
          object_type: {
            id: null,
          },
          condition: null,
          brand: MOCK_ITEM_CELLPHONES.extraInfo.brand,
          model: MOCK_ITEM_CELLPHONES.extraInfo.model,
        },
        hashtags: [],
      };

      component.ngOnInit();
      component.getObjectTypes();
      fixture.detectChanges();

      expect(component.uploadForm.value).toEqual(expectedUploadFormValue);
    });

    it('should get and set categories', () => {
      component.ngOnInit();

      expect(component.categories).toEqual(CATEGORIES_OPTIONS_CONSUMER_GOODS);
    });

    describe('when the item has extra fields', () => {
      describe('if it`s a fashion item', () => {
        it('should patch the fashion extra fields values', () => {
          component.item = MOCK_ITEM_FASHION;

          component.ngOnInit();

          expect(component.uploadForm.value).toEqual({
            id: MOCK_ITEM_FASHION.id,
            title: MOCK_ITEM_FASHION.title,
            sale_price: MOCK_ITEM_FASHION.salePrice,
            currency_code: MOCK_ITEM_FASHION.currencyCode,
            description: MOCK_ITEM_FASHION.description,
            sale_conditions: MOCK_ITEM_FASHION.saleConditions,
            category_id: String(CATEGORY_IDS.FASHION_ACCESSORIES),
            delivery_info: MOCK_ITEM_FASHION.deliveryInfo,
            images: [],
            location: {
              address: '',
              latitude: '',
              longitude: '',
            },
            extra_info: {
              object_type: {
                id: MOCK_ITEM_FASHION.extraInfo.object_type.id,
              },
              brand: MOCK_ITEM_FASHION.extraInfo.brand,
              size: {
                id: MOCK_ITEM_FASHION.extraInfo.size.id,
              },
              gender: MOCK_ITEM_FASHION.extraInfo.gender,
              condition: null,
            },
            hashtags: [],
          });
        });

        it('should get object types for the selected category', () => {
          spyOn(component, 'getObjectTypes');
          component.item = MOCK_ITEM_FASHION;

          component.ngOnInit();

          expect(component.getObjectTypes).toHaveBeenCalled();
        });

        it('should get sizes types for the selected object type', () => {
          spyOn(component, 'getSizes');
          component.item = MOCK_ITEM_FASHION;

          component.ngOnInit();

          expect(component.getSizes).toHaveBeenCalled();
        });
      });

      describe('if it`s a cellphones item', () => {
        it('should patch cellphones extra fields values into the form', () => {
          component.item = MOCK_ITEM_CELLPHONES;

          component.ngOnInit();

          expect(component.uploadForm.value).toEqual({
            id: MOCK_ITEM_CELLPHONES.id,
            title: MOCK_ITEM_CELLPHONES.title,
            sale_price: MOCK_ITEM_CELLPHONES.salePrice,
            currency_code: MOCK_ITEM_CELLPHONES.currencyCode,
            description: MOCK_ITEM_CELLPHONES.description,
            sale_conditions: MOCK_ITEM_CELLPHONES.saleConditions,
            category_id: String(MOCK_ITEM_CELLPHONES.categoryId),
            delivery_info: MOCK_ITEM_CELLPHONES.deliveryInfo,
            images: [],
            location: {
              address: '',
              latitude: '',
              longitude: '',
            },
            extra_info: {
              object_type: {
                id: MOCK_ITEM_CELLPHONES.extraInfo.object_type.id,
              },
              brand: MOCK_ITEM_CELLPHONES.extraInfo.brand,
              model: MOCK_ITEM_CELLPHONES.extraInfo.model,
              condition: null,
            },
            hashtags: [],
          });
        });
      });
    });

    it('should get object types for the selected category', () => {
      spyOn(component, 'getObjectTypes');
      component.item = MOCK_ITEM_CELLPHONES;

      component.ngOnInit();

      expect(component.getObjectTypes).toHaveBeenCalled();
    });

    afterAll(() => {
      component.item = MOCK_ITEM;
    });
  });

  describe('when changing between categories', () => {
    describe('if the selected category is cellphones', () => {
      beforeEach(() => {
        component.uploadForm.patchValue({
          category_id: CATEGORY_IDS.CELL_PHONES_ACCESSORIES,
        });
      });

      it('should enable the object_type field', () => {
        expect(component.uploadForm.get('extra_info').get('object_type').disabled).toBe(false);
      });
      it('should require the object_type field', () => {
        expect(component.uploadForm.get('extra_info').get('object_type').get('id').errors).toEqual({ required: true });
      });
      it('should enable the brand field', () => {
        expect(component.uploadForm.get('extra_info').get('brand').disabled).toBe(false);
      });
      it('should enable the model field', () => {
        expect(component.uploadForm.get('extra_info').get('model').disabled).toBe(false);
      });
      it('should disable the size field', () => {
        expect(component.uploadForm.get('extra_info').get('size').disabled).toBe(true);
      });
      it('should disable the gender field', () => {
        expect(component.uploadForm.get('extra_info').get('gender').disabled).toBe(true);
      });

      describe('and object_type_2 is enabled', () => {
        beforeEach(() => {
          component.uploadForm.get('extra_info').get('object_type_2').enable();
        });

        it('should require the object_type_2 field', () => {
          expect(component.uploadForm.get('extra_info').get('object_type_2').get('id').errors).toEqual({ required: true });
        });
      });
    });
    describe('if the selected category is fashion', () => {
      beforeEach(() => {
        component.uploadForm.patchValue({
          category_id: CATEGORY_IDS.FASHION_ACCESSORIES,
        });
      });

      it('should enable the object_type field', () => {
        expect(component.uploadForm.get('extra_info').get('object_type').disabled).toBe(false);
      });
      it('should require the object_type field', () => {
        expect(component.uploadForm.get('extra_info').get('object_type').get('id').errors).toEqual({ required: true });
      });
      it('should enable the brand field', () => {
        expect(component.uploadForm.get('extra_info').get('brand').disabled).toBe(false);
      });
      it('should enable the gender field', () => {
        expect(component.uploadForm.get('extra_info').get('gender').disabled).toBe(false);
      });
      it('should disable the model field', () => {
        expect(component.uploadForm.get('extra_info').get('model').disabled).toBe(true);
      });
      it('should enable the size field', () => {
        component.uploadForm.patchValue({
          extra_info: {
            object_type: { id: 1 },
            gender: 'M',
          },
        });

        fixture.detectChanges();

        expect(component.uploadForm.get('extra_info').get('size').disabled).toBe(false);
      });
      it('should disable the size field', () => {
        component.uploadForm.patchValue({
          extra_info: {
            object_type: { id: null },
          },
        });
        component.uploadForm.patchValue({
          category_id: CATEGORY_IDS.FASHION_ACCESSORIES,
        });
        fixture.detectChanges();
        expect(component.uploadForm.get('extra_info').get('size').disabled).toBe(true);
      });

      describe('and object_type_2 is enabled', () => {
        beforeEach(() => {
          component.uploadForm.get('extra_info').get('object_type_2').enable();
        });

        it('should require the object_type_2 field', () => {
          expect(component.uploadForm.get('extra_info').get('object_type_2').get('id').errors).toEqual({ required: true });
        });
      });
    });

    describe('if the selected category is a consumer goods category', () => {
      beforeEach(() => {
        component.uploadForm.patchValue({ category_id: CATEGORY_IDS.SERVICES });
      });

      it('should disable the object_type field', () => {
        expect(component.uploadForm.get('extra_info').get('object_type').disabled).toBe(true);
      });
      it('should not require the object_type field', () => {
        expect(component.uploadForm.get('extra_info').get('object_type').get('id').errors).toBeNull;
      });
      it('should disable the brand field', () => {
        expect(component.uploadForm.get('extra_info').get('brand').disabled).toBe(true);
      });
      it('should disable the size field', () => {
        expect(component.uploadForm.get('extra_info').get('size').disabled).toBe(true);
      });
      it('should disable the gender field', () => {
        expect(component.uploadForm.get('extra_info').get('gender').disabled).toBe(true);
      });
      it('should disable the model field', () => {
        expect(component.uploadForm.get('extra_info').get('model').disabled).toBe(true);
      });

      describe('and object_type_2 is enabled', () => {
        beforeEach(() => {
          component.uploadForm.get('extra_info').get('object_type_2').enable();
        });

        it('should require the object_type_2 field', () => {
          expect(component.uploadForm.get('extra_info').get('object_type_2').get('id').errors).toBeNull();
        });
      });
    });
  });

  describe('detectFormChanges', () => {
    let formChanged: boolean;

    beforeEach(() => {
      component.item = MOCK_ITEM;
      component.formChanged.subscribe((value: boolean) => {
        formChanged = value;
      });

      component.ngOnInit();
    });

    it('should emit changed event if form values changes', () => {
      component.uploadForm.get('title').patchValue('new title');
      component.ngOnInit();
      fixture.detectChanges();

      expect(formChanged).toBeTruthy();
    });
  });

  describe('ngAfterContentInit', () => {
    beforeEach(() => {
      component['focused'] = false;
      component.titleField = {
        nativeElement: {
          focus() {},
        },
      };
      spyOn(component.titleField.nativeElement, 'focus');
    });

    it('should set focus', fakeAsync(() => {
      component.ngAfterContentInit();

      expect(component.titleField.nativeElement.focus).toHaveBeenCalled();
      expect(component['focused']).toBe(true);
    }));

    it('should NOT set focus if edit mode', fakeAsync(() => {
      component.item = MOCK_ITEM;
      component.ngAfterContentInit();

      expect(component.titleField.nativeElement.focus).not.toHaveBeenCalled();
      expect(component['focused']).toBe(false);
    }));

    it('should NOT set focus if it`s a mobile device', fakeAsync(() => {
      spyOn(deviceService, 'isMobile').and.returnValue(true);

      component.ngAfterContentInit();

      expect(component.titleField.nativeElement.focus).not.toHaveBeenCalled();
      expect(component['focused']).toBe(false);
    }));
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      spyOn(shippingToggleService, 'isAllowed').and.returnValue(
        of({
          category: false,
          subcategory: false,
          price: false,
        })
      );
    });

    it('should emit uploadEvent if form is valid', () => {
      spyOn(uploadService, 'createItem').and.callThrough();
      component.uploadForm.get('category_id').patchValue(CATEGORY_IDS.SERVICES);
      component.uploadForm.get('title').patchValue('test');
      component.uploadForm.get('description').patchValue('test');
      component.uploadForm.get('sale_price').patchValue(1000000);
      component.uploadForm.get('currency_code').patchValue('EUR');
      component.uploadForm.get('images').patchValue([{ image: true }]);
      component.uploadForm.get('location').patchValue({
        address: USER_LOCATION.full_address,
        latitude: USER_LOCATION.approximated_latitude,
        longitude: USER_LOCATION.approximated_longitude,
      });

      fixture.detectChanges();
      component.onSubmit();

      expect(uploadService.createItem).toHaveBeenCalledWith(component.uploadForm.value, ITEM_TYPES.CONSUMER_GOODS);
      expect(component.uploadForm.valid).toBe(true);
      expect(component.loading).toBe(true);
    });

    it('should set form as pending', () => {
      component.onSubmit();

      expect(component.uploadForm.pending).toBe(true);
    });

    it('should show image error', () => {
      spyOn(errorService, 'i18nError');

      component.onSubmit();

      expect(errorService.i18nError).toHaveBeenCalledWith(TRANSLATION_KEY.MISSING_IMAGE_ERROR);
    });

    describe('and supports shipping', () => {
      function fillValidForm() {
        component.uploadForm.patchValue({
          category_id: CATEGORY_IDS.SERVICES,
          title: 'title',
          description: 'title',
          sale_price: 1000000,
          currency_code: 'EUR',
          images: [{ image: true }],
          location: {
            address: USER_LOCATION.full_address,
            latitude: USER_LOCATION.approximated_latitude,
            longitude: USER_LOCATION.approximated_longitude,
          },
        });
      }
      beforeEach(() => {
        component.ngOnInit();
      });

      it('should show weight error', () => {
        spyOn(errorService, 'i18nError');

        fillValidForm();
        component.uploadForm.patchValue({
          sale_conditions: {
            supports_shipping: true,
          },
          delivery_info: null,
        });

        component.onSubmit();

        expect(errorService.i18nError).toHaveBeenCalledWith(TRANSLATION_KEY.FINDING_MISSING_WEIGHT_ERROR);
      });
    });

    it('should not accept sale_price < 0', () => {
      component.uploadForm.get('sale_price').patchValue(-1);

      expect(component.uploadForm.valid).toBeFalsy();
    });

    it('should not accept sale_price > 999999999', () => {
      component.uploadForm.get('sale_price').patchValue(9999999999);

      expect(component.uploadForm.valid).toBeFalsy();
    });

    it('should save the second level category', () => {
      spyOn(uploadService, 'createItem').and.callThrough();
      component.uploadForm.patchValue({
        category_id: CATEGORY_IDS.SERVICES,
        title: 'test',
        description: 'test',
        sale_price: 1000000,
        currency_code: 'EUR',
        images: [{ image: true }],
        location: {
          address: USER_LOCATION.full_address,
          latitude: USER_LOCATION.approximated_latitude,
          longitude: USER_LOCATION.approximated_longitude,
        },
        extra_info: {
          object_type: { id: 1 },
        },
      });
      component.uploadForm.get('extra_info').get('object_type').enable();
      component.uploadForm.get('extra_info').get('object_type_2').enable();
      component.uploadForm.patchValue({
        extra_info: {
          object_type_2: { id: 2 },
        },
      });

      const expected = {
        category_id: CATEGORY_IDS.SERVICES,
        currency_code: 'EUR',
        delivery_info: null,
        description: 'test',
        extra_info: {
          condition: null,
          object_type: { id: 2 },
        },
        id: '',
        images: [{ image: true }],
        location: {
          address: 'Carrer Sant Pere Mes Baix, Barcelona',
          latitude: 41.399132621722174,
          longitude: 2.17585484411869,
        },
        sale_conditions: { ...MOCK_ITEM_FASHION.saleConditions, supports_shipping: false },
        sale_price: 1000000,
        title: 'test',
        hashtags: '',
      };

      component.onSubmit();
      fixture.detectChanges();

      expect(uploadService.createItem).toHaveBeenCalledWith(expected, ITEM_TYPES.CONSUMER_GOODS);
    });

    it('should save the first level category', () => {
      spyOn(uploadService, 'createItem').and.callThrough();
      component.uploadForm.patchValue({
        category_id: CATEGORY_IDS.SERVICES,
        title: 'test',
        description: 'test',
        sale_price: 1000000,
        currency_code: 'EUR',
        images: [{ image: true }],
        location: {
          address: USER_LOCATION.full_address,
          latitude: USER_LOCATION.approximated_latitude,
          longitude: USER_LOCATION.approximated_longitude,
        },
        extra_info: {
          object_type: { id: 1 },
        },
        hashtags: '',
      });
      component.uploadForm.get('extra_info').get('object_type').enable();

      fixture.detectChanges();

      const expected = {
        category_id: CATEGORY_IDS.SERVICES,
        currency_code: 'EUR',
        delivery_info: null,
        description: 'test',
        extra_info: {
          condition: null,
          object_type: { id: 1 },
        },
        id: '',
        images: [{ image: true }],
        location: {
          address: 'Carrer Sant Pere Mes Baix, Barcelona',
          latitude: 41.399132621722174,
          longitude: 2.17585484411869,
        },
        sale_conditions: { ...MOCK_ITEM_FASHION.saleConditions, supports_shipping: false },
        sale_price: 1000000,
        title: 'test',
        hashtags: '',
      };

      component.onSubmit();
      fixture.detectChanges();

      expect(uploadService.createItem).toHaveBeenCalledWith(expected, ITEM_TYPES.CONSUMER_GOODS);
    });

    describe('and when there is not an item uploaded', () => {
      beforeEach(() => {
        component.item = null;
        component.uploadForm.patchValue(UPLOAD_FORM_ITEM_VALUES);
      });

      it('should upload the item if the service return done', () => {
        spyOn(uploadService, 'createItem').and.returnValue(of(MOCK_UPLOAD_ITEM_OUTPUT_DONE));
        spyOn(component, 'onUploaded');

        fixture.detectChanges();
        component.onSubmit();

        expect(uploadService.createItem).toHaveBeenCalledTimes(1);
        expect(uploadService.createItem).toHaveBeenCalledWith(component.uploadForm.value, ITEM_TYPES.CONSUMER_GOODS);
        expect(component.onUploaded).toHaveBeenCalledTimes(1);
        expect(component.onUploaded).toHaveBeenCalledWith(MOCK_UPLOAD_ITEM_OUTPUT_DONE.file.response.content, UPLOAD_ACTION.created);
      });

      it('should do nothing if the service not return done', () => {
        spyOn(uploadService, 'createItem').and.returnValue(of(MOCK_UPLOAD_OUTPUT_PENDING));
        spyOn(component, 'onUploaded');

        fixture.detectChanges();
        component.onSubmit();

        expect(uploadService.createItem).toHaveBeenCalledTimes(1);
        expect(component.onUploaded).toHaveBeenCalledTimes(0);
      });

      it('should show error if the service fails', () => {
        spyOn(uploadService, 'createItem').and.returnValue(throwError({ message: 'error' }));
        spyOn(component, 'onUploaded');
        spyOn(errorService, 'i18nError');

        fixture.detectChanges();
        component.onSubmit();

        expect(uploadService.createItem).toHaveBeenCalledTimes(1);
        expect(component.onUploaded).not.toHaveBeenCalled();
        expect(errorService.i18nError).toHaveBeenCalledTimes(1);
        expect(errorService.i18nError).toHaveBeenCalledWith(TRANSLATION_KEY.SERVER_ERROR, 'error');
      });
    });

    describe('and when there is an item uploaded', () => {
      beforeEach(() => {
        component.item = MOCK_ITEM;
        component.uploadForm.patchValue(UPLOAD_FORM_ITEM_VALUES);
      });

      it('should upload the item if the service success', () => {
        spyOn(uploadService, 'updateItem').and.returnValue(of({ content: MOCK_ITEM_RESPONSE_CONTENT }));
        spyOn(component, 'onUploaded');
        fixture.detectChanges();
        component.onSubmit();

        expect(uploadService.updateItem).toHaveBeenCalledTimes(1);
        expect(uploadService.updateItem).toHaveBeenCalledWith(component.uploadForm.value, ITEM_TYPES.CONSUMER_GOODS);
        expect(component.onUploaded).toHaveBeenCalledTimes(1);
        expect(component.onUploaded).toHaveBeenCalledWith(MOCK_ITEM_RESPONSE_CONTENT, UPLOAD_ACTION.updated);
      });

      it('should show error if the service fails', () => {
        spyOn(uploadService, 'updateItem').and.returnValue(throwError({ message: 'error' }));
        spyOn(component, 'onUploaded');
        spyOn(errorService, 'i18nError');

        fixture.detectChanges();
        component.onSubmit();

        expect(uploadService.updateItem).toHaveBeenCalledTimes(1);
        expect(component.onUploaded).not.toHaveBeenCalled();
        expect(errorService.i18nError).toHaveBeenCalledTimes(1);
        expect(errorService.i18nError).toHaveBeenCalledWith(TRANSLATION_KEY.SERVER_ERROR, 'error');
      });
    });
  });

  describe('when selecting a category', () => {
    it('should get the object types for the selected category', () => {
      component.uploadForm.patchValue({
        category_id: CATEGORY_IDS.CELL_PHONES_ACCESSORIES,
      });
      spyOn(generalSuggestionsService, 'getObjectTypes').and.callThrough();

      component.getObjectTypes();

      expect(generalSuggestionsService.getObjectTypes).toHaveBeenCalledWith(CATEGORY_IDS.CELL_PHONES_ACCESSORIES);
    });

    it('should get dropdown options', () => {
      spyOn(generalSuggestionsService, 'getObjectTypes').and.returnValue(of(MOCK_OBJECT_TYPES));

      component.getObjectTypes();
      fixture.detectChanges();

      expect(component.objectTypes).toEqual(MOCK_OBJECT_TYPES);
      expect(component.objectTypesOptions).toEqual(MOCK_OBJECT_TYPES_RESPONSE);
    });

    it('should update form', () => {
      spyOn(component, 'getExtraInfo').and.returnValue({});
      spyOn(generalSuggestionsService, 'getObjectTypes').and.returnValue(of(MOCK_OBJECT_TYPES));
      component.item = MOCK_ITEM;
      component.uploadForm.patchValue({
        category_id: CATEGORY_IDS.CELL_PHONES_ACCESSORIES,
        extra_info: {
          object_type: {
            id: '365',
          },
        },
      });

      component.getObjectTypes();
      fixture.detectChanges();

      expect(component.getExtraInfo).toHaveBeenCalled();
    });

    it('should not update form', () => {
      spyOn(component, 'getExtraInfo').and.returnValue({});
      spyOn(generalSuggestionsService, 'getObjectTypes').and.returnValue(of(MOCK_OBJECT_TYPES));
      component.uploadForm.patchValue({
        category_id: CATEGORY_IDS.CELL_PHONES_ACCESSORIES,
      });

      component.getObjectTypes();
      fixture.detectChanges();

      expect(component.getExtraInfo).not.toHaveBeenCalled();
    });
  });

  describe('when selecting a subcategory', () => {
    it('should get options for the selected subcategory with second level subcategories', () => {
      component.objectTypes = MOCK_OBJECT_TYPES_WITH_CHILDREN;
      const selectedId = 3;

      component.getSecondObjectTypes(selectedId);

      expect(component.objectTypesOptions2).toEqual(MOCK_OBJECT_TYPES_RESPONSE);
      expect(component.uploadForm.get('extra_info').get('object_type_2').disabled).toBe(false);
    });

    it('should not get options for the selected subcategory without second level subcategories', () => {
      component.objectTypes = MOCK_OBJECT_TYPES_WITH_CHILDREN;
      const selectedId = 4;

      component.getSecondObjectTypes(selectedId);

      expect(component.objectTypesOptions2).toEqual([]);
      expect(component.uploadForm.get('extra_info').get('object_type_2').disabled).toBe(true);
    });
  });

  describe('getBrands', () => {
    beforeEach(() => {
      component.uploadForm.patchValue({
        category_id: CATEGORY_IDS.CELL_PHONES_ACCESSORIES,
        extra_info: {
          object_type: {
            id: '365',
          },
        },
      });
    });

    it('should get the brands for the provided keyword', () => {
      spyOn(generalSuggestionsService, 'getBrands').and.callThrough();

      component.getBrands('Apple');

      expect(generalSuggestionsService.getBrands).toHaveBeenCalledWith('Apple', CATEGORY_IDS.CELL_PHONES_ACCESSORIES, '365');
    });

    it('should get brands and models if the brand endpoint doesn`t return any result', () => {
      spyOn(generalSuggestionsService, 'getBrandsAndModels').and.callThrough();
      spyOn(generalSuggestionsService, 'getBrands').and.returnValue(of([]));

      component.getBrands('iPhone');

      expect(generalSuggestionsService.getBrandsAndModels).toHaveBeenCalledWith('iPhone', CATEGORY_IDS.CELL_PHONES_ACCESSORIES, '365');
    });
  });

  describe('getModels', () => {
    it('should get the models for the provided keyword and the selected brand', () => {
      component.uploadForm.patchValue({
        category_id: CATEGORY_IDS.CELL_PHONES_ACCESSORIES,
        extra_info: {
          object_type: {
            id: '365',
          },
          brand: 'Apple',
        },
      });
      spyOn(generalSuggestionsService, 'getModels').and.callThrough();

      component.getModels('iPhone');

      expect(generalSuggestionsService.getModels).toHaveBeenCalledWith('iPhone', CATEGORY_IDS.CELL_PHONES_ACCESSORIES, 'Apple', '365');
    });
  });

  describe('getSizes', () => {
    describe('and has object_type', () => {
      it('should get the sizes for the current object type and gender', () => {
        const objectTypeId = 365;
        const gender = 'male';
        component.uploadForm.get('extra_info').patchValue({
          object_type: {
            id: objectTypeId,
          },
          gender: gender,
        });
        spyOn(generalSuggestionsService, 'getSizes').and.callThrough();

        component.getSizes();

        expect(generalSuggestionsService.getSizes).toHaveBeenCalledWith(objectTypeId, gender);
      });
    });

    describe('and object_type has children', () => {
      it('should get the sizes for the current object type 2 and gender', () => {
        const objectTypeId = 465;
        const objectType2Id = 365;
        const gender = 'female';
        component.objectTypes = [
          {
            id: objectTypeId.toString(),
            name: '',
            hierarchy: [],
            has_children: true,
          },
        ];
        component.uploadForm.get('extra_info').patchValue({
          object_type: {
            id: objectTypeId,
          },
          object_type_2: {
            id: objectType2Id,
          },
          gender: gender,
        });
        spyOn(generalSuggestionsService, 'getSizes').and.callThrough();

        component.getSizes();

        expect(generalSuggestionsService.getSizes).toHaveBeenCalledWith(objectType2Id, gender);
      });
    });

    describe('and has NOT gender', () => {
      it('should NOT get the sizes', () => {
        spyOn(generalSuggestionsService, 'getSizes').and.callThrough();

        component.getSizes();

        expect(generalSuggestionsService.getSizes).not.toHaveBeenCalled();
      });
    });
  });

  describe('onUploaded', () => {
    const action = UPLOAD_ACTION.updated;
    const response = MOCK_ITEM_RESPONSE_CONTENT;

    it('should emit form changed event', () => {
      let formChanged = true;
      component.formChanged.subscribe((value: boolean) => {
        formChanged = value;
      });

      component.onUploaded(response, action);

      expect(formChanged).toBeFalsy();
    });

    it('should redirect', () => {
      spyOn(router, 'navigate');

      component.onUploaded(response, action);

      expect(router.navigate).toHaveBeenCalledWith(['/catalog/list', { [action]: true, itemId: response.id }]);
    });

    describe('if it`s a item modification', () => {
      it('should send the Edit Item CG tracking event', () => {
        component.item = MOCK_ITEM;
        const action = UPLOAD_ACTION.updated;
        const editResponse: ItemContent = MOCK_ITEM_RESPONSE_CONTENT;
        const expectedEvent: AnalyticsEvent<EditItemCG> = {
          name: ANALYTICS_EVENT_NAMES.EditItemCG,
          eventType: ANALYTIC_EVENT_TYPES.Other,
          attributes: {
            itemId: editResponse.id,
            categoryId: editResponse.category_id,
            salePrice: editResponse.sale_price,
            title: editResponse.title,
            isPro: false,
            screenId: SCREEN_IDS.EditItem,
            shippingAllowed: false,
            salePriceChange: null,
          },
        };
        spyOn(analyticsService, 'trackEvent');

        component.ngOnInit();
        component.onUploaded(editResponse, action);

        expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
      });

      describe('and shipping flag is active', () => {
        describe('and item is shippable', () => {
          it('should send the Edit Item CG tracking event', () => {
            component.item = MOCK_ITEM;
            const action = UPLOAD_ACTION.updated;
            const editResponse: ItemContent = MOCK_ITEM_RESPONSE_CONTENT;
            const weight = 10;
            editResponse.sale_conditions = {
              supports_shipping: true,
              fix_price: true,
              exchange_allowed: false,
            };
            editResponse.delivery_info = {
              min_weight_kg: weight,
              max_weight_kg: weight,
            };

            const expectedEvent = MOCK_UPLOAD_PRODUCT_EDIT_ITEM_CG_SHIPPABLE_EVENT(editResponse, true, weight);

            spyOn(analyticsService, 'trackEvent');

            component.ngOnInit();
            component.onUploaded(editResponse, action);

            expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
          });
        });

        describe('and item is NOT shippable', () => {
          it('should send the Edit Item CG tracking event', () => {
            component.item = MOCK_ITEM;
            const action = UPLOAD_ACTION.updated;
            const editResponse: ItemContent = MOCK_ITEM_RESPONSE_CONTENT;
            editResponse.sale_conditions = {
              supports_shipping: false,
              fix_price: true,
              exchange_allowed: false,
            };
            editResponse.delivery_info = null;

            const expectedEvent = MOCK_UPLOAD_PRODUCT_EDIT_ITEM_CG_SHIPPABLE_EVENT(editResponse, false);

            spyOn(analyticsService, 'trackEvent');

            component.ngOnInit();
            component.onUploaded(editResponse, action);

            expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
          });
        });
      });
    });

    describe('if it`s a item upload', () => {
      it('should send the List Item CG tracking event', () => {
        const action = UPLOAD_ACTION.created;
        const uploadResponse: ItemContent = MOCK_ITEM_RESPONSE_CONTENT;
        const expectedEvent: AnalyticsEvent<ListItemCG> = {
          name: ANALYTICS_EVENT_NAMES.ListItemCG,
          eventType: ANALYTIC_EVENT_TYPES.Other,
          attributes: {
            itemId: uploadResponse.id,
            categoryId: uploadResponse.category_id,
            salePrice: uploadResponse.sale_price,
            title: uploadResponse.title,
            isPro: false,
            screenId: SCREEN_IDS.Upload,
            country: analyticsService.market,
            language: analyticsService.appLocale,
            shippingAllowed: false,
          },
        };
        spyOn(analyticsService, 'trackEvent');

        component.ngOnInit();
        component.onUploaded(uploadResponse, action);

        expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
      });

      describe('and shipping flag is active', () => {
        describe('and item is shippable', () => {
          it('should send the List Item CG tracking event', () => {
            const action = UPLOAD_ACTION.created;
            const uploadResponse: ItemContent = MOCK_ITEM_RESPONSE_CONTENT;
            const weight = 10;
            uploadResponse.sale_conditions = {
              supports_shipping: true,
              fix_price: true,
              exchange_allowed: false,
            };
            uploadResponse.delivery_info = {
              min_weight_kg: weight,
              max_weight_kg: weight,
            };

            const expectedEvent = MOCK_UPLOAD_PRODUCT_LIST_ITEM_CG_SHIPPABLE_EVENT(uploadResponse, true, weight);

            spyOn(analyticsService, 'trackEvent');

            component.ngOnInit();
            component.onUploaded(uploadResponse, action);

            expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
          });
        });

        describe('and item is NOT shippable', () => {
          it('should send the List Item CG tracking event', () => {
            const action = UPLOAD_ACTION.created;
            const uploadResponse: ItemContent = MOCK_ITEM_RESPONSE_CONTENT;
            uploadResponse.sale_conditions = {
              supports_shipping: false,
              fix_price: true,
              exchange_allowed: false,
            };
            uploadResponse.delivery_info = null;

            const expectedEvent = MOCK_UPLOAD_PRODUCT_LIST_ITEM_CG_SHIPPABLE_EVENT(uploadResponse, false);

            spyOn(analyticsService, 'trackEvent');

            component.ngOnInit();
            component.onUploaded(uploadResponse, action);

            expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
          });
        });
      });
    });
  });

  describe('onError', () => {
    it('should set loading to false', () => {
      component.loading = true;

      component.onError('response');

      expect(component.loading).toBeFalsy();
    });
    it('should show toast with default message', () => {
      spyOn(errorService, 'i18nError').and.callThrough();

      component.onError('error');

      expect(errorService.i18nError).toHaveBeenCalledTimes(1);
      expect(errorService.i18nError).toHaveBeenCalledWith(TRANSLATION_KEY.SERVER_ERROR, '');
    });

    it('should show toast with custom message', () => {
      spyOn(errorService, 'i18nError').and.callThrough();

      component.onError({ message: 'error' });

      expect(errorService.i18nError).toHaveBeenCalledTimes(1);
      expect(errorService.i18nError).toHaveBeenCalledWith(TRANSLATION_KEY.SERVER_ERROR, 'error');
    });
  });

  describe('onDeliveryChange', () => {
    it('should reset selected delivery value if clicked twice', () => {
      spyOn(component.uploadForm.controls['delivery_info'], 'reset');

      component.onDeliveryChange(ITEM_DELIVERY_INFO);
      component.onDeliveryChange(ITEM_DELIVERY_INFO);

      expect(component['oldDeliveryValue']).toBeUndefined();
      expect(component.uploadForm.controls['delivery_info'].reset).toHaveBeenCalled();
    });
  });

  describe('when categories ', () => {
    it('should reset selected delivery value if clicked twice', () => {
      spyOn(component.uploadForm.controls['delivery_info'], 'reset');

      component.onDeliveryChange(ITEM_DELIVERY_INFO);
      component.onDeliveryChange(ITEM_DELIVERY_INFO);

      expect(component['oldDeliveryValue']).toBeUndefined();
      expect(component.uploadForm.controls['delivery_info'].reset).toHaveBeenCalled();
    });
  });

  describe('preview', () => {
    beforeEach(fakeAsync(() => {
      spyOn(modalService, 'open').and.callThrough();
      spyOn(component, 'onSubmit');
      fixture.detectChanges();
      component.uploadForm.get('category_id').patchValue(CATEGORY_IDS.SERVICES);
      component.uploadForm.get('title').patchValue('test');
      component.uploadForm.get('description').patchValue('test');
      component.uploadForm.get('sale_price').patchValue(1000000);
      component.uploadForm.get('currency_code').patchValue('EUR');
      component.uploadForm.get('images').patchValue([{ image: true }]);
      component.uploadForm.get('location').patchValue({
        address: USER_LOCATION.full_address,
        latitude: USER_LOCATION.approximated_latitude,
        longitude: USER_LOCATION.approximated_longitude,
      });
      component.preview();

      tick();
    }));

    it('should open modal', () => {
      expect(modalService.open).toHaveBeenCalledWith(PreviewModalComponent, {
        windowClass: 'preview',
      });
    });

    it('should set itemPreview', () => {
      expect(componentInstance.itemPreview).toEqual({
        id: '',
        category_id: CATEGORY_IDS.SERVICES,
        title: 'test',
        description: 'test',
        sale_price: 1000000,
        currency_code: 'EUR',
        images: [{ image: true }],
        sale_conditions: { ...MOCK_ITEM.saleConditions, supports_shipping: true },
        delivery_info: null,
        location: {
          address: USER_LOCATION.full_address,
          latitude: USER_LOCATION.approximated_latitude,
          longitude: USER_LOCATION.approximated_longitude,
        },
        extra_info: {
          condition: null,
        },
        hashtags: '',
      });
    });

    it('should submit form', fakeAsync(() => {
      expect(component.onSubmit).toHaveBeenCalled();
    }));
  });

  describe('when changing the upload category', () => {
    let categoryId: number;

    it('should emit category select event', () => {
      component.categorySelected.subscribe((s: number) => {
        categoryId = s;
      });

      component.uploadForm.patchValue({ category_id: ITEM_CATEGORY_ID });

      expect(categoryId).toBe(ITEM_CATEGORY_ID);
    });
  });

  describe('updateUploadPercentage', () => {
    it('should update the completed percentage of the upload', () => {
      component.updateUploadPercentage(55.99);

      expect(component.uploadCompletedPercentage).toBe(56);
    });
  });

  describe('autoCompleteCellphonesModel', () => {
    describe('when selecting a model in the brand field', () => {
      it('should patch brand and model values', () => {
        const brandModelObj: BrandModel = {
          brand: 'Apple',
          model: 'iPhone 11 Pro',
        };

        component.uploadForm.patchValue({
          category_id: CATEGORY_IDS.CELL_PHONES_ACCESSORIES,
        });
        component.autoCompleteCellphonesModel(brandModelObj);

        expect(component.uploadForm.value.extra_info.brand).toEqual('Apple');
        expect(component.uploadForm.value.extra_info.model).toEqual('iPhone 11 Pro');
      });
    });
  });

  describe('when getting the upload categories from the server', () => {
    it('should get value, label and icon from consumer goods categories', () => {
      const categories = CATEGORIES_DATA_CONSUMER_GOODS;
      spyOn(categoriesApiService, 'getUploadCategories').and.returnValue(of(categories));

      const expected: CategoryOption[] = categories.map((category: CategoryResponse) => {
        const expectedCategory = {
          value: category.category_id.toString(),
          label: category.name,
          icon_id: category.icon_id,
        };

        return expectedCategory;
      });

      component.ngOnInit();

      expect(component.categories).toEqual(expected);
    });
  });

  describe('when the category changes', () => {
    it('should reset category identifier field when the new category is "everything else" category', () => {
      component.categoryId = '-1';

      component.ngOnChanges({
        categoryId: new SimpleChange(null, component.categoryId, true),
      });
      fixture.detectChanges();

      expect(component.uploadForm.value.category_id).toEqual('');
    });

    it('should set the category field as the new one when the category is not "everything else" category', () => {
      component.categoryId = `${CATEGORY_IDS.GAMES_CONSOLES}`;

      component.ngOnChanges({
        categoryId: new SimpleChange(null, component.categoryId, true),
      });
      fixture.detectChanges();

      expect(component.uploadForm.value.category_id).toEqual(`${CATEGORY_IDS.GAMES_CONSOLES}`);
    });

    describe('and the previous category was not shippable', () => {
      beforeAll(() => {
        spyOn(shippingToggleService, 'isAllowed').and.returnValue(
          of({
            category: false,
            subcategory: false,
            price: false,
          })
        );
      });

      it('should set the item as shippable by default', () => {
        component.ngOnChanges({
          categoryId: new SimpleChange(null, 1, true),
        });

        fixture.detectChanges();

        expect(component.uploadForm.value.sale_conditions.supports_shipping).toBeTruthy();
      });
    });

    describe('and the previous category was shippable', () => {
      let itemShippability: boolean;

      beforeAll(() => {
        itemShippability = component.uploadForm.value.sale_conditions.supports_shipping;

        spyOn(shippingToggleService, 'isAllowed').and.returnValue(
          of({
            category: true,
            subcategory: true,
            price: true,
          })
        );
      });

      it('should not modify item shippability', () => {
        component.ngOnChanges({
          categoryId: new SimpleChange(null, 1, true),
        });

        fixture.detectChanges();

        expect(component.uploadForm.value.sale_conditions.supports_shipping).toEqual(itemShippability);
      });
    });
  });

  describe('when the category is a hero category', () => {
    it('should say that the category is a hero category', () => {
      expect(component.isHeroCategory(CATEGORY_IDS.CAR)).toBeTruthy();
    });
  });

  describe('when the category is not a hero category', () => {
    it('should say that the category is not a hero category', () => {
      expect(component.isHeroCategory(CATEGORY_IDS.GAMES_CONSOLES)).toBeFalsy();
    });
  });

  describe('when the category drop-down change', () => {
    it('should clear all extra fields ', () => {
      component.item = MOCK_ITEM_FASHION;
      const expected = {
        object_type: { id: null },
        brand: null,
        gender: null,
        condition: null,
      };
      component.ngOnInit();
      component.resetAllExtraFields();
      fixture.detectChanges();

      expect(component.uploadForm.value.extra_info).toEqual(expected);
    });
  });

  describe('when the subcategory drop-down change', () => {
    it('should clear common extra fields ', () => {
      component.item = MOCK_ITEM_FASHION;
      const expected = {
        object_type: { id: '1' },
        brand: null,
        size: { id: null },
        gender: 'male',
        condition: null,
      };

      component.ngOnInit();
      component.resetCommonExtraFields();
      fixture.detectChanges();

      expect(component.uploadForm.value.extra_info).toEqual(expected);
    });
  });

  describe('suggester of category', () => {
    it('should not call the service when the title is empty', () => {
      component.uploadForm.patchValue({ title: '' });
      spyOn(categoryService, 'getSuggestedCategory');

      component.searchSuggestedCategories();

      expect(categoryService.getSuggestedCategory).not.toBeCalled();
    });

    it('should not call the service when the title is the same that the last suggestion', () => {
      component.uploadForm.patchValue({ title: 'car' });
      component.lastSuggestedCategoryText = 'car';
      spyOn(categoryService, 'getSuggestedCategory');

      component.searchSuggestedCategories();

      expect(categoryService.getSuggestedCategory).not.toBeCalled();
    });

    it('should not call the service when there is a previous here category selected', () => {
      component.uploadForm.patchValue({
        title: 'car',
        category_id: CATEGORY_IDS.JOBS.toString(),
      });
      spyOn(categoryService, 'getSuggestedCategory');

      component.searchSuggestedCategories();

      expect(categoryService.getSuggestedCategory).not.toBeCalled();
    });

    it('should call the service with the title and save last text search', () => {
      component.uploadForm.patchValue({ title: 'car' });
      spyOn(categoryService, 'getSuggestedCategory').and.returnValue(of(null));

      component.searchSuggestedCategories();

      expect(categoryService.getSuggestedCategory).toBeCalledWith('car');
      expect(component.lastSuggestedCategoryText).toBe('car');
    });

    it('should not update the category if there is not suggestion', () => {
      component.uploadForm.patchValue({ title: 'car' });
      spyOn(categoryService, 'getSuggestedCategory').and.returnValue(of(null));
      spyOn(component, 'updateCategory');

      component.searchSuggestedCategories();

      expect(component.lastSuggestedCategoryText).toBe('car');
      expect(component.updateCategory).not.toBeCalled();
    });

    it('should not update the category if suggestion and selected category are the same', () => {
      component.uploadForm.patchValue({
        title: 'bike',
        category_id: CATEGORY_IDS.TV_AUDIO_CAMERAS.toString(),
      });
      spyOn(categoryService, 'getSuggestedCategory').and.returnValue(of(SUGGESTED_CATEGORY_TV_AUDIO_CAMERAS));
      spyOn(component.uploadForm, 'patchValue');

      component.searchSuggestedCategories();

      expect(component.uploadForm.patchValue).not.toBeCalled();
    });

    it('should not update the category if suggestion is not in the category options', () => {
      component.uploadForm.patchValue({ title: 'bike' });
      spyOn(categoryService, 'getSuggestedCategory').and.returnValue(of(SUGGESTED_CATEGORY_COMPUTERS_ELECTRONICS));
      spyOn(component.uploadForm, 'patchValue');

      component.searchSuggestedCategories();

      expect(component.uploadForm.patchValue).not.toBeCalled();
    });

    it('should update the category if the suggested category is valid', () => {
      component.uploadForm.patchValue({ title: 'tv' });
      spyOn(categoryService, 'getSuggestedCategory').and.returnValue(of(SUGGESTED_CATEGORY_TV_AUDIO_CAMERAS));

      component.searchSuggestedCategories();

      expect(component.uploadForm.get('category_id').value).toBe(CATEGORY_IDS.TV_AUDIO_CAMERAS.toString());
    });

    it('should show an 18n success message if a previously selected category was changed', () => {
      component.uploadForm.patchValue({
        title: 'tv',
        category_id: CATEGORY_IDS.GAMES_CONSOLES.toString(),
      });
      spyOn(errorService, 'i18nSuccess');
      spyOn(categoryService, 'getSuggestedCategory').and.returnValue(of(SUGGESTED_CATEGORY_TV_AUDIO_CAMERAS));

      component.searchSuggestedCategories();

      expect(component.uploadForm.get('category_id').value).toBe(CATEGORY_IDS.TV_AUDIO_CAMERAS.toString());
      expect(errorService.i18nSuccess).toHaveBeenCalledWith(TRANSLATION_KEY.SUGGESTED_CATEGORY);
    });
    it('should search categories after the user stop tipyng', fakeAsync(() => {
      spyOn(component, 'searchSuggestedCategories');
      const event = new KeyboardEvent('keyup', {
        bubbles: true,
        cancelable: true,
        shiftKey: false,
      });
      component.titleField.nativeElement.value = 'bike';
      component.titleField.nativeElement.dispatchEvent(event);

      tick(750);
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(component.searchSuggestedCategories).toBeCalled();
      });
    }));
  });

  describe('delete image', () => {
    it('should not remove imagen from form is service fails', () => {
      component.item = MOCK_ITEM;
      component.uploadForm.patchValue({
        images: [UPLOAD_FILE_DONE, UPLOAD_FILE_DONE_2],
      });
      spyOn(uploadService, 'onDeleteImage').and.returnValue(throwError('err'));

      component.onDeleteImage(UPLOAD_FILE_DONE.id);

      expect(uploadService.onDeleteImage).toHaveBeenCalledTimes(1);
      expect(uploadService.onDeleteImage).toHaveBeenCalledWith(component.item.id, UPLOAD_FILE_DONE.id);
      expect(component.uploadForm.get('images').value).toEqual([UPLOAD_FILE_DONE, UPLOAD_FILE_DONE_2]);
    });
    it('should remove imagen from form is service is successful', () => {
      component.item = MOCK_ITEM;
      component.uploadForm.patchValue({
        images: [UPLOAD_FILE_DONE, UPLOAD_FILE_DONE_2],
      });
      spyOn(uploadService, 'onDeleteImage').and.returnValue(of(null));

      component.onDeleteImage(UPLOAD_FILE_DONE.id);

      expect(uploadService.onDeleteImage).toHaveBeenCalledTimes(1);
      expect(uploadService.onDeleteImage).toHaveBeenCalledWith(component.item.id, UPLOAD_FILE_DONE.id);
      expect(component.uploadForm.get('images').value).not.toContain(UPLOAD_FILE_DONE);
      expect(component.uploadForm.get('images').value).toContain(UPLOAD_FILE_DONE_2);
    });
  });

  describe('order images', () => {
    it('should call the service', () => {
      component.item = MOCK_ITEM;
      const images = [UPLOAD_FILE_DONE, UPLOAD_FILE_DONE_2];
      component.uploadForm.patchValue({ images });
      spyOn(uploadService, 'updateOrder').and.callThrough();

      component.onOrderImages();

      expect(uploadService.updateOrder).toHaveBeenCalledTimes(1);
      expect(uploadService.updateOrder).toHaveBeenCalledWith(images, MOCK_ITEM.id);
    });
  });
  describe('add single imagen', () => {
    it('should show success toast', () => {
      component.item = MOCK_ITEM;
      const images = [UPLOAD_FILE_DONE, UPLOAD_FILE_2];
      spyOn(uploadService, 'uploadSingleImage').and.returnValue(of(MOCK_UPLOAD_OUTPUT_DONE));
      spyOn(errorService, 'i18nSuccess').and.callThrough();

      component.onAddImage(images[1]);

      expect(uploadService.uploadSingleImage).toHaveBeenCalledTimes(1);
      expect(uploadService.uploadSingleImage).toHaveBeenCalledWith(images[1], MOCK_ITEM.id, ITEM_TYPES.CONSUMER_GOODS);
      expect(errorService.i18nSuccess).toHaveBeenCalledTimes(1);
      expect(errorService.i18nSuccess).toHaveBeenCalledWith(TRANSLATION_KEY.IMAGE_UPLOADED);
    });
    it('should show image from form if fails', () => {
      component.item = MOCK_ITEM;
      const images = [UPLOAD_FILE_DONE, UPLOAD_FILE_2];
      component.uploadForm.patchValue({
        images,
      });
      spyOn(uploadService, 'uploadSingleImage').and.returnValue(throwError('error'));
      spyOn(errorService, 'i18nError').and.callThrough();

      component.onAddImage(images[1]);

      expect(uploadService.uploadSingleImage).toHaveBeenCalledTimes(1);
      expect(uploadService.uploadSingleImage).toHaveBeenCalledWith(images[1], MOCK_ITEM.id, ITEM_TYPES.CONSUMER_GOODS);
      expect(errorService.i18nError).toHaveBeenCalledTimes(1);
      expect(component.uploadForm.get('images').value).not.toContain(UPLOAD_FILE_2);
      expect(component.uploadForm.get('images').value).toContain(UPLOAD_FILE_DONE);
    });
  });

  describe('is reactivation mode', () => {
    beforeEach(() => {
      component.isReactivation = true;
      component.item = MOCK_ITEM;

      fixture.detectChanges();
    });

    it('should check reactivation validation after all data is ready', fakeAsync(() => {
      spyOn(itemReactivationService, 'reactivationValidation');
      component.ngOnInit();

      component['dataReadyToValidate$'].next();
      tick(600);

      expect(itemReactivationService.reactivationValidation).toHaveBeenCalledWith(component.uploadForm);
    }));

    describe('and loading has ended', () => {
      beforeEach(() => {
        component.loading = false;

        fixture.detectChanges();
      });

      it('should show correct button text', () => {
        const submitButtonTextElement: HTMLElement = fixture.debugElement.query(By.css('tsl-button span')).nativeElement;

        expect(submitButtonTextElement.innerHTML).toEqual('Reactivate item');
      });
    });
  });

  describe('if shipping toggle is enabled', () => {
    const shippabilitySectionSelector = '#shippabilitySection';

    it('should reset weight if disabled', () => {
      component.ngOnInit();
      component.uploadForm.get('sale_conditions').get('supports_shipping').setValue(false);

      expect(component.uploadForm.value.delivery_info).toBeNull();
    });

    describe('and shippability is allowed', () => {
      beforeEach(() => {
        component.isShippabilityAllowed = true;
        fixture.detectChanges();
      });

      it('should show shipping section', () => {
        const shippingSection = fixture.debugElement.query(By.css(shippabilitySectionSelector));

        expect(shippingSection).toBeTruthy();
      });

      describe('when click in +info link', () => {
        it('should send +info click navigation event', () => {
          const moreInfoLinkSelector = `[href="${component.SHIPPING_INFO_HELP_LINK}"]`;
          const moreInfoLink = fixture.debugElement.query(By.css(moreInfoLinkSelector));
          spyOn(uploadTrackingEventService, 'trackClickHelpTransactionalEvent');

          moreInfoLink.nativeElement.click();

          expect(uploadTrackingEventService.trackClickHelpTransactionalEvent).toHaveBeenCalledWith(
            component.item?.id,
            userService.user?.id,
            component.item?.salePrice,
            component.item?.id
          );
        });
      });
    });

    describe('and shippability is NOT allowed', () => {
      beforeEach(() => {
        component.isShippabilityAllowed = false;
        fixture.detectChanges();
      });

      it('should NOT show shipping section', () => {
        const shippingSection = fixture.debugElement.query(By.css(shippabilitySectionSelector));

        expect(shippingSection).toBeFalsy();
      });
    });
  });

  describe('Pro aditional services', () => {
    describe('And has subscription permissions', () => {
      beforeEach(() => {
        permissionService.addPermission(PERMISSIONS.subscriptions);
      });
      describe('and is not car dealer', () => {
        describe('and is pro user', () => {
          beforeEach(() => {
            component.isProUser = true;
            fixture.detectChanges();
          });
          it('Should show section', fakeAsync(() => {
            tick();
            fixture.detectChanges();

            const prosFeatures = fixture.debugElement.query(By.css('tsl-pro-features'));

            expect(prosFeatures).toBeTruthy();
          }));
        });
        describe('and is not pro user', () => {
          it('Should not show section', fakeAsync(() => {
            tick();
            fixture.detectChanges();

            const prosFeatures = fixture.debugElement.query(By.css('tsl-pro-features'));

            expect(prosFeatures).toBeFalsy();
          }));
        });
      });
      describe('and is car dealer', () => {
        beforeEach(() => {
          permissionService.addPermission(PERMISSIONS.professional);
          component.isProUser = true;
          fixture.detectChanges();
        });
        it('Should not show section', fakeAsync(() => {
          tick();
          fixture.detectChanges();

          const prosFeatures = fixture.debugElement.query(By.css('tsl-pro-features'));

          expect(prosFeatures).toBeFalsy();
        }));
      });
    });
    describe('And has not subscription permissions', () => {
      it('Should not show section', () => {
        const prosFeatures = fixture.debugElement.query(By.css('tsl-pro-features'));

        expect(prosFeatures).toBeFalsy();
      });
    });
  });
});
