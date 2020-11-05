import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { UploadRealestateComponent } from './upload-realestate.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TrackingService } from '../../core/tracking/tracking.service';
import { MockTrackingService } from '../../../tests/tracking.fixtures.spec';
import { RealestateKeysService } from './realestate-keys.service';
import { of } from 'rxjs';
import { ErrorsService } from '../../core/errors/errors.service';
import { Router } from '@angular/router';
import { Key } from './key.interface';
import { IOption } from 'app/dropdown/utils/option.interface';
import { IMAGE, USER_LOCATION } from '../../../tests/user.fixtures.spec';
import {
  NgbModal,
  NgbPopoverConfig,
  NgbPopoverModule,
} from '@ng-bootstrap/ng-bootstrap';
import { PreviewModalComponent } from '../preview-modal/preview-modal.component';
import {
  MOCK_REALESTATE,
  UPLOAD_FORM_REALESTATE_VALUES,
} from '../../../tests/realestate.fixtures.spec';
import { ItemService } from '../../core/item/item.service';
import { REALESTATE_CATEGORY } from '../../core/item/item-categories';
import {
  ANALYTIC_EVENT_TYPES,
  ANALYTICS_EVENT_NAMES,
  SCREEN_IDS,
  AnalyticsEvent,
  EditItemRE,
  ListItemRE,
} from '../../core/analytics/analytics-constants';
import { AnalyticsService } from '../../core/analytics/analytics.service';
import { MockAnalyticsService } from '../../../tests/analytics.fixtures.spec';
import { UserService } from '../../core/user/user.service';
import { RealestateContent } from '../../core/item/item-response.interface';

