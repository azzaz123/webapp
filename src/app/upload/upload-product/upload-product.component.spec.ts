import { MOCK_ITEM_CELLPHONES } from './../../../tests/item.fixtures.spec';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NgbModal, NgbPopoverConfig, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { UploadProductComponent, CELLPHONES_EXTRA_FIELDS_NAME, FASHION_EXTRA_FIELDS_NAME } from './upload-product.component';
import { CategoryService } from '../../core/category/category.service';
import { CATEGORIES_OPTIONS, CATEGORIES_OPTIONS_CONSUMER_GOODS } from '../../../tests/category.fixtures.spec';
import { PreviewModalComponent } from '../preview-modal/preview-modal.component';
import { TrackingService } from '../../core/tracking/tracking.service';
import { ErrorsService } from '../../core/errors/errors.service';
import { User } from '../../core/user/user';
import { MOCK_USER, USER_ID } from '../../../tests/user.fixtures.spec';
import { TEST_HTTP_PROVIDERS } from '../../../tests/utils.spec';
import { MockTrackingService } from '../../../tests/tracking.fixtures.spec';
import { ITEM_CATEGORY_ID, ITEM_DATA, ITEM_DELIVERY_INFO, MOCK_ITEM, MOCK_ITEM_FASHION } from '../../../tests/item.fixtures.spec';
import { Item } from '../../core/item/item';
import { UserLocation } from '../../core/user/user-response.interface';
import { environment } from '../../../environments/environment';
import { REALESTATE_CATEGORY } from '../../core/item/item-categories';
import { GeneralSuggestionsService } from './general-suggestions.service';
import { SplitTestService } from '../../core/tracking/split-test.service';
import { AnalyticsService } from '../../core/analytics/analytics.service';
import { MockAnalyticsService } from '../../../tests/analytics.fixtures.spec';
import { UserService } from '../../core/user/user.service';
import { ItemContent } from '../../core/item/item-response.interface';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DeviceDetectorServiceMock } from '../../../tests';

import {
  ANALYTIC_EVENT_TYPES,
  ANALYTICS_EVENT_NAMES,
  SCREEN_IDS,
  AnalyticsEvent,
  EditItemCG,
  ListItemCG
} from '../../core/analytics/analytics-constants';
import { BrandModel } from '../brand-model.interface';
import { CATEGORY_IDS } from '../../core/category/category-ids';
export const MOCK_USER_NO_LOCATION: User = new User(USER_ID);

export const USER_LOCATION: UserLocation = {
  'id': 101,
  'approximated_latitude': 41.399132621722174,
  'approximated_longitude': 2.17585484411869,
  'city': 'Barcelona',
  'zip': '08009',
  'approxRadius': 0,
  'title': '08009, Barcelona',
  'full_address': 'Carrer Sant Pere Mes Baix, Barcelona'
};

MOCK_USER.location = USER_LOCATION;

