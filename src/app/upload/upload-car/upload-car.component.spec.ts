import { MockAnalyticsService } from './../../../tests/analytics.fixtures.spec';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';

import { UploadCarComponent } from './upload-car.component';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CarSuggestionsService } from './car-suggestions.service';
import { of } from 'rxjs';
import { CarKeysService } from './car-keys.service';
import { Router } from '@angular/router';
import {
  CAR_BODY_TYPES,
  CAR_BRANDS,
  CAR_INFO,
  CAR_MODELS,
  CAR_VERSIONS,
  CAR_YEARS,
  MOCK_CAR,
} from '../../../tests/car.fixtures.spec';
import {
  NgbModal,
  NgbPopoverConfig,
  NgbPopoverModule,
} from '@ng-bootstrap/ng-bootstrap';
import { PreviewModalComponent } from '../preview-modal/preview-modal.component';
import {
  MOCK_ITEM_V3,
  UPLOAD_FORM_CAR_VALUES,
} from '../../../tests/item.fixtures.spec';
import { TrackingService } from '../../core/tracking/tracking.service';
import { ErrorsService } from '../../core/errors/errors.service';
import { User } from '../../core/user/user';
import { USER_ID } from '../../../tests/user.fixtures.spec';
import { MockTrackingService } from '../../../tests/tracking.fixtures.spec';
import { Car } from '../../core/item/car';
import { CARS_CATEGORY } from '../../core/item/item-categories';
import { ItemService } from '../../core/item/item.service';
import { AnalyticsService } from '../../core/analytics/analytics.service';
import { UserService } from '../../core/user/user.service';
import { CarContent } from '../../core/item/item-response.interface';
import { SubscriptionsService } from '../../core/subscriptions/subscriptions.service';
import { MockSubscriptionService } from '../../../tests/subscriptions.fixtures.spec';
import {
  ANALYTIC_EVENT_TYPES,
  ANALYTICS_EVENT_NAMES,
  SCREEN_IDS,
  AnalyticsEvent,
  EditItemCar,
  ListItemCar,
} from '../../core/analytics/analytics-constants';
import { By } from '@angular/platform-browser';

export const MOCK_USER_NO_LOCATION: User = new User(USER_ID);

