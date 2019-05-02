import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NgbModal, NgbPopoverConfig, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { UploadProductComponent } from './upload-product.component';
import { CategoryService } from '../../core/category/category.service';
import { CATEGORIES_OPTIONS, CATEGORIES_OPTIONS_CONSUMER_GOODS } from '../../../tests/category.fixtures.spec';
import { PreviewModalComponent } from '../preview-modal/preview-modal.component';
import { TrackingService } from '../../core/tracking/tracking.service';
import { ErrorsService } from '../../core/errors/errors.service';
import { User } from '../../core/user/user';
import { MOCK_USER, USER_ID } from '../../../tests/user.fixtures.spec';
import { TEST_HTTP_PROVIDERS } from '../../../tests/utils.spec';
import { MockTrackingService } from '../../../tests/tracking.fixtures.spec';
import { ITEM_CATEGORY_ID, ITEM_DATA, ITEM_DELIVERY_INFO, MOCK_ITEM } from '../../../tests/item.fixtures.spec';
import { Item } from '../../core/item/item';
import { UserLocation } from '../../core/user/user-response.interface';
import { environment } from '../../../environments/environment';
import { REALESTATE_CATEGORY } from '../../core/item/item-categories';
import { GeneralSuggestionsService } from './general-suggestions.service';
import { CategoryOption } from '../../core/category/category-response.interface';
import { SplitTestService } from '../../core/tracking/split-test.service';

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
  const componentInstance: any = {};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgbPopoverModule],
      providers: [
        FormBuilder,
        NgbPopoverConfig,
        TEST_HTTP_PROVIDERS,
        { provide: TrackingService, useClass: MockTrackingService },
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
        extra_info: {
          object_type: {
            id: null
          },
          brand: null,
          model: null
        }
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

  describe('ngOnChanges', () => {
    it('should get and set categories', () => {
      spyOn(categoryService, 'isHeroCategory').and.returnValues(false, false, false, true, true);
      component.ngOnChanges();
      expect(categoryService.getUploadCategories).toHaveBeenCalled();
      expect(component.categories).toEqual(CATEGORIES_OPTIONS_CONSUMER_GOODS);
    });

    describe('with preselected category', () => {
      beforeEach(() => {
        component.categoryId = REALESTATE_CATEGORY;
        component.ngOnChanges();
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

        component.ngOnChanges();

        expect(component.fixedCategory).toBe('Real Estate');
      });

      it('should should call onCategoryChange', () => {
        spyOn(component, 'onCategoryChange');
        component.item = new Item(
          ITEM_DATA.id,
          ITEM_DATA.legacy_id,
          ITEM_DATA.owner,
          ITEM_DATA.title,
          ITEM_DATA.description,
          13000
        );

        component.ngOnChanges();

        expect(component.onCategoryChange).toHaveBeenCalled();
      });
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

      expect(component.uploadForm.valid).toBeTruthy();
      component.uploadEvent.subscribe((i: any) => {
        input = i;
      });
      component.onSubmit();
      expect(input).toEqual({
        type: 'create',
        values: component.uploadForm.value
      });
      expect(component.loading).toBeTruthy();
    });

    it('should set dirty invalid fields', () => {
      component.onSubmit();

      expect(component.uploadForm.get('title').dirty).toBeTruthy();
      expect(component.uploadForm.get('sale_price').dirty).toBeTruthy();
      expect(component.uploadForm.get('location.address').dirty).toBeTruthy();
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

    it('should delete the extra_info object if the selected category doesn`t accept brand and model', () => {
      component.uploadForm.get('category_id').patchValue('12463');
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

      component.onSubmit();

      expect(component.uploadForm.value.extra_info).toBeUndefined();
    });

  });

  describe('onCategoryChange', () => {
    const MOCK_CATEGORY_OPTION_1: CategoryOption = {
      value: '16000',
      label: 'label',
      icon_id: '1',
      object_type_title: 'title',
      has_object_type: true,
      has_brand: true,
      has_model: true
    };

    const MOCK_CATGORY_OPTION_2: CategoryOption = {
      value: '12463',
      label: 'label',
      icon_id: '1',
      object_type_title: 'title',
      has_object_type: true,
      has_brand: true,
      has_model: true
    };

    describe('if the selected category allows brand/model fields', () => {
      it('should show the form extra fields', () => {
        component.onCategoryChange(MOCK_CATEGORY_OPTION_1);

        expect(component.extraInfoEnabled).toBe(true);
      });
    });
  });

  describe('getBrands', () => {
    beforeEach(() => {
      component.uploadForm.value.extra_info.object_type.id = '365';
      component.uploadForm.value.category_id = '16000';
    });

    it('should get the brands for the provided keyword', () => {
      spyOn(generalSuggestionsService, 'getBrands').and.callThrough();

      component.getBrands('Apple');

      expect(generalSuggestionsService.getBrands).toHaveBeenCalledWith('Apple', '16000', '365');
    });

    it('should get brands and models if the brand endpoint doesn`t return any result', () => {
      spyOn(generalSuggestionsService, 'getBrandsAndModels').and.callThrough();

      component.getBrands('Apple');

      expect(generalSuggestionsService.getBrandsAndModels).toHaveBeenCalledWith('Apple', '16000', '365');
    });
  });

  describe('getModels', () => {
    beforeEach(() => {
      component.uploadForm.value.category_id = '16000';
      component.uploadForm.value.extra_info.object_type.id = '365';
      component.uploadForm.value.extra_info.brand = 'Apple';
    });

    it('should get the models for the provided keyword and the selected brand', () => {
      spyOn(generalSuggestionsService, 'getModels').and.callThrough();

      component.getModels('iPhone');

      expect(generalSuggestionsService.getModels).toHaveBeenCalledWith('iPhone', '16000', 'Apple', '365');
    });
  });

  describe('selectBrandOrModel', () => {
    describe('when reciving a string', () => {
      it('should select the brand', () => {
        component.selectBrandOrModel('Apple', 'brand');

        expect(component.uploadForm.value.extra_info.brand).toEqual('Apple');
      });

      it('should select the model', () => {
        component.selectBrandOrModel('iPhone', 'model');

        expect(component.uploadForm.value.extra_info.model).toEqual('iPhone');
      });
    });

    describe('when reciving an object', () => {
      it('should select the brand and model', () => {
        component.selectBrandOrModel({ brand: 'Apple', model: 'iPhone XSX' }, null);

        expect(component.uploadForm.value.extra_info.brand).toEqual('Apple');
        expect(component.uploadForm.value.extra_info.model).toEqual('iPhone XSX');
      });

      it('should select the brand', () => {
        component.selectBrandOrModel({ brand: 'Apple' }, null);

        expect(component.uploadForm.value.extra_info.brand).toEqual('Apple');
        expect(component.uploadForm.value.extra_info.model).toBe(null);
      });

      it('should select the model', () => {
        component.selectBrandOrModel({ model: 'iPhone XSX' }, null);

        expect(component.uploadForm.value.extra_info.brand).toBe(null);
        expect(component.uploadForm.value.extra_info.model).toEqual('iPhone XSX');
      });
    });
  });

  describe('onUploaded', () => {
    const uploadedEvent = {
      action: 'updated',
      response: {
        id: '1'
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

    it('should send the Taplytics `UploadCompleted` event if the category allow extra fields', () => {
      spyOn(splitTestService, 'track');

      component.uploadForm.value.category_id = '16000';
      component.onUploaded(uploadedEvent);

      expect(splitTestService.track).toHaveBeenCalledWith('UploadCompleted');
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
          object_type: {
            id: null
          },
          brand: null,
          model: null
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

  describe('Set category', () => {
    let categoryId: number;

    it('should emit category select event', () => {
      component.onCategorySelect.subscribe((s: number) => {
        categoryId = s;
      });

      component.setCategory(ITEM_CATEGORY_ID);

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

});