describe('UploadProductComponent', () => {
  let component: UploadProductComponent;
  let fixture: ComponentFixture<UploadProductComponent>;
  let errorService: ErrorsService;
  let generalSuggestionsService: GeneralSuggestionsService;
  let router: Router;
  let categoryService: CategoryService;
  let modalService: NgbModal;
  let trackingService: TrackingService;
  let splitTestService: SplitTestService;
  let analyticsService: AnalyticsService;
  let deviceService: DeviceDetectorService;
  const componentInstance: any = {};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgbPopoverModule],
      providers: [
        FormBuilder,
        NgbPopoverConfig,
        TEST_HTTP_PROVIDERS,
        { provide: TrackingService, useClass: MockTrackingService },
        { provide: AnalyticsService, useClass: MockAnalyticsService },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceMock },
        {
          provide: UserService, useValue: {
            isProUser() {
              return Observable.of(false);
            }
          }
        },
        {
          provide: Router, useValue: {
            navigate() {
            }
          }
        },
        {
          provide: ErrorsService, useValue: {
            i18nSuccess() {
            },
            i18nError() {
            }
          }
        },
        {
          provide: CategoryService, useValue: {
            getUploadCategories() {
              return Observable.of(CATEGORIES_OPTIONS);
            },
            isHeroCategory() {
            },
          }
        },
        {
          provide: NgbModal, useValue: {
            open() {
              return {
                result: Promise.resolve(),
                componentInstance: componentInstance
              };
            }
          }
        },
        {
          provide: SplitTestService, useValue: {
            getVariable() {
              return Observable.of(true);
            },
            track() { }
          }
        },
        {
          provide: GeneralSuggestionsService, useValue: {
            getObjectTypes() {
              return Observable.of({});
            },
            getBrands() {
              return Observable.of({});
            },
            getModels() {
              return Observable.of(['iPhone 2G', 'iPhone 3G', 'iPhone 4']);
            },
            getBrandsAndModels() {
              return Observable.of([{ brand: 'Apple', model: 'iPhone XSX' }, { brand: 'Samsung', model: 'Galaxy S20' }]);
            },
            getSizes() {
              return Observable.of({
                male: [{ id: 1, text: 'XXXS / 30 / 2' }],
                female: [{ id: 18, text: 'XS / 30-32 / 40-42' }]
              });
            }
          }
        }
      ],
      declarations: [UploadProductComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadProductComponent);
    component = fixture.componentInstance;
    categoryService = TestBed.get(CategoryService);
    spyOn(categoryService, 'getUploadCategories').and.callThrough();
    errorService = TestBed.get(ErrorsService);
    generalSuggestionsService = TestBed.get(GeneralSuggestionsService);
    router = TestBed.get(Router);
    modalService = TestBed.get(NgbModal);
    trackingService = TestBed.get(TrackingService);
    splitTestService = TestBed.get(SplitTestService);
    analyticsService = TestBed.get(AnalyticsService);
    deviceService = TestBed.get(DeviceDetectorService);
    fixture.detectChanges();
    appboy.initialize(environment.appboy);
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
          longitude: ''
        },
        [CELLPHONES_EXTRA_FIELDS_NAME]: {
          object_type: {
            id: null,
          },
          brand: null,
          model: null,
        },
        [FASHION_EXTRA_FIELDS_NAME]: {
          object_type: {
            id: null,
          },
          brand: null,
          size: {
            id: null,
          },
          gender: null
        }
      });
    });

    it('should get and set categories', () => {
      spyOn(categoryService, 'isHeroCategory').and.returnValues(false, false, false, false, true, true);

      component.ngOnInit();

      expect(categoryService.getUploadCategories).toHaveBeenCalled();
      expect(component.categories).toEqual(CATEGORIES_OPTIONS_CONSUMER_GOODS);
    });

    describe('with preselected category', () => {
      beforeEach(() => {
        component.categoryId = REALESTATE_CATEGORY;

        component.ngOnInit();
      });

      it('should set form category_id', () => {
        expect(component.uploadForm.get('category_id').value).toBe(REALESTATE_CATEGORY);
      });

      it('should set form delivery_info', () => {
        expect(component.uploadForm.get('delivery_info').value).toBe(null);
      });

      it('should set fixedCategory', () => {
        expect(component.fixedCategory).toBe('Real Estate');
      });
    });

    describe('edit mode', () => {
      it('should set fixedCategory if is hero category', () => {
        spyOn(categoryService, 'isHeroCategory').and.returnValue(true);
        component.item = new Item(
          ITEM_DATA.id,
          ITEM_DATA.legacy_id,
          ITEM_DATA.owner,
          ITEM_DATA.title,
          ITEM_DATA.description,
          13000
        );

        component.ngOnInit();

        expect(component.fixedCategory).toBe('Real Estate');
      });
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
              longitude: ''
            },
            [CELLPHONES_EXTRA_FIELDS_NAME]: {
              object_type: {
                id: null,
              },
              brand: null,
              model: null,
            },
            [FASHION_EXTRA_FIELDS_NAME]: {
              object_type: {
                id: MOCK_ITEM_FASHION.extraInfo.object_type.id,
              },
              brand: MOCK_ITEM_FASHION.extraInfo.brand,
              size: {
                id: MOCK_ITEM_FASHION.extraInfo.size.id,
              },
              gender: MOCK_ITEM_FASHION.extraInfo.gender
            }
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
              longitude: ''
            },
            [CELLPHONES_EXTRA_FIELDS_NAME]: {
              object_type: {
                id: MOCK_ITEM_CELLPHONES.extraInfo.object_type.id,
              },
              brand: MOCK_ITEM_CELLPHONES.extraInfo.brand,
              model: MOCK_ITEM_CELLPHONES.extraInfo.model,
            },
            [FASHION_EXTRA_FIELDS_NAME]: {
              object_type: {
                id: null,
              },
              brand: null,
              size: {
                id: null,
              },
              gender: null
            }
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
          focus() {
          }
        }
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
      let input: any;
      fixture.detectChanges();
      component.uploadForm.get('category_id').patchValue('200');
      component.uploadForm.get('title').patchValue('test');
      component.uploadForm.get('description').patchValue('test');
      component.uploadForm.get('sale_price').patchValue(1000000);
      component.uploadForm.get('currency_code').patchValue('EUR');
      component.uploadForm.get('images').patchValue([{ 'image': true }]);
      component.uploadForm.get('location').patchValue({
        address: USER_LOCATION.full_address,
        latitude: USER_LOCATION.approximated_latitude,
        longitude: USER_LOCATION.approximated_longitude
      });

      component.uploadEvent.subscribe((i: any) => {
        input = i;
      });
      component.onSubmit();
      expect(input).toEqual({
        type: 'create',
        values: component.uploadForm.value
      });
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

    describe('when the upload category doesn`t allow extra fields', () => {
      it('should disable extra info fields', () => {
        component.item = MOCK_ITEM;
        component.uploadForm.get('location').patchValue({
          address: USER_LOCATION.full_address,
          latitude: USER_LOCATION.approximated_latitude,
          longitude: USER_LOCATION.approximated_longitude
        });
        component.uploadForm.get('images').patchValue([{ 'image': true }]);

        component.ngOnInit();
        component.onSubmit();

        expect(component.uploadForm.get(FASHION_EXTRA_FIELDS_NAME).disabled).toBe(true);
        expect(component.uploadForm.get(CELLPHONES_EXTRA_FIELDS_NAME).disabled).toBe(true);
      });
    });

    describe('when the upload category is cellphones', () => {
      beforeEach(() => {
        component.item = MOCK_ITEM_CELLPHONES;
        component.uploadForm.get('location').patchValue({
          address: USER_LOCATION.full_address,
          latitude: USER_LOCATION.approximated_latitude,
          longitude: USER_LOCATION.approximated_longitude
        });
        component.uploadForm.get('images').patchValue([{ 'image': true }]);
      });

      it('should disable fashion extra fields', () => {
        component.ngOnInit();
        component.onSubmit();

        expect(component.uploadForm.get(FASHION_EXTRA_FIELDS_NAME).disabled).toBe(true);
        expect(component.uploadForm.get(CELLPHONES_EXTRA_FIELDS_NAME).disabled).toBe(false);
      });

      it('should rename `cellphones_extra_fields` object to `extra_info`', () => {
        component.ngOnInit();
        const cellphonesExtraFields = component.uploadForm.value[CELLPHONES_EXTRA_FIELDS_NAME];

        component.onSubmit();

        expect(component.uploadForm.value.extra_info).toEqual(cellphonesExtraFields);
        expect(component.uploadForm.value[CELLPHONES_EXTRA_FIELDS_NAME]).toBeUndefined();
      });
    });

    describe('when the upload category is fashion', () => {
      beforeEach(() => {
        component.item = MOCK_ITEM_FASHION;
        component.uploadForm.get('location').patchValue({
          address: USER_LOCATION.full_address,
          latitude: USER_LOCATION.approximated_latitude,
          longitude: USER_LOCATION.approximated_longitude
        });
        component.uploadForm.get('images').patchValue([{ 'image': true }]);
      });

      it('should disable cellphones extra fields', () => {
        component.ngOnInit();

        component.onSubmit();

        expect(component.uploadForm.get(FASHION_EXTRA_FIELDS_NAME).disabled).toBe(false);
        expect(component.uploadForm.get(CELLPHONES_EXTRA_FIELDS_NAME).disabled).toBe(true);
      });

      it('should rename `fashion_extra_fields` object to `extra_info`', () => {
        component.ngOnInit();
        const fashionExtraFieldsName = component.uploadForm.value[FASHION_EXTRA_FIELDS_NAME];

        component.onSubmit();

        expect(component.uploadForm.value.extra_info).toEqual(fashionExtraFieldsName);
        expect(component.uploadForm.value[FASHION_EXTRA_FIELDS_NAME]).toBeUndefined();
      });
    });

  });

  describe('getObjectTypes', () => {
    it('should get the object types for the selected category', () => {
      component.uploadForm.patchValue({ category_id: CATEGORY_IDS.CELL_PHONES_ACCESSORIES });
      spyOn(generalSuggestionsService, 'getObjectTypes').and.callThrough();

      component.getObjectTypes();

      expect(generalSuggestionsService.getObjectTypes).toHaveBeenCalledWith(CATEGORY_IDS.CELL_PHONES_ACCESSORIES);
    });
  });

  describe('getBrands', () => {
    beforeEach(() => {
      component.uploadForm.patchValue({
        category_id: CATEGORY_IDS.CELL_PHONES_ACCESSORIES,
        [CELLPHONES_EXTRA_FIELDS_NAME]: {
          object_type: {
            id: '365'
          }
        }
      });
    });

    it('should get the brands for the provided keyword', () => {
      spyOn(generalSuggestionsService, 'getBrands').and.callThrough();

      component.getBrands('Apple');

      expect(generalSuggestionsService.getBrands).toHaveBeenCalledWith('Apple', CATEGORY_IDS.CELL_PHONES_ACCESSORIES, '365');
    });

    it('should get brands and models if the brand endpoint doesn`t return any result', () => {
      spyOn(generalSuggestionsService, 'getBrandsAndModels').and.callThrough();
      spyOn(generalSuggestionsService, 'getBrands').and.returnValue(Observable.of([]));

      component.getBrands('iPhone');

      expect(generalSuggestionsService.getBrandsAndModels).toHaveBeenCalledWith('iPhone', CATEGORY_IDS.CELL_PHONES_ACCESSORIES, '365');
    });
  });

  describe('getModels', () => {
    it('should get the models for the provided keyword and the selected brand', () => {
      component.uploadForm.patchValue({
        category_id: CATEGORY_IDS.CELL_PHONES_ACCESSORIES,
        [CELLPHONES_EXTRA_FIELDS_NAME]: {
          object_type: {
            id: '365'
          },
          brand: 'Apple'
        }
      });
      spyOn(generalSuggestionsService, 'getModels').and.callThrough();

      component.getModels('iPhone');

      expect(generalSuggestionsService.getModels).toHaveBeenCalledWith('iPhone', CATEGORY_IDS.CELL_PHONES_ACCESSORIES, 'Apple', '365');
    });
  });

  describe('getSizes', () => {
    it('should get the sizes for the current object type and gender', () => {
      component.uploadForm.get(FASHION_EXTRA_FIELDS_NAME).patchValue({
        object_type: {
          id: '365'
        },
        gender: 'male'
      });
      spyOn(generalSuggestionsService, 'getSizes').and.callThrough();

      component.getSizes();

      expect(generalSuggestionsService.getSizes).toHaveBeenCalledWith('365', 'male');
    });
  });

  describe('onUploaded', () => {
    const MOCK_RESPONSE_CONTENT: ItemContent = {
      id: MOCK_ITEM.id,
      category_id: MOCK_ITEM.categoryId,
      sale_price: MOCK_ITEM.salePrice,
      title: MOCK_ITEM.title,
      description: MOCK_ITEM.description,
      modified_date: MOCK_ITEM.modifiedDate,
      flags: MOCK_ITEM.flags,
      seller_id: 'ukd73df',
      web_slug: MOCK_ITEM.webSlug
    }
    const uploadedEvent = {
      action: 'updated',
      response: {
        id: '1',
        content: MOCK_RESPONSE_CONTENT
      }
    };

    it('should emit form changed event', () => {
      let formChanged = true;
      component.onFormChanged.subscribe((value: boolean) => {
        formChanged = value;
      });

      component.onUploaded(uploadedEvent);

      expect(formChanged).toBeFalsy();
    });

    it('should redirect', () => {
      spyOn(router, 'navigate');

      component.onUploaded(uploadedEvent);

      expect(router.navigate).toHaveBeenCalledWith(['/catalog/list', { [uploadedEvent.action]: true, itemId: uploadedEvent.response.id }]);
    });

    it('should send appboy Edit event if item is selected', () => {
      spyOn(appboy, 'logCustomEvent');

      component.item = MOCK_ITEM;
      component.onUploaded(uploadedEvent);

      expect(appboy.logCustomEvent).toHaveBeenCalledWith('Edit', { platform: 'web' });
    });

    it('should send appboy List event if any item is selected', () => {
      spyOn(appboy, 'logCustomEvent');

      component.onUploaded(uploadedEvent);

      expect(appboy.logCustomEvent).toHaveBeenCalledWith('List', { platform: 'web' });
    });

    describe('if it`s a item modification', () => {
      it('should send the Edit Item CG tracking event', () => {
        component.item = MOCK_ITEM;
        const editEvent: any = {
          action: 'update',
          response: {
            id: MOCK_ITEM.id,
            type: 'edit'
          }
        }
        const editResponse: ItemContent = MOCK_RESPONSE_CONTENT;
        const expectedEvent: AnalyticsEvent<EditItemCG> = {
          name: ANALYTICS_EVENT_NAMES.EditItemCG,
          eventType: ANALYTIC_EVENT_TYPES.Other,
          attributes: {
            itemId: editResponse.id,
            categoryId: editResponse.category_id,
            salePrice: editResponse.sale_price,
            title: editResponse.title,
            isPro: false,
            screenId: SCREEN_IDS.EditItem
          }
        };
        editEvent.response.content = editResponse;
        spyOn(analyticsService, 'trackEvent');

        component.ngOnInit();
        component.onUploaded(editEvent);

        expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
      });
    });

    describe('if it`s a item upload', () => {
      it('should send the List Item CG tracking event', () => {
        const uploadEvent: any = {
          action: 'create',
          response: {
            id: MOCK_ITEM.id,
            type: 'upload'
          }
        }
        const uploadResponse: ItemContent = MOCK_RESPONSE_CONTENT;
        const expectedEvent: AnalyticsEvent<ListItemCG> = {
          name: ANALYTICS_EVENT_NAMES.ListItemCG,
          eventType: ANALYTIC_EVENT_TYPES.Other,
          attributes: {
            itemId: uploadResponse.id,
            categoryId: uploadResponse.category_id,
            salePrice: uploadResponse.sale_price,
            title: uploadResponse.title,
            isPro: false,
            screenId: SCREEN_IDS.Upload
          }
        };
        uploadEvent.response.content = uploadResponse;
        spyOn(analyticsService, 'trackEvent');

        component.ngOnInit();
        component.onUploaded(uploadEvent);

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
      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.UPLOADFORM_ERROR);
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

  describe('preview', () => {
    beforeEach(fakeAsync(() => {
      spyOn(modalService, 'open').and.callThrough();
      spyOn(component, 'onSubmit');
      fixture.detectChanges();
      component.uploadForm.get('category_id').patchValue('200');
      component.uploadForm.get('title').patchValue('test');
      component.uploadForm.get('description').patchValue('test');
      component.uploadForm.get('sale_price').patchValue(1000000);
      component.uploadForm.get('currency_code').patchValue('EUR');
      component.uploadForm.get('images').patchValue([{ 'image': true }]);
      component.uploadForm.get('location').patchValue({
        address: USER_LOCATION.full_address,
        latitude: USER_LOCATION.approximated_latitude,
        longitude: USER_LOCATION.approximated_longitude
      });

      component.preview();

      tick();
    }));

    it('should open modal', () => {
      expect(modalService.open).toHaveBeenCalledWith(PreviewModalComponent, {
        windowClass: 'preview'
      });
    });

    it('should set itemPreview', () => {
      expect(componentInstance.itemPreview).toEqual({
        id: '',
        category_id: '200',
        title: 'test',
        description: 'test',
        'sale_price': 1000000,
        currency_code: 'EUR',
        images: [{ 'image': true }],
        sale_conditions: {
          fix_price: false,
          exchange_allowed: false
        },
        delivery_info: null,
        location: {
          address: USER_LOCATION.full_address,
          latitude: USER_LOCATION.approximated_latitude,
          longitude: USER_LOCATION.approximated_longitude
        },
        [CELLPHONES_EXTRA_FIELDS_NAME]: {
          object_type: {
            id: null,
          },
          brand: null,
          model: null,
        },
        [FASHION_EXTRA_FIELDS_NAME]: {
          object_type: {
            id: null,
          },
          brand: null,
          size: {
            id: null,
          },
          gender: null,
        }
      });
    });

    it('should submit form', fakeAsync(() => {
      expect(component.onSubmit).toHaveBeenCalled();
    }));
  });

  describe('Select Urgent', () => {
    it('should set as urgent when checkbox is selected', () => {
      component.selectUrgent(true);

      expect(component.isUrgent).toBeTruthy();
    });
    it('should set as not urgent when checkbox is unselected', () => {
      component.selectUrgent(false);

      expect(component.isUrgent).toBeFalsy();
    });
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
        const brandModelObj: BrandModel = { brand: 'Apple', model: 'iPhone 11 Pro' };

        component.autoCompleteCellphonesModel(brandModelObj);

        expect(component.uploadForm.value[CELLPHONES_EXTRA_FIELDS_NAME].brand).toEqual('Apple');
        expect(component.uploadForm.value[CELLPHONES_EXTRA_FIELDS_NAME].model).toEqual('iPhone 11 Pro');
      });
    });
  });

  describe('resetCellphonesExtraFields', () => {
    it('should reset the brand to the default value', () => {
      component.uploadForm.patchValue({
        [CELLPHONES_EXTRA_FIELDS_NAME]: {
          brand: 'Apple'
        }
      })

      component.resetCellphonesExtraFields();

      expect(component.uploadForm.value[CELLPHONES_EXTRA_FIELDS_NAME].brand).toBeNull();
    });

    it('should reset the model to the default value', () => {
      component.uploadForm.patchValue({
        [CELLPHONES_EXTRA_FIELDS_NAME]: {
          model: 'iPhone'
        }
      })

      component.resetCellphonesExtraFields();

      expect(component.uploadForm.value[CELLPHONES_EXTRA_FIELDS_NAME].model).toBeNull();
    });
  });

  describe('resetFashionExtraFields', () => {
    it('should reset the brand to the default value', () => {
      component.uploadForm.patchValue({
        [FASHION_EXTRA_FIELDS_NAME]: {
          brand: 'Zara'
        }
      })

      component.resetFashionExtraFields();

      expect(component.uploadForm.value[FASHION_EXTRA_FIELDS_NAME].brand).toBeNull();
    });

    it('should reset the size to the default value', () => {
      component.uploadForm.patchValue({
        [FASHION_EXTRA_FIELDS_NAME]: {
          size: {
            id: 1
          }
        }
      })

      component.resetFashionExtraFields();

      expect(component.uploadForm.value[FASHION_EXTRA_FIELDS_NAME].size.id).toBeNull();
    });

    it('should get sizes for the new options', () => {
      spyOn(component, 'getSizes');

      component.resetFashionExtraFields();

      expect(component.getSizes).toHaveBeenCalled();
    });
  });

});
