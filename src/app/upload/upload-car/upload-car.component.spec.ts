import { EVENT_TYPES } from '../../core/analytics/resources/analytics-constants';
import { MockAnalyticsService } from './../../../tests/analytics.fixtures.spec';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { UploadCarComponent } from './upload-car.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CarSuggestionsService } from './car-suggestions.service';
import { Observable } from 'rxjs';
import { CarKeysService } from './car-keys.service';
import { Router } from '@angular/router';
import {
  CAR_BODY_TYPES, CAR_BRANDS, CAR_INFO, CAR_MODELS, CAR_VERSIONS, CAR_YEARS,
  MOCK_CAR
} from '../../../tests/car.fixtures.spec';
import { NgbModal, NgbPopoverConfig, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { PreviewModalComponent } from '../preview-modal/preview-modal.component';
import { MOCK_ITEM_V3, UPLOAD_FORM_CAR_VALUES } from '../../../tests/item.fixtures.spec';
import { TrackingService } from '../../core/tracking/tracking.service';
import { ErrorsService } from '../../core/errors/errors.service';
import { User } from '../../core/user/user';
import { IMAGE, USER_ID } from '../../../tests/user.fixtures.spec';
import { TEST_HTTP_PROVIDERS } from '../../../tests/utils.spec';
import { MockTrackingService } from '../../../tests/tracking.fixtures.spec';
import { Car } from '../../core/item/car';
import { CARS_CATEGORY } from '../../core/item/item-categories';
import { ItemService } from '../../core/item/item.service';
import { AnalyticsService } from '../../core/analytics/analytics.service';
import { UserService } from '../../core/user/user.service';
import { SCREENS_IDS } from '../../core/analytics/resources/analytics-constants';
import { ANALYTICS_EVENT_NAMES } from '../../core/analytics/resources/analytics-event-names';
import { EditItemCar } from '../../core/analytics/events-interfaces/edit-item-car.interface';
import { ListItemCar } from '../../core/analytics/events-interfaces/list-item-car.interface';
import { CarContent } from '../../core/item/item-response.interface';
import { SubscriptionsService } from '../../core/subscriptions/subscriptions.service';
import { MockSubscriptionService } from '../../../tests/subscriptions.fixtures.spec';

export const MOCK_USER_NO_LOCATION: User = new User(USER_ID);

describe('UploadCarComponent', () => {
  let component: UploadCarComponent;
  let fixture: ComponentFixture<UploadCarComponent>;
  let carSuggestionsService: CarSuggestionsService;
  let carKeysService: CarKeysService;
  let errorService: ErrorsService;
  let router: Router;
  let modalService: NgbModal;
  let trackingService: TrackingService;
  let analyticsService: AnalyticsService;
  let itemService: ItemService;
  const componentInstance: any = {
    getBodyType: jasmine.createSpy('getBodyType')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgbPopoverModule],
      providers: [
        FormBuilder,
        TEST_HTTP_PROVIDERS,
        NgbPopoverConfig,
        { provide: TrackingService, useClass: MockTrackingService },
        { provide: AnalyticsService, useClass: MockAnalyticsService },
        {
          provide: UserService, useValue: {
            isProfessional() {
              return Observable.of(false);
            },
            isProUser() {
              return Observable.of(false);
            }
          }
        },
        {
          provide: CarSuggestionsService, useValue: {
            getBrands() {
              return Observable.of({});
            },
            getYears() {
              return Observable.of({});
            },
            getModels() {
              return Observable.of({});
            },
            getVersions() {
              return Observable.of({});
            }
          }
        },
        {
          provide: CarKeysService, useValue: {
            getTypes() {
              return Observable.of({});
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
          provide: ItemService, useValue: {
            getCarInfo() {
              return Observable.of(CAR_INFO);
            }
          }
        },
        {
          provide: SubscriptionsService, useClass: MockSubscriptionService
        }
      ],
      declarations: [UploadCarComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadCarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    carSuggestionsService = TestBed.get(CarSuggestionsService);
    carKeysService = TestBed.get(CarKeysService);
    errorService = TestBed.get(ErrorsService);
    router = TestBed.get(Router);
    modalService = TestBed.get(NgbModal);
    trackingService = TestBed.get(TrackingService);
    analyticsService = TestBed.get(AnalyticsService);
    itemService = TestBed.get(ItemService);
  });

  describe('ngOnInit', () => {
    it('should call getBrands and getCarTypes', () => {
      spyOn<any>(component, 'getBrands');
      spyOn<any>(component, 'getCarTypes');
      component.ngOnInit();
      expect(component['getBrands']).toHaveBeenCalled();
      expect(component['getCarTypes']).toHaveBeenCalled();
    });

    describe('edit mode', () => {

      it('should set form value', () => {
        spyOn<any>(component, 'getModels').and.callThrough();
        spyOn<any>(component, 'getYears').and.callThrough();
        spyOn<any>(component, 'getVersions').and.callThrough();
        component.item = MOCK_CAR;

        component.ngOnInit();

        expect(component.uploadForm.value).toEqual({
          id: MOCK_CAR.id,
          title: MOCK_CAR.title,
          sale_price: MOCK_CAR.salePrice,
          financed_price: MOCK_CAR.salePrice,
          currency_code: MOCK_CAR.currencyCode,
          storytelling: MOCK_CAR.description,
          sale_conditions: MOCK_CAR.saleConditions,
          category_id: MOCK_CAR.categoryId.toString(),
          num_seats: MOCK_CAR.numSeats,
          num_doors: MOCK_CAR.numDoors,
          body_type: MOCK_CAR.bodyType,
          km: MOCK_CAR.km,
          engine: MOCK_CAR.engine,
          gearbox: MOCK_CAR.gearbox,
          horsepower: MOCK_CAR.horsepower,
          brand: MOCK_CAR.brand,
          model: MOCK_CAR.model,
          year: MOCK_CAR.year.toString(),
          version: MOCK_CAR.version,
          images: [],
          location: {
            address: '',
            latitude: '',
            longitude: ''
          }
        });
        expect(component['getModels']).toHaveBeenCalledWith(MOCK_CAR.brand, true);
        expect(component['getYears']).toHaveBeenCalledWith(MOCK_CAR.model, true);
        expect(component['getVersions']).toHaveBeenCalledWith(MOCK_CAR.year.toString(), true);
      });

      it('should set settingItem to true', () => {
        component.item = MOCK_CAR;
        spyOn<any>(component, 'getModels');
        spyOn<any>(component, 'getYears');
        spyOn<any>(component, 'getVersions');

        component.ngOnInit();

        expect(component['settingItem']).toBe(true);
      });

      it('should emit changed event if form values changes', () => {
        let formChanged: boolean;
        component.item = MOCK_CAR;
        component.onFormChanged.subscribe((value: boolean) => {
          formChanged = value;
        });
        component.ngOnInit();
        component.uploadForm.get('images').patchValue([IMAGE]);

        component.uploadForm.get('title').patchValue('new title');
        fixture.detectChanges();

        expect(formChanged).toBeTruthy();
      });
    });
  });

  describe('getBrands', () => {
    it('should get and set brands', () => {
      spyOn(carSuggestionsService, 'getBrands').and.returnValue(Observable.of(CAR_BRANDS));

      component['getBrands']();

      expect(carSuggestionsService.getBrands).toHaveBeenCalled();
      expect(component.brands).toEqual(CAR_BRANDS);
      expect(component.uploadForm.get('brand').pristine).toBeTruthy();
    });
  });

  describe('getCarTypes', () => {
    it('should get and set types', () => {
      spyOn(carKeysService, 'getTypes').and.returnValue(Observable.of(CAR_BODY_TYPES));

      component['getCarTypes']();

      expect(carKeysService.getTypes).toHaveBeenCalled();
      expect(component.carTypes).toEqual(CAR_BODY_TYPES);
      expect(component.uploadForm.get('body_type').pristine).toBeTruthy();
    });
  });

  describe('getModels', () => {
    it('should get and set models', () => {
      spyOn(carSuggestionsService, 'getModels').and.returnValue(Observable.of(CAR_MODELS));

      component.getModels('Abarth');

      expect(carSuggestionsService.getModels).toHaveBeenCalledWith('Abarth');
      expect(component.models).toEqual(CAR_MODELS);
      expect(component.uploadForm.get('model').pristine).toBeTruthy();
      expect(component.uploadForm.get('model').enabled).toBeTruthy();
      expect(component.uploadForm.get('model').value).toBe('');
      expect(component.uploadForm.get('year').pristine).toBeTruthy();
      expect(component.uploadForm.get('year').disabled).toBeTruthy();
      expect(component.uploadForm.get('year').value).toBe('');
      expect(component.uploadForm.get('version').pristine).toBeTruthy();
      expect(component.uploadForm.get('version').disabled).toBeTruthy();
      expect(component.uploadForm.get('version').value).toBe('');
      expect(component.uploadForm.get('title').value).toBe('');
      expect(component.uploadForm.get('title').pristine).toBeTruthy();
    });

    it('should set the car as custom if there are no models returned', () => {
      spyOn(carSuggestionsService, 'getModels').and.returnValue(Observable.of([]));

      component.getModels('Gaudi');

      expect(component.models.length).toBe(0);
      expect(component.customMake).toBe(true);
    });

    it('should call resetTitle if settingItem is false', () => {
      component['settingItem'] = false;
      spyOn<any>(component, 'resetTitle');

      component.getModels('Gaudi');

      expect(component['resetTitle']).toHaveBeenCalled();
    });
  });

  describe('getYears', () => {
    it('should get and set years', () => {
      spyOn(carSuggestionsService, 'getYears').and.returnValue(Observable.of(CAR_YEARS));
      component.uploadForm.get('brand').patchValue('Abarth');

      component.getYears('Spider');

      expect(carSuggestionsService.getYears).toHaveBeenCalledWith('Abarth', 'Spider');
      expect(component.years).toEqual(CAR_YEARS);
      expect(component.uploadForm.get('year').pristine).toBeTruthy();
      expect(component.uploadForm.get('year').enabled).toBeTruthy();
      expect(component.uploadForm.get('year').value).toBe('');
      expect(component.uploadForm.get('version').pristine).toBeTruthy();
      expect(component.uploadForm.get('version').disabled).toBeTruthy();
      expect(component.uploadForm.get('version').value).toBe('');
      expect(component.uploadForm.get('title').value).toBe('');
      expect(component.uploadForm.get('title').pristine).toBeTruthy();
    });

    it('should call resetTitle if settingItem is false', () => {
      component['settingItem'] = false;
      spyOn<any>(component, 'resetTitle');

      component.getYears('Spider');

      expect(component['resetTitle']).toHaveBeenCalled();
    });
  });

  describe('getVersions', () => {
    it('should get and set versions', () => {
      spyOn(carSuggestionsService, 'getVersions').and.returnValue(Observable.of(CAR_VERSIONS));
      component.uploadForm.get('brand').patchValue('Abarth');
      component.uploadForm.get('model').patchValue('Spider');
      component.uploadForm.get('year').patchValue('2017');

      component.getVersions('2017');

      expect(carSuggestionsService.getVersions).toHaveBeenCalledWith('Abarth', 'Spider', '2017');
      expect(component.versions).toEqual(CAR_VERSIONS);
      expect(component.uploadForm.get('version').pristine).toBeTruthy();
      expect(component.uploadForm.get('version').enabled).toBeTruthy();
      expect(component.uploadForm.get('version').value).toBe('');
      expect(component.uploadForm.get('title').value).toBe('Abarth Spider 2017');
      expect(component.uploadForm.get('title').dirty).toBeTruthy();
    });

    it('should call setTitle if settingItem is false', () => {
      component['settingItem'] = false;
      spyOn<any>(component, 'setTitle');

      component.getVersions('2017');

      expect(component['setTitle']).toHaveBeenCalled();
    });

    it('should set settingItem to false', () => {
      component['settingItem'] = true;

      component.getVersions('2017');

      expect(component['settingItem']).toBe(false);
    });
  });

  describe('onSubmit', () => {
    it('should has category set by default', () => {
      expect(component.uploadForm.get('category_id').value).toBe(CARS_CATEGORY);
    });

    it('should emit uploadEvent if form is valid', () => {
      let input: any;
      component.uploadForm.patchValue(UPLOAD_FORM_CAR_VALUES);
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

      expect(component.uploadForm.get('model').dirty).toBeTruthy();
      expect(component.uploadForm.get('brand').dirty).toBeTruthy();
      expect(component.uploadForm.get('title').dirty).toBeTruthy();
      expect(component.uploadForm.get('year').dirty).toBeTruthy();
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

    it('should not accept km < 0', () => {
      component.uploadForm.get('km').patchValue(-1);

      expect(component.uploadForm.valid).toBeFalsy();
    });

    it('should not accept km > 999999999', () => {
      component.uploadForm.get('km').patchValue(9999999999);

      expect(component.uploadForm.valid).toBeFalsy();
    });

    it('should not accept num_seats < 0', () => {
      component.uploadForm.get('num_seats').patchValue(-1);

      expect(component.uploadForm.valid).toBeFalsy();
    });

    it('should not accept num_seats > 99', () => {
      component.uploadForm.get('num_seats').patchValue(100);

      expect(component.uploadForm.valid).toBeFalsy();
    });
  });

  describe('onUploaded', () => {
    const MOCK_RESPONSE_CONTENT: CarContent = {
      id: MOCK_CAR.id,
      category_id: MOCK_CAR.categoryId,
      sale_price: MOCK_CAR.salePrice,
      title: MOCK_CAR.title,
      description: MOCK_CAR.description,
      modified_date: MOCK_CAR.modifiedDate,
      flags: MOCK_CAR.flags,
      seller_id: 'ukd73df',
      web_slug: MOCK_CAR.webSlug,
      brand: MOCK_CAR.brand,
      model: MOCK_CAR.model,
      body_type: MOCK_CAR.bodyType,
      km: MOCK_CAR.km,
      year: MOCK_CAR.year,
      engine: MOCK_CAR.engine,
      gearbox: MOCK_CAR.gearbox,
      horsepower: MOCK_CAR.horsepower,
      num_doors: MOCK_CAR.numDoors
    }
    const uploadedEvent = {
      action: 'updated',
      response: MOCK_RESPONSE_CONTENT
    };
    it('should redirect', () => {
      component.item = <Car>MOCK_ITEM_V3;
      component.item.flags.onhold = null;
      spyOn(router, 'navigate');

      component.onUploaded(uploadedEvent);

      expect(router.navigate).toHaveBeenCalledWith(['/catalog/list', { [uploadedEvent.action]: true, itemId: uploadedEvent.response.id }]);
    });

    it('should redirect with onHold true', () => {
      component.item = <Car>MOCK_ITEM_V3;
      component.item.flags.onhold = true;
      spyOn(router, 'navigate');

      component.onUploaded(uploadedEvent);

      expect(router.navigate).toHaveBeenCalledWith(['/catalog/list', { [uploadedEvent.action]: true, itemId: uploadedEvent.response.id, onHold: true }]);
    });

    it('should set action as urgent if item is urgent and product not on hold', () => {
      component.isUrgent = true;
      spyOn(router, 'navigate');

      component.onUploaded(uploadedEvent);

      expect(router.navigate).toHaveBeenCalledWith(['/catalog/list', { urgent: true, itemId: uploadedEvent.response.id }]);
    });

    describe('if it`s a item modification', () => {
      it('should send the Edit Item Car tracking event', () => {
        component.item = MOCK_CAR;
        const editEvent: any = {
          action: 'update',
          response: {
            id: MOCK_CAR.id,
            type: 'edit'
          }
        }
        const editResponse: CarContent = MOCK_RESPONSE_CONTENT;
        const trackingAttrs: EditItemCar = {
          itemId: MOCK_CAR.id,
          categoryId: MOCK_CAR.categoryId,
          salePrice: MOCK_CAR.salePrice,
          title: MOCK_CAR.title,
          screenId: SCREENS_IDS.EditItem,
          brand: MOCK_CAR.brand,
          model: MOCK_CAR.model,
          bodyType: MOCK_CAR.bodyType,
          km: MOCK_CAR.km,
          year: MOCK_CAR.year,
          engine: MOCK_CAR.engine,
          gearbox: MOCK_CAR.gearbox,
          hp: MOCK_CAR.horsepower,
          numDoors: MOCK_CAR.numDoors,
          isCarDealer: false,
          isPro: false
        }
        editEvent.response = editResponse;
        spyOn(analyticsService, 'trackEvent');

        component.ngOnInit();
        component.onUploaded(editEvent);

        expect(analyticsService.trackEvent).toHaveBeenCalledWith({
          name: ANALYTICS_EVENT_NAMES.EditItemCar,
          eventType: EVENT_TYPES.Other,
          attributes: trackingAttrs
        });
      });
    });

    describe('if it`s a item upload', () => {
      it('should send the List Item Car tracking event', () => {
        const uploadEvent: any = {
          action: 'create',
          response: {
            id: MOCK_CAR.id,
            type: 'upload'
          }
        }
        const uploadResponse: CarContent = MOCK_RESPONSE_CONTENT;
        const trackingAttrs: ListItemCar = {
          itemId: MOCK_CAR.id,
          categoryId: MOCK_CAR.categoryId,
          salePrice: MOCK_CAR.salePrice,
          title: MOCK_CAR.title,
          screenId: SCREENS_IDS.Upload,
          brand: MOCK_CAR.brand,
          model: MOCK_CAR.model,
          bodyType: MOCK_CAR.bodyType,
          km: MOCK_CAR.km,
          year: MOCK_CAR.year,
          engine: MOCK_CAR.engine,
          gearbox: MOCK_CAR.gearbox,
          hp: MOCK_CAR.horsepower,
          numDoors: MOCK_CAR.numDoors,
          isCarDealer: false,
          isPro: false
        }
        uploadEvent.response = uploadResponse;
        spyOn(analyticsService, 'trackEvent');

        component.ngOnInit();
        component.onUploaded(uploadEvent);

        expect(analyticsService.trackEvent).toHaveBeenCalledWith({
          name: ANALYTICS_EVENT_NAMES.ListItemCar,
          eventType: EVENT_TYPES.Other,
          attributes: trackingAttrs
        });
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

  describe('preview', () => {
    beforeEach(fakeAsync(() => {
      spyOn(modalService, 'open').and.callThrough();
      spyOn(component, 'onSubmit');
      component.uploadForm.get('model').enable();
      component.uploadForm.get('year').enable();
      component.uploadForm.get('version').enable();
      component.uploadForm.patchValue(UPLOAD_FORM_CAR_VALUES);
      component.preview();
    }));

    it('should open modal', () => {
      expect(modalService.open).toHaveBeenCalledWith(PreviewModalComponent, {
        windowClass: 'preview'
      });
    });
    it('should set itemPreview', () => {
      expect(componentInstance.itemPreview).toEqual(UPLOAD_FORM_CAR_VALUES);
    });
    it('should submit form', fakeAsync(() => {
      tick();

      expect(component.onSubmit).toHaveBeenCalled();
    }));
    it('should call getBodyType', () => {
      expect(componentInstance.getBodyType).toHaveBeenCalled();
    });
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

  describe('Emit Location', () => {
    let categoryId: number;

    it('should emit location updated event', () => {
      component.locationSelected.subscribe((s: number) => {
        categoryId = s;
      });

      component.emitLocation();

      expect(categoryId).toBe(100);
    });
  });

  describe('toggleCustomMakeSelection', () => {
    it('should set customMake true and enable other fields', () => {
      component.uploadForm.get('brand').patchValue('test');
      component.uploadForm.get('model').disable();
      component.uploadForm.get('year').disable();
      component.uploadForm.get('version').disable();
      component.customVersion = true;

      component.toggleCustomMakeSelection();

      expect(component.customMake).toBe(true);
      expect(component.uploadForm.get('brand').value).toBe('');
      expect(component.uploadForm.get('model').enabled).toBeTruthy();
      expect(component.uploadForm.get('year').enabled).toBeTruthy();
      expect(component.uploadForm.get('version').enabled).toBeTruthy();
      expect(component.customVersion).toBe(true);
    });

    it('should set customMake false and disable other fields', () => {
      component.uploadForm.get('brand').patchValue('test');
      component.uploadForm.get('model').enable();
      component.uploadForm.get('year').enable();
      component.uploadForm.get('version').enable();
      component.customMake = true;
      component.customVersion = false;

      component.toggleCustomMakeSelection();

      expect(component.customMake).toBe(false);
      expect(component.uploadForm.get('brand').value).toBe('');
      expect(component.uploadForm.get('model').disabled).toBeTruthy();
      expect(component.uploadForm.get('year').disabled).toBeTruthy();
      expect(component.uploadForm.get('version').disabled).toBeTruthy();
      expect(component.customVersion).toBe(true);
    });
  });

  describe('getInfo', () => {
    it('should call getCarInfo and set it if in creation mode', () => {
      spyOn(itemService, 'getCarInfo').and.callThrough();
      const BRAND = 'brand';
      const MODEL = 'model';
      const VERSION = 'version';
      component.uploadForm.get('brand').setValue(BRAND);
      component.uploadForm.get('model').setValue(MODEL);

      component.getInfo(VERSION);

      expect(itemService.getCarInfo).toHaveBeenCalledWith(BRAND, MODEL, VERSION);
      Object.keys(CAR_INFO).forEach((field) => {
        expect(component.uploadForm.get(field).value).toEqual(CAR_INFO[field]);
      })
    });
  });

  describe('toggleCustomVersionSelection', () => {
    it('should not toggle the version value if its true and disable the field', () => {
      component.customVersion = true;
      component.uploadForm.get('version').enable();

      component.toggleCustomVersionSelection();

      expect(component.customVersion).toBe(false);
      expect(component.uploadForm.get('version').disabled).toBeFalsy();
    });

    it('should toggle the version value and enable the field', () => {
      component.customVersion = false;
      component.uploadForm.get('version').disable();

      component.toggleCustomVersionSelection();

      expect(component.customVersion).toBe(true);
      expect(component.uploadForm.get('version').enabled).toBeTruthy();
    });
  });

});
