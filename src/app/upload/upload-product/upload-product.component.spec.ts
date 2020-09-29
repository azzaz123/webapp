import { MOCK_CONDITIONS } from './../../../tests/extra-info.fixtures.spec';
import { MOCK_ITEM_CELLPHONES } from './../../../tests/item.fixtures.spec';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { NgbModal, NgbPopoverConfig, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { UploadProductComponent } from './upload-product.component';
import { CategoryService } from '../../core/category/category.service';
import { CATEGORIES_OPTIONS_CONSUMER_GOODS, CATEGORIES_DATA_CONSUMER_GOODS, CATEGORY_DATA_WEB } from '../../../tests/category.fixtures.spec';
import { PreviewModalComponent } from '../preview-modal/preview-modal.component';
import { TrackingService } from '../../core/tracking/tracking.service';
import { ErrorsService } from '../../core/errors/errors.service';
import { User } from '../../core/user/user';
import { MOCK_USER, USER_ID } from '../../../tests/user.fixtures.spec';
import { MockTrackingService } from '../../../tests/tracking.fixtures.spec';
import { ITEM_CATEGORY_ID, ITEM_DATA, ITEM_DELIVERY_INFO, MOCK_ITEM, MOCK_ITEM_FASHION } from '../../../tests/item.fixtures.spec';
import { Item } from '../../core/item/item';
import { UserLocation } from '../../core/user/user-response.interface';
import { environment } from '../../../environments/environment';
import { REALESTATE_CATEGORY } from '../../core/item/item-categories';
import { GeneralSuggestionsService } from './general-suggestions.service';
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
import { CategoryOption } from 'app/core/category/category-response.interface';
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
  let modalService: NgbModal;
  let trackingService: TrackingService;
  let analyticsService: AnalyticsService;
  let deviceService: DeviceDetectorService;
  let userService: UserService;
  let categoryService: CategoryService;
  const componentInstance: any = {};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgbPopoverModule],
      providers: [
        FormBuilder,
        NgbPopoverConfig,
        { provide: TrackingService, useClass: MockTrackingService },
        { provide: AnalyticsService, useClass: MockAnalyticsService },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceMock },
        {
          provide: UserService, useValue: {
            isProUser() {
              return of(false);
            },
            isPro: false
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
            getCategories() {
              return of(CATEGORIES_DATA_CONSUMER_GOODS);
            }
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
          provide: GeneralSuggestionsService, useValue: {
            getObjectTypes() {
              return of({});
            },
            getBrands() {
              return of({});
            },
            getModels() {
              return of(['iPhone 2G', 'iPhone 3G', 'iPhone 4']);
            },
            getBrandsAndModels() {
              return of([{ brand: 'Apple', model: 'iPhone XSX' }, { brand: 'Samsung', model: 'Galaxy S20' }]);
            },
            getSizes() {
              return of({
                male: [{ id: 1, text: 'XXXS / 30 / 2' }],
                female: [{ id: 18, text: 'XS / 30-32 / 40-42' }]
              });
            },
            getConditions() {
              return of({ MOCK_CONDITIONS })
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
    errorService = TestBed.inject(ErrorsService);
    generalSuggestionsService = TestBed.inject(GeneralSuggestionsService);
    router = TestBed.inject(Router);
    modalService = TestBed.inject(NgbModal);
    trackingService = TestBed.inject(TrackingService);
    analyticsService = TestBed.inject(AnalyticsService);
    deviceService = TestBed.inject(DeviceDetectorService);
    userService = TestBed.inject(UserService);
    categoryService = TestBed.inject(CategoryService);
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
          longitude: ''
        },
        extra_info: {
          condition: null
        }
      });
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
              longitude: ''
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
              condition: null
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
            extra_info: {
              object_type: {
                id: MOCK_ITEM_CELLPHONES.extraInfo.object_type.id,
              },
              brand: MOCK_ITEM_CELLPHONES.extraInfo.brand,
              model: MOCK_ITEM_CELLPHONES.extraInfo.model,
              condition: null
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

  describe('when changing between categories', () => {
    describe('if the selected category is cellphones', () => {
      beforeEach(() => {
        component.uploadForm.patchValue({ category_id: CATEGORY_IDS.CELL_PHONES_ACCESSORIES });
      });

      it('should enable the object_type field', () => {
        expect(component.uploadForm.get('extra_info').get('object_type').disabled).toBe(false);
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
    });
    describe('if the selected category is fashion', () => {
      beforeEach(() => {
        component.uploadForm.patchValue({ category_id: CATEGORY_IDS.FASHION_ACCESSORIES });
      });

      it('should enable the object_type field', () => {
        expect(component.uploadForm.get('extra_info').get('object_type').disabled).toBe(false);
      });
      it('should enable the brand field', () => {
        expect(component.uploadForm.get('extra_info').get('brand').disabled).toBe(false);
      });
      it('should enable the size field', () => {
        expect(component.uploadForm.get('extra_info').get('size').disabled).toBe(false);
      });
      it('should enable the gender field', () => {
        expect(component.uploadForm.get('extra_info').get('gender').disabled).toBe(false);
      });
      it('should disable the model field', () => {
        expect(component.uploadForm.get('extra_info').get('model').disabled).toBe(true);
      });
    });

    describe('if the selected category is a consumer goods category', () => {
      beforeEach(() => {
        component.uploadForm.patchValue({ category_id: CATEGORY_IDS.COMPUTERS_ELECTRONICS });
      });

      it('should disable the object_type field', () => {
        expect(component.uploadForm.get('extra_info').get('object_type').disabled).toBe(true);
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
        extra_info: {
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
      component.uploadForm.get('extra_info').patchValue({
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
        editEvent.response = editResponse;
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
        uploadEvent.response = uploadResponse;
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
        extra_info: {
          condition: null
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

        expect(component.uploadForm.value.extra_info.brand).toEqual('Apple');
        expect(component.uploadForm.value.extra_info.model).toEqual('iPhone 11 Pro');
      });
    });
  });

  describe('resetCellphonesExtraFields', () => {
    it('should reset the brand to the default value', () => {
      component.uploadForm.patchValue({
        extra_info: {
          brand: 'Apple'
        }
      })

      component.resetCellphonesExtraFields();

      expect(component.uploadForm.value.extra_info.brand).toBeNull();
    });

    it('should reset the model to the default value', () => {
      component.uploadForm.patchValue({
        extra_info: {
          model: 'iPhone'
        }
      })

      component.resetCellphonesExtraFields();

      expect(component.uploadForm.value.extra_info.model).toBeNull();
    });
  });

  describe('resetFashionExtraFields', () => {
    it('should reset the brand to the default value', () => {
      component.uploadForm.patchValue({
        extra_info: {
          brand: 'Zara'
        }
      })

      component.resetFashionExtraFields();

      expect(component.uploadForm.value.extra_info.brand).toBeNull();
    });

    it('should reset the size to the default value', () => {
      component.uploadForm.patchValue({
        extra_info: {
          size: {
            id: 1
          }
        }
      })

      component.resetFashionExtraFields();

      expect(component.uploadForm.value.extra_info.size.id).toBeNull();
    });

    it('should get sizes for the new options', () => {
      spyOn(component, 'getSizes');

      component.resetFashionExtraFields();

      expect(component.getSizes).toHaveBeenCalled();
    });
  });

  describe('when getting the upload categories from the server', () => {
    it('should get value, label and icon from consumer goods categories', () => {
      spyOn(categoryService, 'getCategories').and.returnValue(of(CATEGORY_DATA_WEB));
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
        }
      ];

      component.ngOnInit();

      expect(component.categories).toEqual(expected);
    });
  });

  describe('when the category changes', () => {
    it('should reset category identifier field when the new category is "everything else" category', () => {
      component.categoryId = '-1';

      component.ngOnChanges({
        categoryId: new SimpleChange(null, component.categoryId, true)
      });
      fixture.detectChanges();

      expect(component.uploadForm.value.category_id).toEqual('');
    });

    it('should set the category field as the new one when the category is not "everything else" category', () => {
      component.categoryId = `${CATEGORY_IDS.GAMES_CONSOLES}`;

      component.ngOnChanges({
        categoryId: new SimpleChange(null, component.categoryId, true)
      });
      fixture.detectChanges();

      expect(component.uploadForm.value.category_id).toEqual(`${CATEGORY_IDS.GAMES_CONSOLES}`);
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

});
