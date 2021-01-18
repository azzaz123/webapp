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
} from '@fixtures/item.fixtures.spec';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';

import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import {
  NgbModal,
  NgbPopoverConfig,
  NgbPopoverModule,
} from '@ng-bootstrap/ng-bootstrap';
import { UploadProductComponent } from './upload-product.component';
import { CategoryService } from '@core/category/category.service';
import {
  CATEGORIES_OPTIONS_CONSUMER_GOODS,
  CATEGORIES_DATA_CONSUMER_GOODS,
  CATEGORY_DATA_WEB,
  SUGGESTED_CATEGORY_TV_AUDIO_CAMERAS,
  SUGGESTED_CATEGORY_COMPUTERS_ELECTRONICS,
} from '@fixtures/category.fixtures.spec';
import { PreviewModalComponent } from '../../modals/preview-modal/preview-modal.component';
import { TrackingService } from '@core/tracking/tracking.service';
import { ErrorsService } from '@core/errors/errors.service';
import { User } from '@core/user/user';
import { MOCK_USER, USER_ID } from '@fixtures/user.fixtures.spec';
import { MockTrackingService } from '@fixtures/tracking.fixtures.spec';
import {
  ITEM_CATEGORY_ID,
  ITEM_DELIVERY_INFO,
  MOCK_ITEM,
  MOCK_ITEM_FASHION,
} from '@fixtures/item.fixtures.spec';
import { UserLocation } from '@core/user/user-response.interface';
import { environment } from '@environments/environment';
import { GeneralSuggestionsService } from '../../core/services/general-suggestions/general-suggestions.service';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { UserService } from '@core/user/user.service';
import { ItemContent } from '@core/item/item-response.interface';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DeviceDetectorServiceMock } from '../../../../../tests';

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
import { CategoryOption } from '@core/category/category-response.interface';
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
  let trackingService: TrackingService;
  let analyticsService: AnalyticsService;
  let deviceService: DeviceDetectorService;
  let userService: UserService;
  let categoryService: CategoryService;
  let uploadService: UploadService;
  const componentInstance: any = {};

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [NgbPopoverModule],
        providers: [
          FormBuilder,
          NgbPopoverConfig,
          { provide: TrackingService, useClass: MockTrackingService },
          { provide: AnalyticsService, useClass: MockAnalyticsService },
          { provide: UploadService, useClass: MockUploadService },
          {
            provide: DeviceDetectorService,
            useClass: DeviceDetectorServiceMock,
          },
          {
            provide: UserService,
            useValue: {
              isProUser() {
                return of(false);
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
    trackingService = TestBed.inject(TrackingService);
    analyticsService = TestBed.inject(AnalyticsService);
    deviceService = TestBed.inject(DeviceDetectorService);
    userService = TestBed.inject(UserService);
    categoryService = TestBed.inject(CategoryService);
    uploadService = TestBed.inject(UploadService);
    appboy.initialize(environment.appboy);
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
      });
    });

    it('should set item with second subcategory', () => {
      component.item = MOCK_ITEM_CELLPHONES;
      spyOn(generalSuggestionsService, 'getObjectTypes').and.returnValue(
        of(MOCK_OBJECT_TYPES_WITH_CHILDREN)
      );
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
      };

      component.ngOnInit();
      component.getObjectTypes();
      fixture.detectChanges();

      expect(component.uploadForm.value).toEqual(expectedUploadFormValue);
    });

    it('should not set second subcategory item if there are not category options', () => {
      component.item = MOCK_ITEM_CELLPHONES;
      spyOn(generalSuggestionsService, 'getObjectTypes').and.returnValue(
        of([])
      );
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
      };

      component.ngOnInit();
      component.getObjectTypes();
      fixture.detectChanges();

      expect(component.uploadForm.value).toEqual(expectedUploadFormValue);
    });

    it('should not set subcategory field if item do not have subcategory', () => {
      component.item = MOCK_ITEM_CELLPHONES_NO_SUBCATEGORY;
      spyOn(generalSuggestionsService, 'getObjectTypes').and.returnValue(
        of(MOCK_OBJECT_TYPES_WITH_CHILDREN)
      );
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
        expect(
          component.uploadForm.get('extra_info').get('object_type').disabled
        ).toBe(false);
      });
      it('should require the object_type field', () => {
        expect(
          component.uploadForm.get('extra_info').get('object_type').get('id')
            .errors
        ).toEqual({ required: true });
      });
      it('should enable the brand field', () => {
        expect(
          component.uploadForm.get('extra_info').get('brand').disabled
        ).toBe(false);
      });
      it('should enable the model field', () => {
        expect(
          component.uploadForm.get('extra_info').get('model').disabled
        ).toBe(false);
      });
      it('should disable the size field', () => {
        expect(
          component.uploadForm.get('extra_info').get('size').disabled
        ).toBe(true);
      });
      it('should disable the gender field', () => {
        expect(
          component.uploadForm.get('extra_info').get('gender').disabled
        ).toBe(true);
      });
    });
    describe('if the selected category is fashion', () => {
      beforeEach(() => {
        component.uploadForm.patchValue({
          category_id: CATEGORY_IDS.FASHION_ACCESSORIES,
        });
      });

      it('should enable the object_type field', () => {
        expect(
          component.uploadForm.get('extra_info').get('object_type').disabled
        ).toBe(false);
      });
      it('should require the object_type field', () => {
        expect(
          component.uploadForm.get('extra_info').get('object_type').get('id')
            .errors
        ).toEqual({ required: true });
      });
      it('should enable the brand field', () => {
        expect(
          component.uploadForm.get('extra_info').get('brand').disabled
        ).toBe(false);
      });
      it('should enable the gender field', () => {
        expect(
          component.uploadForm.get('extra_info').get('gender').disabled
        ).toBe(false);
      });
      it('should disable the model field', () => {
        expect(
          component.uploadForm.get('extra_info').get('model').disabled
        ).toBe(true);
      });
      it('should enable the size field', () => {
        component.uploadForm.patchValue({
          category_id: CATEGORY_IDS.FASHION_ACCESSORIES,
          extra_info: {
            object_type: { id: 1 },
            gender: 'M',
          },
        });
        component.uploadForm.patchValue({
          category_id: CATEGORY_IDS.FASHION_ACCESSORIES,
        });
        fixture.detectChanges();
        expect(
          component.uploadForm.get('extra_info').get('size').disabled
        ).toBe(false);
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
        expect(
          component.uploadForm.get('extra_info').get('size').disabled
        ).toBe(true);
      });
    });

    describe('if the selected category is a consumer goods category', () => {
      beforeEach(() => {
        component.uploadForm.patchValue({ category_id: CATEGORY_IDS.SERVICES });
      });

      it('should disable the object_type field', () => {
        expect(
          component.uploadForm.get('extra_info').get('object_type').disabled
        ).toBe(true);
      });
      it('should not require the object_type field', () => {
        expect(
          component.uploadForm.get('extra_info').get('object_type').get('id')
            .errors
        ).toBeNull;
      });
      it('should disable the brand field', () => {
        expect(
          component.uploadForm.get('extra_info').get('brand').disabled
        ).toBe(true);
      });
      it('should disable the size field', () => {
        expect(
          component.uploadForm.get('extra_info').get('size').disabled
        ).toBe(true);
      });
      it('should disable the gender field', () => {
        expect(
          component.uploadForm.get('extra_info').get('gender').disabled
        ).toBe(true);
      });
      it('should disable the model field', () => {
        expect(
          component.uploadForm.get('extra_info').get('model').disabled
        ).toBe(true);
      });
    });
  });

  describe('detectFormChanges', () => {
    let formChanged: boolean;

    beforeEach(() => {
      component.item = MOCK_ITEM;
      component.onFormChanged.subscribe((value: boolean) => {
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
    it('should emit uploadEvent if form is valid', () => {
      spyOn(uploadService, 'createItem').and.callThrough();
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

      component.onSubmit();
      expect(uploadService.createItem).toHaveBeenCalledWith(
        component.uploadForm.value,
        ITEM_TYPES.CONSUMER_GOODS
      );
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

      expect(errorService.i18nError).toHaveBeenCalledWith('missingImageError');
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
          object_type_2: { id: 2 },
        },
      });
      component.uploadForm.get('extra_info').get('object_type').enable();
      component.uploadForm.get('extra_info').get('object_type_2').enable();
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
        sale_conditions: { exchange_allowed: false, fix_price: false },
        sale_price: 1000000,
        title: 'test',
      };

      component.onSubmit();
      fixture.detectChanges();

      expect(uploadService.createItem).toHaveBeenCalledWith(
        expected,
        ITEM_TYPES.CONSUMER_GOODS
      );
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
        sale_conditions: { exchange_allowed: false, fix_price: false },
        sale_price: 1000000,
        title: 'test',
      };

      component.onSubmit();
      fixture.detectChanges();

      expect(uploadService.createItem).toHaveBeenCalledWith(
        expected,
        ITEM_TYPES.CONSUMER_GOODS
      );
    });

    describe('and when there is not an item uploaded', () => {
      beforeEach(() => {
        component.item = null;
        component.uploadForm.patchValue(UPLOAD_FORM_ITEM_VALUES);
      });

      it('should upload the item if the service return done', () => {
        spyOn(uploadService, 'createItem').and.returnValue(
          of(MOCK_UPLOAD_ITEM_OUTPUT_DONE)
        );
        spyOn(component, 'onUploaded');

        fixture.detectChanges();
        component.onSubmit();

        expect(uploadService.createItem).toHaveBeenCalledTimes(1);
        expect(uploadService.createItem).toHaveBeenCalledWith(
          component.uploadForm.value,
          ITEM_TYPES.CONSUMER_GOODS
        );
        expect(component.onUploaded).toHaveBeenCalledTimes(1);
        expect(component.onUploaded).toHaveBeenCalledWith(
          MOCK_UPLOAD_ITEM_OUTPUT_DONE.file.response.content,
          UPLOAD_ACTION.created
        );
      });

      it('should do nothing if the service not return done', () => {
        spyOn(uploadService, 'createItem').and.returnValue(
          of(MOCK_UPLOAD_OUTPUT_PENDING)
        );
        spyOn(component, 'onUploaded');

        fixture.detectChanges();
        component.onSubmit();

        expect(uploadService.createItem).toHaveBeenCalledTimes(1);
        expect(component.onUploaded).toHaveBeenCalledTimes(0);
      });

      it('should show error if the service fails', () => {
        spyOn(uploadService, 'createItem').and.returnValue(
          throwError({ message: 'error' })
        );
        spyOn(component, 'onUploaded');
        spyOn(errorService, 'i18nError');

        fixture.detectChanges();
        component.onSubmit();

        expect(uploadService.createItem).toHaveBeenCalledTimes(1);
        expect(component.onUploaded).not.toHaveBeenCalled();
        expect(errorService.i18nError).toHaveBeenCalledTimes(1);
        expect(errorService.i18nError).toHaveBeenCalledWith(
          'serverError',
          'error'
        );
      });
    });

    describe('and when there is an item uploaded', () => {
      beforeEach(() => {
        component.item = MOCK_ITEM;
        component.uploadForm.patchValue(UPLOAD_FORM_ITEM_VALUES);
      });

      it('should upload the item if the service success', () => {
        spyOn(uploadService, 'updateItem').and.returnValue(
          of({ content: MOCK_ITEM_RESPONSE_CONTENT })
        );
        spyOn(component, 'onUploaded');
        fixture.detectChanges();
        component.onSubmit();

        expect(uploadService.updateItem).toHaveBeenCalledTimes(1);
        expect(uploadService.updateItem).toHaveBeenCalledWith(
          component.uploadForm.value,
          ITEM_TYPES.CONSUMER_GOODS
        );
        expect(component.onUploaded).toHaveBeenCalledTimes(1);
        expect(component.onUploaded).toHaveBeenCalledWith(
          MOCK_ITEM_RESPONSE_CONTENT,
          UPLOAD_ACTION.updated
        );
      });

      it('should show error if the service fails', () => {
        spyOn(uploadService, 'updateItem').and.returnValue(
          throwError({ message: 'error' })
        );
        spyOn(component, 'onUploaded');
        spyOn(errorService, 'i18nError');

        fixture.detectChanges();
        component.onSubmit();

        expect(uploadService.updateItem).toHaveBeenCalledTimes(1);
        expect(component.onUploaded).not.toHaveBeenCalled();
        expect(errorService.i18nError).toHaveBeenCalledTimes(1);
        expect(errorService.i18nError).toHaveBeenCalledWith(
          'serverError',
          'error'
        );
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

      expect(generalSuggestionsService.getObjectTypes).toHaveBeenCalledWith(
        CATEGORY_IDS.CELL_PHONES_ACCESSORIES
      );
    });

    it('should get dropdown options', () => {
      spyOn(generalSuggestionsService, 'getObjectTypes').and.returnValue(
        of(MOCK_OBJECT_TYPES)
      );

      component.getObjectTypes();
      fixture.detectChanges();

      expect(component.objectTypes).toEqual(MOCK_OBJECT_TYPES);
      expect(component.objectTypesOptions).toEqual(MOCK_OBJECT_TYPES_RESPONSE);
    });

    it('should update form', () => {
      spyOn(component, 'getExtraInfo').and.returnValue({});
      spyOn(generalSuggestionsService, 'getObjectTypes').and.returnValue(
        of(MOCK_OBJECT_TYPES)
      );
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
      spyOn(generalSuggestionsService, 'getObjectTypes').and.returnValue(
        of(MOCK_OBJECT_TYPES)
      );
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
      expect(
        component.uploadForm.get('extra_info').get('object_type_2').disabled
      ).toBe(false);
    });

    it('should not get options for the selected subcategory without second level subcategories', () => {
      component.objectTypes = MOCK_OBJECT_TYPES_WITH_CHILDREN;
      const selectedId = 4;

      component.getSecondObjectTypes(selectedId);

      expect(component.objectTypesOptions2).toEqual([]);
      expect(
        component.uploadForm.get('extra_info').get('object_type_2').disabled
      ).toBe(true);
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

      expect(generalSuggestionsService.getBrands).toHaveBeenCalledWith(
        'Apple',
        CATEGORY_IDS.CELL_PHONES_ACCESSORIES,
        '365'
      );
    });

    it('should get brands and models if the brand endpoint doesn`t return any result', () => {
      spyOn(generalSuggestionsService, 'getBrandsAndModels').and.callThrough();
      spyOn(generalSuggestionsService, 'getBrands').and.returnValue(of([]));

      component.getBrands('iPhone');

      expect(generalSuggestionsService.getBrandsAndModels).toHaveBeenCalledWith(
        'iPhone',
        CATEGORY_IDS.CELL_PHONES_ACCESSORIES,
        '365'
      );
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

      expect(generalSuggestionsService.getModels).toHaveBeenCalledWith(
        'iPhone',
        CATEGORY_IDS.CELL_PHONES_ACCESSORIES,
        'Apple',
        '365'
      );
    });
  });

  describe('getSizes', () => {
    it('should get the sizes for the current object type and gender', () => {
      component.uploadForm.get('extra_info').patchValue({
        object_type: {
          id: '365',
        },
        gender: 'male',
      });
      spyOn(generalSuggestionsService, 'getSizes').and.callThrough();

      component.getSizes();

      expect(generalSuggestionsService.getSizes).toHaveBeenCalledWith(
        '365',
        'male'
      );
    });
  });

  describe('onUploaded', () => {
    const action = UPLOAD_ACTION.updated;
    const response = MOCK_ITEM_RESPONSE_CONTENT;

    it('should emit form changed event', () => {
      let formChanged = true;
      component.onFormChanged.subscribe((value: boolean) => {
        formChanged = value;
      });

      component.onUploaded(response, action);

      expect(formChanged).toBeFalsy();
    });

    it('should redirect', () => {
      spyOn(router, 'navigate');

      component.onUploaded(response, action);

      expect(router.navigate).toHaveBeenCalledWith([
        '/catalog/list',
        { [action]: true, itemId: response.id },
      ]);
    });

    it('should send appboy Edit event if item is selected', () => {
      spyOn(appboy, 'logCustomEvent');

      component.item = MOCK_ITEM;
      component.onUploaded(response, action);

      expect(appboy.logCustomEvent).toHaveBeenCalledWith('Edit', {
        platform: 'web',
      });
    });

    it('should send appboy List event if any item is selected', () => {
      spyOn(appboy, 'logCustomEvent');

      component.onUploaded(response, action);

      expect(appboy.logCustomEvent).toHaveBeenCalledWith('List', {
        platform: 'web',
      });
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
          },
        };
        spyOn(analyticsService, 'trackEvent');

        component.ngOnInit();
        component.onUploaded(editResponse, action);

        expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
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
          },
        };
        spyOn(analyticsService, 'trackEvent');

        component.ngOnInit();
        component.onUploaded(uploadResponse, action);

        expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
      });
    });
  });

  describe('onError', () => {
    it('should set loading to false', () => {
      spyOn(trackingService, 'track');
      component.loading = true;

      component.onError('response');

      expect(component.loading).toBeFalsy();
      expect(trackingService.track).toHaveBeenCalledWith(
        TrackingService.UPLOADFORM_ERROR
      );
    });
    it('should show toast with default message', () => {
      spyOn(errorService, 'i18nError').and.callThrough();

      component.onError('error');

      expect(errorService.i18nError).toHaveBeenCalledTimes(1);
      expect(errorService.i18nError).toHaveBeenCalledWith('serverError', '');
    });

    it('should show toast with custom message', () => {
      spyOn(errorService, 'i18nError').and.callThrough();

      component.onError({ message: 'error' });

      expect(errorService.i18nError).toHaveBeenCalledTimes(1);
      expect(errorService.i18nError).toHaveBeenCalledWith(
        'serverError',
        'error'
      );
    });
  });

  describe('onDeliveryChange', () => {
    it('should reset selected delivery value if clicked twice', () => {
      spyOn(component.uploadForm.controls['delivery_info'], 'reset');

      component.onDeliveryChange(ITEM_DELIVERY_INFO);
      component.onDeliveryChange(ITEM_DELIVERY_INFO);

      expect(component['oldDeliveryValue']).toBeUndefined();
      expect(
        component.uploadForm.controls['delivery_info'].reset
      ).toHaveBeenCalled();
    });
  });

  describe('when categories ', () => {
    it('should reset selected delivery value if clicked twice', () => {
      spyOn(component.uploadForm.controls['delivery_info'], 'reset');

      component.onDeliveryChange(ITEM_DELIVERY_INFO);
      component.onDeliveryChange(ITEM_DELIVERY_INFO);

      expect(component['oldDeliveryValue']).toBeUndefined();
      expect(
        component.uploadForm.controls['delivery_info'].reset
      ).toHaveBeenCalled();
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
        sale_conditions: {
          fix_price: false,
          exchange_allowed: false,
        },
        delivery_info: null,
        location: {
          address: USER_LOCATION.full_address,
          latitude: USER_LOCATION.approximated_latitude,
          longitude: USER_LOCATION.approximated_longitude,
        },
        extra_info: {
          condition: null,
        },
      });
    });

    it('should submit form', fakeAsync(() => {
      expect(component.onSubmit).toHaveBeenCalled();
    }));
  });

  describe('when changing the upload category', () => {
    let categoryId: number;

    it('should emit category select event', () => {
      component.onCategorySelect.subscribe((s: number) => {
        categoryId = s;
      });

      component.uploadForm.patchValue({ category_id: ITEM_CATEGORY_ID });

      expect(categoryId).toBe(ITEM_CATEGORY_ID);
    });
  });

  describe('Emit Location', () => {
    it('should emit location updated event', () => {
      spyOn(component.locationSelected, 'emit');
      component.emitLocation();

      expect(component.locationSelected.emit).toHaveBeenCalled();
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
        expect(component.uploadForm.value.extra_info.model).toEqual(
          'iPhone 11 Pro'
        );
      });
    });
  });

  describe('when getting the upload categories from the server', () => {
    it('should get value, label and icon from consumer goods categories', () => {
      spyOn(categoryService, 'getCategories').and.returnValue(
        of(CATEGORY_DATA_WEB)
      );
      const expected: CategoryOption[] = [
        {
          value: '15000',
          icon_id: 'pc',
          label: 'Computers & Electronic',
        },
        {
          value: '15245',
          icon_id: 'pc',
          label: 'Computers & Electronic',
        },
        {
          value: '14000',
          icon_id: 'motorbike',
          label: 'Motorbikes',
        },
        {
          value: '12800',
          icon_id: 'helmet',
          label: 'Motor parts',
        },
      ];

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

      expect(component.uploadForm.value.category_id).toEqual(
        `${CATEGORY_IDS.GAMES_CONSOLES}`
      );
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
        size: { id: null },
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
      spyOn(categoryService, 'getSuggestedCategory').and.returnValue(
        of(SUGGESTED_CATEGORY_TV_AUDIO_CAMERAS)
      );
      spyOn(component.uploadForm, 'patchValue');

      component.searchSuggestedCategories();

      expect(component.uploadForm.patchValue).not.toBeCalled();
    });

    it('should not update the category if suggestion is not in the category options', () => {
      component.uploadForm.patchValue({ title: 'bike' });
      spyOn(categoryService, 'getSuggestedCategory').and.returnValue(
        of(SUGGESTED_CATEGORY_COMPUTERS_ELECTRONICS)
      );
      spyOn(component.uploadForm, 'patchValue');

      component.searchSuggestedCategories();

      expect(component.uploadForm.patchValue).not.toBeCalled();
    });

    it('should update the category if the suggested category is valid', () => {
      component.uploadForm.patchValue({ title: 'tv' });
      spyOn(categoryService, 'getSuggestedCategory').and.returnValue(
        of(SUGGESTED_CATEGORY_TV_AUDIO_CAMERAS)
      );

      component.searchSuggestedCategories();

      expect(component.uploadForm.get('category_id').value).toBe(
        CATEGORY_IDS.TV_AUDIO_CAMERAS.toString()
      );
    });

    it('should show an 18n success message if a previously selected category was changed', () => {
      component.uploadForm.patchValue({
        title: 'tv',
        category_id: CATEGORY_IDS.GAMES_CONSOLES.toString(),
      });
      spyOn(errorService, 'i18nSuccess');
      spyOn(categoryService, 'getSuggestedCategory').and.returnValue(
        of(SUGGESTED_CATEGORY_TV_AUDIO_CAMERAS)
      );

      component.searchSuggestedCategories();

      expect(component.uploadForm.get('category_id').value).toBe(
        CATEGORY_IDS.TV_AUDIO_CAMERAS.toString()
      );
      expect(errorService.i18nSuccess).toHaveBeenCalledWith(
        'suggestedCategory'
      );
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
      expect(uploadService.onDeleteImage).toHaveBeenCalledWith(
        component.item.id,
        UPLOAD_FILE_DONE.id
      );
      expect(component.uploadForm.get('images').value).toEqual([
        UPLOAD_FILE_DONE,
        UPLOAD_FILE_DONE_2,
      ]);
    });
    it('should remove imagen from form is service is successful', () => {
      component.item = MOCK_ITEM;
      component.uploadForm.patchValue({
        images: [UPLOAD_FILE_DONE, UPLOAD_FILE_DONE_2],
      });
      spyOn(uploadService, 'onDeleteImage').and.returnValue(of(null));

      component.onDeleteImage(UPLOAD_FILE_DONE.id);

      expect(uploadService.onDeleteImage).toHaveBeenCalledTimes(1);
      expect(uploadService.onDeleteImage).toHaveBeenCalledWith(
        component.item.id,
        UPLOAD_FILE_DONE.id
      );
      expect(component.uploadForm.get('images').value).not.toContain(
        UPLOAD_FILE_DONE
      );
      expect(component.uploadForm.get('images').value).toContain(
        UPLOAD_FILE_DONE_2
      );
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
      expect(uploadService.updateOrder).toHaveBeenCalledWith(
        images,
        MOCK_ITEM.id
      );
    });
  });
  describe('add single imagen', () => {
    it('should show success toast', () => {
      component.item = MOCK_ITEM;
      const images = [UPLOAD_FILE_DONE, UPLOAD_FILE_2];
      spyOn(uploadService, 'uploadSingleImage').and.returnValue(
        of(MOCK_UPLOAD_OUTPUT_DONE)
      );
      spyOn(errorService, 'i18nSuccess').and.callThrough();

      component.onAddImage(images[1]);

      expect(uploadService.uploadSingleImage).toHaveBeenCalledTimes(1);
      expect(uploadService.uploadSingleImage).toHaveBeenCalledWith(
        images[1],
        MOCK_ITEM.id,
        ITEM_TYPES.CONSUMER_GOODS
      );
      expect(errorService.i18nSuccess).toHaveBeenCalledTimes(1);
      expect(errorService.i18nSuccess).toHaveBeenCalledWith('imageUploaded');
    });
    it('should show image from form if fails', () => {
      component.item = MOCK_ITEM;
      const images = [UPLOAD_FILE_DONE, UPLOAD_FILE_2];
      component.uploadForm.patchValue({
        images,
      });
      spyOn(uploadService, 'uploadSingleImage').and.returnValue(
        throwError('error')
      );
      spyOn(errorService, 'i18nError').and.callThrough();

      component.onAddImage(images[1]);

      expect(uploadService.uploadSingleImage).toHaveBeenCalledTimes(1);
      expect(uploadService.uploadSingleImage).toHaveBeenCalledWith(
        images[1],
        MOCK_ITEM.id,
        ITEM_TYPES.CONSUMER_GOODS
      );
      expect(errorService.i18nError).toHaveBeenCalledTimes(1);
      expect(component.uploadForm.get('images').value).not.toContain(
        UPLOAD_FILE_2
      );
      expect(component.uploadForm.get('images').value).toContain(
        UPLOAD_FILE_DONE
      );
    });
  });
});