describe('UploadRealestateComponent', () => {
  let component: UploadRealestateComponent;
  let fixture: ComponentFixture<UploadRealestateComponent>;
  let errorService: ErrorsService;
  let router: Router;
  let trackingService: TrackingService;
  let realestateKeysService: RealestateKeysService;
  let modalService: NgbModal;
  let analyticsService: AnalyticsService;
  let itemService: ItemService;
  const RESPONSE: Key[] = [{ id: 'test', icon_id: 'test', text: 'test' }];
  const RESPONSE_OPTION: IOption[] = [{ value: 'test', label: 'test' }];
  const componentInstance: any = {};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgbPopoverModule],
      declarations: [UploadRealestateComponent],
      providers: [
        FormBuilder,
        NgbPopoverConfig,
        { provide: TrackingService, useClass: MockTrackingService },
        { provide: AnalyticsService, useClass: MockAnalyticsService },
        {
          provide: UserService,
          useValue: {
            isProUser() {
              return of(false);
            },
          },
        },
        {
          provide: RealestateKeysService,
          useValue: {
            getOperations() {
              return of(RESPONSE);
            },
            getConditions() {
              return of(RESPONSE_OPTION);
            },
            getExtras() {
              return of(RESPONSE);
            },
            getTypes() {
              return of(RESPONSE);
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
            updateRealEstateLocation() {
              return of({});
            },
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadRealestateComponent);
    component = fixture.componentInstance;
    errorService = TestBed.inject(ErrorsService);
    router = TestBed.inject(Router);
    trackingService = TestBed.inject(TrackingService);
    realestateKeysService = TestBed.inject(RealestateKeysService);
    modalService = TestBed.inject(NgbModal);
    itemService = TestBed.inject(ItemService);
    analyticsService = TestBed.inject(AnalyticsService);
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should call getOperations and set it', () => {
      spyOn(realestateKeysService, 'getOperations').and.callThrough();
      component.ngOnInit();

      expect(realestateKeysService.getOperations).toHaveBeenCalled();
      expect(component.operations).toEqual(RESPONSE);
    });

    it('should call getConditions and set it', () => {
      spyOn(realestateKeysService, 'getConditions').and.callThrough();
      component.ngOnInit();

      expect(realestateKeysService.getConditions).toHaveBeenCalled();
      expect(component.conditions).toEqual(RESPONSE_OPTION);
    });

    it('should call getTypes and set it', () => {
      spyOn(realestateKeysService, 'getTypes').and.callThrough();
      component.ngOnInit();

      expect(realestateKeysService.getTypes).toHaveBeenCalledWith('rent');
      expect(component.types).toEqual(RESPONSE);
    });

    it('should call getTypes when operation change', () => {
      spyOn(realestateKeysService, 'getTypes').and.callThrough();
      component.ngOnInit();

      component.uploadForm.get('operation').setValue('operation');

      expect(realestateKeysService.getTypes).toHaveBeenCalledWith('operation');
      expect(component.types).toEqual(RESPONSE);
    });

    it('should call getExtras when type change', () => {
      spyOn(realestateKeysService, 'getExtras').and.callThrough();
      component.ngOnInit();

      component.uploadForm.get('type').setValue('house');

      expect(realestateKeysService.getExtras).toHaveBeenCalledWith('house');
      expect(component.extras).toEqual(RESPONSE);
    });

    describe('edit mode', () => {
      it('should set form value', () => {
        component.item = MOCK_REALESTATE;

        component.ngOnInit();

        expect(component.uploadForm.value).toEqual({
          id: MOCK_REALESTATE.id,
          title: MOCK_REALESTATE.title,
          sale_price: MOCK_REALESTATE.salePrice,
          currency_code: MOCK_REALESTATE.currencyCode,
          storytelling: MOCK_REALESTATE.description,
          category_id: MOCK_REALESTATE.categoryId.toString(),
          operation: MOCK_REALESTATE.operation,
          type: MOCK_REALESTATE.type,
          condition: MOCK_REALESTATE.condition,
          surface: MOCK_REALESTATE.surface,
          rooms: MOCK_REALESTATE.rooms,
          bathrooms: MOCK_REALESTATE.bathrooms,
          garage: MOCK_REALESTATE.garage,
          terrace: MOCK_REALESTATE.terrace,
          elevator: MOCK_REALESTATE.elevator,
          pool: MOCK_REALESTATE.pool,
          garden: MOCK_REALESTATE.garden,
          location: MOCK_REALESTATE.location,
          images: [],
        });
      });

      it('should emit changed event if form values changes', () => {
        let formChanged: boolean;
        component.item = MOCK_REALESTATE;
        component.onFormChanged.subscribe((value: boolean) => {
          formChanged = value;
        });
        component.ngOnInit();
        component.uploadForm.get('images').patchValue([IMAGE]);

        component.uploadForm.get('title').patchValue('new title');

        expect(formChanged).toBe(true);
      });
    });
  });

  describe('onSubmit', () => {
    it('should has category set by default', () => {
      expect(component.uploadForm.get('category_id').value).toBe(
        REALESTATE_CATEGORY
      );
    });

    it('should emit uploadEvent if form is valid', () => {
      let input: any;
      component.uploadForm.patchValue(UPLOAD_FORM_REALESTATE_VALUES);
      expect(component.uploadForm.valid).toBe(true);
      component.uploadEvent.subscribe((i: any) => {
        input = i;
      });

      component.onSubmit();

      expect(input).toEqual({
        type: 'create',
        values: component.uploadForm.value,
      });
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
  });

  describe('onUploaded', () => {
    const MOCK_RESPONSE_CONTENT: RealestateContent = {
      id: MOCK_REALESTATE.id,
      category_id: MOCK_REALESTATE.categoryId,
      sale_price: MOCK_REALESTATE.salePrice,
      title: MOCK_REALESTATE.title,
      description: MOCK_REALESTATE.description,
      modified_date: MOCK_REALESTATE.modifiedDate,
      flags: MOCK_REALESTATE.flags,
      seller_id: 'ukd73df',
      web_slug: MOCK_REALESTATE.webSlug,
      operation: MOCK_REALESTATE.operation,
      type: MOCK_REALESTATE.type,
      surface: MOCK_REALESTATE.surface,
      rooms: MOCK_REALESTATE.rooms,
      condition: MOCK_REALESTATE.condition,
    };
    const uploadedEvent = {
      action: 'updated',
      response: {
        id: '1',
        content: MOCK_RESPONSE_CONTENT,
      },
    };

    it('should redirect', () => {
      component.item = MOCK_REALESTATE;
      component.item.flags.onhold = null;
      spyOn(router, 'navigate');

      component.onUploaded(uploadedEvent);

      expect(router.navigate).toHaveBeenCalledWith([
        '/catalog/list',
        { [uploadedEvent.action]: true, itemId: uploadedEvent.response.id },
      ]);
    });

    it('should redirect with onHold true', () => {
      component.item = MOCK_REALESTATE;
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

    describe('if it`s a item modification', () => {
      it('should send the Edit Item RE tracking event', () => {
        component.item = MOCK_REALESTATE;
        const editEvent: any = {
          action: 'update',
          response: {
            id: MOCK_REALESTATE.id,
            type: 'edit',
          },
        };
        const editResponse: RealestateContent = MOCK_RESPONSE_CONTENT;
        const expectedEvent: AnalyticsEvent<EditItemRE> = {
          name: ANALYTICS_EVENT_NAMES.EditItemRE,
          eventType: ANALYTIC_EVENT_TYPES.Other,
          attributes: {
            itemId: MOCK_REALESTATE.id,
            categoryId: MOCK_REALESTATE.categoryId,
            salePrice: MOCK_REALESTATE.salePrice,
            title: MOCK_REALESTATE.title,
            isPro: false,
            screenId: SCREEN_IDS.EditItem,
            operation: MOCK_REALESTATE.operation,
            type: MOCK_REALESTATE.type,
            surface: MOCK_REALESTATE.surface,
            rooms: MOCK_REALESTATE.rooms,
            condition: MOCK_REALESTATE.condition,
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
      it('should send the List Item RE tracking event', () => {
        const uploadEvent: any = {
          action: 'create',
          response: {
            id: MOCK_REALESTATE.id,
            type: 'upload',
          },
        };
        const uploadResponse: RealestateContent = MOCK_RESPONSE_CONTENT;
        const expectedEvent: AnalyticsEvent<ListItemRE> = {
          name: ANALYTICS_EVENT_NAMES.ListItemRE,
          eventType: ANALYTIC_EVENT_TYPES.Other,
          attributes: {
            itemId: MOCK_REALESTATE.id,
            categoryId: MOCK_REALESTATE.categoryId,
            salePrice: MOCK_REALESTATE.salePrice,
            title: MOCK_REALESTATE.title,
            isPro: false,
            screenId: SCREEN_IDS.Upload,
            operation: MOCK_REALESTATE.operation,
            type: MOCK_REALESTATE.type,
            surface: MOCK_REALESTATE.surface,
            rooms: MOCK_REALESTATE.rooms,
            condition: MOCK_REALESTATE.condition,
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

      expect(component.loading).toBe(false);
      expect(trackingService.track).toHaveBeenCalledWith(
        TrackingService.UPLOADFORM_ERROR
      );
    });
  });

  describe('selectUrgent', () => {
    it('should set as urgent when checkbox is selected', () => {
      component.selectUrgent(true);

      expect(component.isUrgent).toBe(true);
    });
    it('should set as not urgent when checkbox is unselected', () => {
      component.selectUrgent(false);

      expect(component.isUrgent).toBe(false);
    });
  });

  describe('emitLocation', () => {
    let categoryId: number;
    const USER_LOCATION_COORDINATES: any = {
      latitude: USER_LOCATION.approximated_latitude,
      longitude: USER_LOCATION.approximated_longitude,
      address: USER_LOCATION.title,
      approximated_location: false,
    };

    beforeEach(() => {
      component.uploadForm.get('location').setValue(USER_LOCATION_COORDINATES);
    });

    it('should set coordinates when location change', () => {
      component.emitLocation();

      expect(component.coordinates).toEqual(USER_LOCATION_COORDINATES);
    });

    it('should call updateRealEstateLocation when location change if in edit mode', () => {
      component.item = MOCK_REALESTATE;
      spyOn(itemService, 'updateRealEstateLocation').and.callThrough();

      component.emitLocation();

      expect(itemService.updateRealEstateLocation).toHaveBeenCalledWith(
        MOCK_REALESTATE.id,
        USER_LOCATION_COORDINATES
      );
    });

    it('should emit location updated event', () => {
      component.locationSelected.subscribe((s: number) => {
        categoryId = s;
      });

      component.emitLocation();

      expect(categoryId).toBe(13000);
    });
  });

  describe('preview', () => {
    beforeEach(fakeAsync(() => {
      spyOn(modalService, 'open').and.callThrough();
      spyOn(component, 'onSubmit');
      component.uploadForm.patchValue(UPLOAD_FORM_REALESTATE_VALUES);

      component.preview();
    }));

    it('should open modal', () => {
      expect(modalService.open).toHaveBeenCalledWith(PreviewModalComponent, {
        windowClass: 'preview',
      });
    });

    it('should set itemPreview', () => {
      expect(componentInstance.itemPreview).toEqual(
        UPLOAD_FORM_REALESTATE_VALUES
      );
    });

    it('should submit form', fakeAsync(() => {
      tick();

      expect(component.onSubmit).toHaveBeenCalled();
    }));
  });

  describe('updateUploadPercentage', () => {
    it('should update the completed percentage of the upload', () => {
      component.updateUploadPercentage(19.52);

      expect(component.uploadCompletedPercentage).toBe(20);
    });
  });
});