describe('UploadCarComponent', () => {
  let component: UploadCarComponent;
  let fixture: ComponentFixture<UploadCarComponent>;
  let carSuggestionsService: CarSuggestionsService;
  let errorService: ErrorsService;
  let router: Router;
  let modalService: NgbModal;
  let trackingService: TrackingService;
  let analyticsService: AnalyticsService;
  let itemService: ItemService;
  let HTMLElement: DebugElement;
  const componentInstance: any = {
    getBodyType: jasmine.createSpy('getBodyType'),
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [NgbPopoverModule],
        providers: [
          FormBuilder,
          NgbPopoverConfig,
          { provide: TrackingService, useClass: MockTrackingService },
          { provide: AnalyticsService, useClass: MockAnalyticsService },
          {
            provide: UserService,
            useValue: {
              isProfessional() {
                return of(false);
              },
              isProUser() {
                return of(false);
              },
            },
          },
          {
            provide: CarSuggestionsService,
            useValue: {
              getBrands() {
                return of(CAR_BRANDS);
              },
              getYears() {
                return of(CAR_YEARS);
              },
              getModels() {
                return of(CAR_MODELS);
              },
              getVersions() {
                return of(CAR_VERSIONS);
              },
            },
          },
          {
            provide: CarKeysService,
            useValue: {
              getTypes() {
                return of(CAR_BODY_TYPES);
              },
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
            provide: ItemService,
            useValue: {
              getCarInfo() {
                return of(CAR_INFO);
              },
            },
          },
          {
            provide: SubscriptionsService,
            useClass: MockSubscriptionService,
          },
        ],
        declarations: [UploadCarComponent],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadCarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    carSuggestionsService = TestBed.inject(CarSuggestionsService);
    errorService = TestBed.inject(ErrorsService);
    router = TestBed.inject(Router);
    modalService = TestBed.inject(NgbModal);
    trackingService = TestBed.inject(TrackingService);
    analyticsService = TestBed.inject(AnalyticsService);
    itemService = TestBed.inject(ItemService);
    HTMLElement = fixture.debugElement;
  });

  describe('when the upload page is initialized', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should get brands for the brand selector', () => {
      expect(component.brands).toEqual(CAR_BRANDS);
    });

    it('should get body types for the body type selector', () => {
      expect(component.carTypes).toEqual(CAR_BODY_TYPES);
    });

    it('should initialize the upload form with default values', () => {
      expect(component.uploadForm.value).toEqual({
        id: '',
        category_id: CARS_CATEGORY,
        images: [],
        model: '',
        brand: '',
        title: '',
        year: '',
        sale_price: '',
        financed_price: '',
        currency_code: 'EUR',
        version: '',
        num_seats: '',
        num_doors: '',
        body_type: null,
        km: '',
        storytelling: '',
        engine: null,
        gearbox: null,
        horsepower: '',
        sale_conditions: {
          fix_price: false,
          exchange_allowed: false,
          shipping_allowed: false,
        },
        location: {
          address: '',
          latitude: '',
          longitude: '',
        },
      });
    });

    describe('when is an item edit', () => {
      beforeEach(() => {
        spyOn(carSuggestionsService, 'getModels').and.callThrough();
        spyOn(carSuggestionsService, 'getYears').and.callThrough();
        spyOn(carSuggestionsService, 'getVersions').and.callThrough();

        component.item = MOCK_CAR;

        component.ngOnInit();
      });

      it('should initialize the upload form with saved values', () => {
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
            longitude: '',
          },
        });
      });

      it('should get models belonging to the saved car brand', () => {
        component.onIsModelsNeeded();

        expect(carSuggestionsService.getModels).toHaveBeenCalledWith(
          MOCK_CAR.brand
        );
        expect(component.models).toEqual(CAR_MODELS);
      });

      it('should get years belonging to the saved car model', () => {
        component.onIsYearsNeeded();

        expect(carSuggestionsService.getYears).toHaveBeenCalledWith(
          MOCK_CAR.brand,
          MOCK_CAR.model
        );
        expect(component.years).toEqual(CAR_YEARS);
      });

      it('should get versions belonging to the saved car year', () => {
        expect(carSuggestionsService.getVersions).toHaveBeenCalledWith(
          MOCK_CAR.brand,
          MOCK_CAR.model,
          `${MOCK_CAR.year}`
        );
        expect(component.versions).toEqual(CAR_VERSIONS);
      });
    });
  });

  describe('when changing brand field', () => {
    it('should get the models belonging to that brand', () => {
      spyOn(carSuggestionsService, 'getModels').and.callThrough();

      component.ngOnInit();
      component.uploadForm.get('brand').patchValue(MOCK_CAR.brand);

      expect(carSuggestionsService.getModels).toHaveBeenCalledWith(
        MOCK_CAR.brand
      );
      expect(component.models).toEqual(CAR_MODELS);
    });

    it('should reset fields that depend on brand', () => {
      component.item = MOCK_CAR;

      component.ngOnInit();
      component.uploadForm.patchValue({ brand: 'New brand' });

      expect(component.uploadForm.value).toEqual({
        body_type: null,
        brand: 'New brand',
        category_id: `${MOCK_CAR.categoryId}`,
        currency_code: 'EUR',
        engine: null,
        financed_price: MOCK_CAR.financedPrice,
        gearbox: null,
        horsepower: null,
        id: MOCK_CAR.id,
        images: [],
        km: null,
        location: {
          address: '',
          latitude: '',
          longitude: '',
        },
        model: null,
        num_doors: null,
        num_seats: null,
        sale_conditions: {
          exchange_allowed: false,
          fix_price: false,
          shipping_allowed: false,
        },
        sale_price: MOCK_CAR.salePrice,
        storytelling: '',
        title: null,
        version: null,
        year: null,
      });
    });
  });

  describe('when changing model field', () => {
    it('should get the years in which that model was built', () => {
      spyOn(carSuggestionsService, 'getYears').and.callThrough();
      component.ngOnInit();

      component.uploadForm.get('brand').patchValue(MOCK_CAR.brand);
      component.uploadForm.get('model').patchValue(MOCK_CAR.model);

      expect(carSuggestionsService.getYears).toHaveBeenCalledWith(
        MOCK_CAR.brand,
        MOCK_CAR.model
      );
      expect(component.years).toEqual(CAR_YEARS);
    });

    it('should reset fields that depend on model', () => {
      component.item = MOCK_CAR;

      component.ngOnInit();
      component.uploadForm.patchValue({ model: 'New model' });

      expect(component.uploadForm.value).toEqual({
        body_type: null,
        brand: MOCK_CAR.brand,
        category_id: `${MOCK_CAR.categoryId}`,
        currency_code: 'EUR',
        engine: null,
        financed_price: MOCK_CAR.financedPrice,
        gearbox: null,
        horsepower: null,
        id: MOCK_CAR.id,
        images: [],
        km: null,
        location: {
          address: '',
          latitude: '',
          longitude: '',
        },
        model: 'New model',
        num_doors: null,
        num_seats: null,
        sale_conditions: {
          exchange_allowed: false,
          fix_price: false,
          shipping_allowed: false,
        },
        sale_price: MOCK_CAR.salePrice,
        storytelling: '',
        title: null,
        version: null,
        year: null,
      });
    });
  });

  describe('when changing year field', () => {
    beforeEach(() => {
      spyOn(carSuggestionsService, 'getVersions').and.callThrough();
      component.ngOnInit();

      component.uploadForm.get('brand').patchValue(MOCK_CAR.brand);
      component.uploadForm.get('model').patchValue(MOCK_CAR.model);
      component.uploadForm.get('year').patchValue(MOCK_CAR.year);
    });

    it('should get the versions belonging to that year', () => {
      expect(carSuggestionsService.getVersions).toHaveBeenCalledWith(
        MOCK_CAR.brand,
        MOCK_CAR.model,
        MOCK_CAR.year
      );
      expect(component.versions).toEqual(CAR_VERSIONS);
    });

    it('should autocomplete the form title with car brand, model and year', () => {
      const title = component.uploadForm.get('title').value;
      const expectedTitle = `${MOCK_CAR.brand} ${MOCK_CAR.model} ${MOCK_CAR.year}`;

      expect(title).toEqual(expectedTitle);
    });

    it('should reset fields that depend on year', () => {
      component.item = MOCK_CAR;

      component.ngOnInit();
      component.uploadForm.patchValue({ year: 2016 });

      expect(component.uploadForm.value).toEqual({
        body_type: null,
        brand: MOCK_CAR.brand,
        category_id: `${MOCK_CAR.categoryId}`,
        currency_code: 'EUR',
        engine: null,
        financed_price: MOCK_CAR.financedPrice,
        gearbox: null,
        horsepower: null,
        id: MOCK_CAR.id,
        images: [],
        km: null,
        location: {
          address: '',
          latitude: '',
          longitude: '',
        },
        model: MOCK_CAR.model,
        num_doors: null,
        num_seats: null,
        sale_conditions: {
          exchange_allowed: false,
          fix_price: false,
          shipping_allowed: false,
        },
        sale_price: MOCK_CAR.salePrice,
        storytelling: '',
        title: `${MOCK_CAR.brand} ${MOCK_CAR.model} ${2016}`,
        version: null,
        year: 2016,
      });
    });
  });

  describe('when changing version field', () => {
    it('should autocomplete fields with the ones that backend sends', () => {
      spyOn(itemService, 'getCarInfo').and.callThrough();
      spyOn(component.uploadForm, 'patchValue').and.callThrough();

      component.uploadForm.get('brand').patchValue(MOCK_CAR.brand);
      component.uploadForm.get('model').patchValue(MOCK_CAR.model);
      component.uploadForm.get('year').patchValue(MOCK_CAR.year);
      component.uploadForm.get('version').patchValue(MOCK_CAR.version);

      expect(itemService.getCarInfo).toHaveBeenCalledWith(
        MOCK_CAR.brand,
        MOCK_CAR.model,
        MOCK_CAR.version
      );
      expect(component.uploadForm.patchValue).toHaveBeenCalledWith(CAR_INFO, {
        emitEvent: false,
      });
      expect(component.uploadForm.get('brand').value).toEqual(CAR_INFO.brand);
      expect(component.uploadForm.get('model').value).toEqual(CAR_INFO.model);
      expect(component.uploadForm.get('engine').value).toEqual(CAR_INFO.engine);
      expect(component.uploadForm.get('gearbox').value).toEqual(
        CAR_INFO.gearbox
      );
      expect(component.uploadForm.get('num_doors').value).toEqual(
        CAR_INFO.num_doors
      );
      expect(component.uploadForm.get('num_seats').value).toEqual(
        CAR_INFO.num_seats
      );
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
        values: component.uploadForm.value,
      });
      expect(component.loading).toBeTruthy();
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

      expect(component.uploadForm.get('sale_price').valid).toBe(false);
    });

    it('should not accept sale_price > 999999999', () => {
      component.uploadForm.get('sale_price').patchValue(9999999999);

      expect(component.uploadForm.get('sale_price').valid).toBe(false);
    });

    it('should not accept km < 0', () => {
      component.uploadForm.get('km').patchValue(-1);

      expect(component.uploadForm.get('km').valid).toBe(false);
    });

    it('should not accept km > 999999999', () => {
      component.uploadForm.get('km').patchValue(9999999999);

      expect(component.uploadForm.get('km').valid).toBe(false);
    });

    it('should not accept num_seats < 0', () => {
      component.uploadForm.get('num_seats').patchValue(-1);

      expect(component.uploadForm.get('num_seats').valid).toBe(false);
    });

    it('should not accept num_seats > 99', () => {
      component.uploadForm.get('num_seats').patchValue(100);

      expect(component.uploadForm.get('num_seats').valid).toBe(false);
    });

    it('should not accept year < 1900', () => {
      component.uploadForm.get('year').patchValue(1800);

      expect(component.uploadForm.get('year').valid).toBe(false);
    });

    it('should not accept year > actualYear', () => {
      component.uploadForm.get('year').patchValue(component.currentYear + 5);

      expect(component.uploadForm.get('year').valid).toBe(false);
    });

    it('should accept year between actualYear and > 1900', () => {
      component.uploadForm.get('year').patchValue(1950);

      expect(component.uploadForm.get('year').valid).toBe(true);
    });

    it('should accept year actualYear', () => {
      component.uploadForm.get('year').patchValue(component.currentYear);

      expect(component.uploadForm.get('year').valid).toBe(true);
    });

    describe('when user changes the form', () => {
      describe('and when a required input value has an empty space', () => {
        const emptyString = '       ';

        it('should not accept empty string in model', () => {
          component.uploadForm.get('model').patchValue(emptyString);

          expect(component.uploadForm.get('model').valid).toBe(false);
        });

        it('should not accept empty string in brand', () => {
          component.uploadForm.get('brand').patchValue(emptyString);

          expect(component.uploadForm.get('brand').valid).toBe(false);
        });

        it('should not accept empty string in title', () => {
          component.uploadForm.get('title').patchValue(emptyString);

          expect(component.uploadForm.get('title').valid).toBe(false);
        });
      });

      describe('and when a required values does not have an empty space', () => {
        it('should accept string in model', () => {
          component.uploadForm.get('model').patchValue('Modal1');

          expect(component.uploadForm.get('model').valid).toBe(true);
        });
        it('should accept string in brand', () => {
          component.uploadForm.get('brand').patchValue('Seat');

          expect(component.uploadForm.get('brand').valid).toBe(true);
        });

        it('should accept string in title', () => {
          component.uploadForm.get('title').patchValue('Car title');

          expect(component.uploadForm.get('title').valid).toBe(true);
        });
      });
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
      num_doors: MOCK_CAR.numDoors,
    };
    const uploadedEvent = {
      action: 'updated',
      response: MOCK_RESPONSE_CONTENT,
    };
    it('should redirect', () => {
      component.item = <Car>MOCK_ITEM_V3;
      component.item.flags.onhold = null;
      spyOn(router, 'navigate');

      component.onUploaded(uploadedEvent);

      expect(router.navigate).toHaveBeenCalledWith([
        '/catalog/list',
        { [uploadedEvent.action]: true, itemId: uploadedEvent.response.id },
      ]);
    });

    it('should redirect with onHold true', () => {
      component.item = <Car>MOCK_ITEM_V3;
      component.item.flags.onhold = true;
      spyOn(router, 'navigate');

      component.onUploaded(uploadedEvent);

      expect(router.navigate).toHaveBeenCalledWith([
        '/catalog/list',
        {
          [uploadedEvent.action]: true,
          itemId: uploadedEvent.response.id,
          onHold: true,
        },
      ]);
    });

    it('should set action as urgent if item is urgent and product not on hold', () => {
      component.isUrgent = true;
      spyOn(router, 'navigate');

      component.onUploaded(uploadedEvent);

      expect(router.navigate).toHaveBeenCalledWith([
        '/catalog/list',
        { urgent: true, itemId: uploadedEvent.response.id },
      ]);
    });

    describe('if it`s a item modification', () => {
      it('should send the Edit Item Car tracking event', () => {
        component.item = MOCK_CAR;
        const editEvent: any = {
          action: 'update',
          response: {
            id: MOCK_CAR.id,
            type: 'edit',
          },
        };
        const editResponse: CarContent = MOCK_RESPONSE_CONTENT;
        const expectedEvent: AnalyticsEvent<EditItemCar> = {
          name: ANALYTICS_EVENT_NAMES.EditItemCar,
          eventType: ANALYTIC_EVENT_TYPES.Other,
          attributes: {
            itemId: MOCK_CAR.id,
            categoryId: MOCK_CAR.categoryId,
            salePrice: MOCK_CAR.salePrice,
            title: MOCK_CAR.title,
            screenId: SCREEN_IDS.EditItem,
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
            isPro: false,
          },
        };
        editEvent.response = editResponse;
        spyOn(analyticsService, 'trackEvent');

        component.ngOnInit();
        component.onUploaded(editEvent);

        expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
      });
    });

    describe('if it`s a item upload', () => {
      it('should send the List Item Car tracking event', () => {
        const uploadEvent: any = {
          action: 'create',
          response: {
            id: MOCK_CAR.id,
            type: 'upload',
          },
        };
        const uploadResponse: CarContent = MOCK_RESPONSE_CONTENT;
        const expectedEvent: AnalyticsEvent<ListItemCar> = {
          name: ANALYTICS_EVENT_NAMES.ListItemCar,
          eventType: ANALYTIC_EVENT_TYPES.Other,
          attributes: {
            itemId: MOCK_CAR.id,
            categoryId: MOCK_CAR.categoryId,
            salePrice: MOCK_CAR.salePrice,
            title: MOCK_CAR.title,
            screenId: SCREEN_IDS.Upload,
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
            isPro: false,
          },
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
      expect(trackingService.track).toHaveBeenCalledWith(
        TrackingService.UPLOADFORM_ERROR
      );
    });
  });

  describe('preview', () => {
    beforeEach(fakeAsync(() => {
      spyOn(modalService, 'open').and.callThrough();
      spyOn(component, 'onSubmit');
      component.item = MOCK_CAR;
      component.ngOnInit();
      component.preview();
    }));

    it('should open modal', () => {
      expect(modalService.open).toHaveBeenCalledWith(PreviewModalComponent, {
        windowClass: 'preview',
      });
    });
    it('should set itemPreview', () => {
      expect(componentInstance.itemPreview).toEqual({
        id: MOCK_CAR.id,
        title: `${MOCK_CAR.brand} ${MOCK_CAR.model} ${MOCK_CAR.year}`,
        storytelling: MOCK_CAR.description,
        model: MOCK_CAR.model,
        brand: MOCK_CAR.brand,
        year: `${MOCK_CAR.year}`,
        version: MOCK_CAR.version,
        financed_price: MOCK_CAR.financedPrice,
        num_seats: MOCK_CAR.numSeats,
        num_doors: MOCK_CAR.numDoors,
        body_type: MOCK_CAR.bodyType,
        km: MOCK_CAR.km,
        engine: MOCK_CAR.engine,
        gearbox: MOCK_CAR.gearbox,
        horsepower: MOCK_CAR.horsepower,
        category_id: CARS_CATEGORY,
        sale_price: MOCK_CAR.salePrice,
        currency_code: MOCK_CAR.currencyCode,
        sale_conditions: {
          fix_price: false,
          exchange_allowed: false,
          shipping_allowed: false,
        },
        images: [],
        location: {
          address: '',
          latitude: '',
          longitude: '',
        },
      });
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

  describe('when selecting a custom make', () => {
    it('should reset brand, model and year values', () => {
      component.uploadForm.patchValue({
        brand: MOCK_CAR.brand,
        model: MOCK_CAR.model,
        year: MOCK_CAR.year,
      });

      component.toggleCustomMakeSelection();

      expect(component.customMake).toBe(true);
      expect(component.uploadForm.get('brand').value).toBeNull();
      expect(component.uploadForm.get('model').value).toBeNull();
      expect(component.uploadForm.get('year').value).toBeNull();
    });

    it('should enable model, year and version fields', () => {
      component.ngOnInit();

      component.toggleCustomMakeSelection();
      fixture.detectChanges();
      const modelField = HTMLElement.query(By.css('#model')).nativeNode;
      const yearField = HTMLElement.query(By.css('#year')).nativeNode;
      const versionField = HTMLElement.query(By.css('#version')).nativeNode;

      expect(modelField.disabled).toBe(false);
      expect(yearField.disabled).toBe(false);
      expect(versionField.disabled).toBe(false);
    });
  });

  describe('when selecting a custom version', () => {
    it('should reset version value', () => {
      component.uploadForm.patchValue({
        version: MOCK_CAR.version,
      });

      component.toggleCustomVersionSelection();

      expect(component.customVersion).toBe(true);
      expect(component.uploadForm.get('version').value).toBeNull();
    });

    it('should enable version field', () => {
      component.ngOnInit();

      component.toggleCustomVersionSelection();
      fixture.detectChanges();
      const versionField = HTMLElement.query(By.css('#version')).nativeNode;

      expect(versionField.disabled).toBe(false);
    });
  });

  describe('updateUploadPercentage', () => {
    it('should update the completed percentage of the upload', () => {
      component.updateUploadPercentage(88.01);

      expect(component.uploadCompletedPercentage).toBe(88);
    });
  });
});
