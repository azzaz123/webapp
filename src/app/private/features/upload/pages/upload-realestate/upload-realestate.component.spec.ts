import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import {
  AnalyticsEvent,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  EditItemRE,
  ListItemRE,
  SCREEN_IDS,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { ErrorsService } from '@core/errors/errors.service';
import { ITEM_TYPES } from '@core/item/item';
import { REALESTATE_CATEGORY } from '@core/item/item-categories';
import { RealestateContent } from '@core/item/item-response.interface';
import { ItemService } from '@core/item/item.service';
import { UserService } from '@core/user/user.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { MOCK_REALESTATE, MOCK_REALESTATE_RESPONSE_CONTENT, UPLOAD_FORM_REALESTATE_VALUES } from '@fixtures/realestate.fixtures.spec';
import {
  MockUploadService,
  MOCK_UPLOAD_OUTPUT_DONE,
  MOCK_UPLOAD_OUTPUT_PENDING,
  UPLOAD_FILE_2,
  UPLOAD_FILE_DONE,
  UPLOAD_FILE_DONE_2,
} from '@fixtures/upload.fixtures.spec';
import { IMAGE, MOCK_USER_WITHOUT_LOCATION, USER_DATA, USER_LOCATION } from '@fixtures/user.fixtures.spec';
import { NgbModal, NgbPopoverConfig, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { IOption } from '@shared/dropdown/utils/option.interface';
import { UPLOAD_ACTION } from '@shared/uploader/upload.interface';
import { of, throwError } from 'rxjs';
import { Key } from '../../core/models/key.interface';
import { ItemReactivationService } from '../../core/services/item-reactivation/item-reactivation.service';
import { RealestateKeysService } from '../../core/services/realstate-keys/realestate-keys.service';
import { UploadService } from '../../core/services/upload/upload.service';
import { PreviewModalComponent } from '../../modals/preview-modal/preview-modal.component';
import { UploadRealestateComponent } from './upload-realestate.component';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { LocationSelectorModal } from '@shared/modals/location-selector-modal/location-selector-modal.component';

describe('UploadRealestateComponent', () => {
  let component: UploadRealestateComponent;
  let fixture: ComponentFixture<UploadRealestateComponent>;
  let errorService: ErrorsService;
  let router: Router;
  let realestateKeysService: RealestateKeysService;
  let modalService: NgbModal;
  let analyticsService: AnalyticsService;
  let itemService: ItemService;
  let uploadService: UploadService;
  let userService: UserService;
  let itemReactivationService: ItemReactivationService;
  const RESPONSE: Key[] = [{ id: 'test', icon_id: 'test', text: 'test' }];
  const RESPONSE_OPTION: IOption[] = [{ value: 'test', label: 'test' }];
  const componentInstance: any = {};

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [NgbPopoverModule],
        declarations: [UploadRealestateComponent],
        providers: [
          FormBuilder,
          NgbPopoverConfig,
          { provide: AnalyticsService, useClass: MockAnalyticsService },
          { provide: UploadService, useClass: MockUploadService },
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
              get user() {
                return USER_DATA;
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
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadRealestateComponent);
    component = fixture.componentInstance;
    errorService = TestBed.inject(ErrorsService);
    router = TestBed.inject(Router);
    realestateKeysService = TestBed.inject(RealestateKeysService);
    modalService = TestBed.inject(NgbModal);
    itemService = TestBed.inject(ItemService);
    analyticsService = TestBed.inject(AnalyticsService);
    uploadService = TestBed.inject(UploadService);
    itemReactivationService = TestBed.inject(ItemReactivationService);
    userService = TestBed.inject(UserService);
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
      expect(component.uploadForm.get('category_id').value).toBe(REALESTATE_CATEGORY);
    });

    it('should emit uploadEvent if form is valid', () => {
      spyOn(uploadService, 'createItem').and.callThrough();
      component.uploadForm.patchValue(UPLOAD_FORM_REALESTATE_VALUES);
      expect(component.uploadForm.valid).toBe(true);

      component.onSubmit();

      expect(uploadService.createItem).toHaveBeenCalledWith(component.uploadForm.value, ITEM_TYPES.REAL_ESTATE);
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

    it('should avoid submit if storytelling has only spaces', () => {
      component.uploadForm.get('storytelling').setValue('   ');

      expect(component.uploadForm.get('storytelling').invalid).toBeTruthy();
    });

    describe('and when there is not an item uploaded', () => {
      beforeEach(() => {
        component.item = null;
        component.uploadForm.patchValue(UPLOAD_FORM_REALESTATE_VALUES);
      });

      it('should upload the item if the service return done', () => {
        spyOn(uploadService, 'createItem').and.returnValue(of(MOCK_UPLOAD_OUTPUT_DONE));
        spyOn(component, 'onUploaded');

        fixture.detectChanges();
        component.onSubmit();

        expect(uploadService.createItem).toHaveBeenCalledTimes(1);
        expect(uploadService.createItem).toHaveBeenCalledWith(component.uploadForm.value, ITEM_TYPES.REAL_ESTATE);
        expect(component.onUploaded).toHaveBeenCalledTimes(1);
        expect(component.onUploaded).toHaveBeenCalledWith(MOCK_UPLOAD_OUTPUT_DONE.file.response, UPLOAD_ACTION.created);
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
        component.item = MOCK_REALESTATE;
        component.uploadForm.patchValue(UPLOAD_FORM_REALESTATE_VALUES);
      });

      it('should upload the item if the service success', () => {
        spyOn(uploadService, 'updateItem').and.returnValue(of({ content: MOCK_REALESTATE_RESPONSE_CONTENT }));
        spyOn(component, 'onUploaded');
        fixture.detectChanges();
        component.onSubmit();

        expect(uploadService.updateItem).toHaveBeenCalledTimes(1);
        expect(uploadService.updateItem).toHaveBeenCalledWith(component.uploadForm.value, ITEM_TYPES.REAL_ESTATE);
        expect(component.onUploaded).toHaveBeenCalledTimes(1);
        expect(component.onUploaded).toHaveBeenCalledWith(MOCK_REALESTATE_RESPONSE_CONTENT, UPLOAD_ACTION.updated);
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

    describe('and has not user location', () => {
      beforeEach(() => {
        spyOn(modalService, 'open').and.returnValue({
          result: Promise.resolve(false),
        });
        jest.spyOn(userService, 'user', 'get').mockReturnValue(MOCK_USER_WITHOUT_LOCATION);
        spyOn(uploadService, 'createItem').and.callThrough();
        component.uploadForm.patchValue(UPLOAD_FORM_REALESTATE_VALUES);
      });
      it('should not save data', () => {
        component.onSubmit();

        expect(uploadService.createItem).not.toHaveBeenCalled();
        expect(component.loading).toBe(false);
      });

      it('should open location modal', () => {
        component.onSubmit();

        expect(modalService.open).toHaveBeenCalledTimes(1);
        expect(modalService.open).toHaveBeenCalledWith(LocationSelectorModal);
      });
    });
  });

  describe('onUploaded', () => {
    const action = UPLOAD_ACTION.updated;
    const response = MOCK_REALESTATE_RESPONSE_CONTENT;

    it('should redirect', () => {
      component.item = MOCK_REALESTATE;
      component.item.flags.onhold = null;
      spyOn(router, 'navigate');

      component.onUploaded(response, action);

      expect(router.navigate).toHaveBeenCalledWith(['/catalog/list', { [action]: true, itemId: response.id }]);
    });

    it('should redirect with onHold true', () => {
      component.item = MOCK_REALESTATE;
      component.item.flags.onhold = true;
      spyOn(router, 'navigate');

      component.onUploaded(response, action);

      expect(router.navigate).toHaveBeenCalledWith([
        '/catalog/list',
        {
          [action]: true,
          itemId: response.id,
          onHold: true,
        },
      ]);
    });

    describe('if it`s a item modification', () => {
      it('should send the Edit Item RE tracking event', () => {
        component.item = MOCK_REALESTATE;
        const action = UPLOAD_ACTION.updated;
        const editResponse: RealestateContent = MOCK_REALESTATE_RESPONSE_CONTENT;
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
        spyOn(analyticsService, 'trackEvent');

        component.ngOnInit();
        component.onUploaded(editResponse, action);

        expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
      });
    });

    describe('if it`s a item upload', () => {
      it('should send the List Item RE tracking event', () => {
        const action = UPLOAD_ACTION.created;
        const uploadResponse: RealestateContent = MOCK_REALESTATE_RESPONSE_CONTENT;
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
        spyOn(analyticsService, 'trackEvent');

        component.ngOnInit();
        component.onUploaded(uploadResponse, action);

        expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
      });
    });
  });

  describe('onError', () => {
    it('should set loading to false', () => {
      component.loading = true;

      component.onError('response');

      expect(component.loading).toBe(false);
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

      expect(itemService.updateRealEstateLocation).toHaveBeenCalledWith(MOCK_REALESTATE.id, USER_LOCATION_COORDINATES);
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
      expect(componentInstance.itemPreview).toEqual(UPLOAD_FORM_REALESTATE_VALUES);
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

  describe('hasErrorToShow', () => {
    const controlName = 'operation';
    it('should does not show error at the init', () => {
      const hasErrorToShow: boolean = component.hasErrorToShow(controlName);

      expect(hasErrorToShow).toBeFalsy();
    });

    it('should show error if the control is invalid and touched', () => {
      component.uploadForm.get(controlName).markAsTouched();

      const hasErrorToShow: boolean = component.hasErrorToShow(controlName);

      expect(hasErrorToShow).toBeTruthy();
    });

    it('should does not show error if is valid and touched', () => {
      component.uploadForm.get(controlName).setValue('Any Value is valid');

      const hasErrorToShow: boolean = component.hasErrorToShow(controlName);

      expect(hasErrorToShow).toBeFalsy();
    });
  });

  describe('delete image', () => {
    it('should not remove imagen from form is service fails', () => {
      component.item = MOCK_REALESTATE;
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
      component.item = MOCK_REALESTATE;
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
      component.item = MOCK_REALESTATE;
      const images = [UPLOAD_FILE_DONE, UPLOAD_FILE_DONE_2];
      component.uploadForm.patchValue({ images });
      spyOn(uploadService, 'updateOrder').and.callThrough();

      component.onOrderImages();

      expect(uploadService.updateOrder).toHaveBeenCalledTimes(1);
      expect(uploadService.updateOrder).toHaveBeenCalledWith(images, MOCK_REALESTATE.id);
    });
  });
  describe('add single imagen', () => {
    it('should show success toast', () => {
      component.item = MOCK_REALESTATE;
      const images = [UPLOAD_FILE_DONE, UPLOAD_FILE_2];
      spyOn(uploadService, 'uploadSingleImage').and.returnValue(of(MOCK_UPLOAD_OUTPUT_DONE));
      spyOn(errorService, 'i18nSuccess').and.callThrough();

      component.onAddImage(images[1]);

      expect(uploadService.uploadSingleImage).toHaveBeenCalledTimes(1);
      expect(uploadService.uploadSingleImage).toHaveBeenCalledWith(images[1], MOCK_REALESTATE.id, ITEM_TYPES.REAL_ESTATE);
      expect(errorService.i18nSuccess).toHaveBeenCalledTimes(1);
      expect(errorService.i18nSuccess).toHaveBeenCalledWith(TRANSLATION_KEY.IMAGE_UPLOADED);
    });
    it('should show image from form if fails', () => {
      component.item = MOCK_REALESTATE;
      const images = [UPLOAD_FILE_DONE, UPLOAD_FILE_2];
      component.uploadForm.patchValue({
        images,
      });
      spyOn(uploadService, 'uploadSingleImage').and.returnValue(throwError('error'));
      spyOn(errorService, 'i18nError').and.callThrough();

      component.onAddImage(images[1]);

      expect(uploadService.uploadSingleImage).toHaveBeenCalledTimes(1);
      expect(uploadService.uploadSingleImage).toHaveBeenCalledWith(images[1], MOCK_REALESTATE.id, ITEM_TYPES.REAL_ESTATE);
      expect(errorService.i18nError).toHaveBeenCalledTimes(1);
      expect(component.uploadForm.get('images').value).not.toContain(UPLOAD_FILE_2);
      expect(component.uploadForm.get('images').value).toContain(UPLOAD_FILE_DONE);
    });
  });

  describe('is reactivation mode', () => {
    beforeEach(() => {
      component.isReactivation = true;
      component.item = MOCK_REALESTATE;

      fixture.detectChanges();
    });

    it('should check reactivation validation on form init', () => {
      spyOn(itemReactivationService, 'reactivationValidation');

      component.ngOnInit();

      expect(itemReactivationService.reactivationValidation).toHaveBeenCalledWith(component.uploadForm);
    });

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

  describe('user location modal', () => {
    beforeEach(() => {
      jest.spyOn(userService, 'user', 'get').mockReturnValue(MOCK_USER_WITHOUT_LOCATION);
      spyOn(uploadService, 'createItem').and.callThrough();
      component.uploadForm.patchValue(UPLOAD_FORM_REALESTATE_VALUES);
    });

    describe('Is location saved', () => {
      beforeEach(() => {
        spyOn(modalService, 'open').and.returnValue({
          result: Promise.resolve(true),
        });
      });

      it('should save data', fakeAsync(() => {
        component.onSubmit();
        tick();

        expect(uploadService.createItem).toHaveBeenCalledTimes(1);
      }));
    });

    describe('Is location not saved', () => {
      beforeEach(() => {
        spyOn(modalService, 'open').and.returnValue({
          result: Promise.resolve(false),
        });
      });

      it('should not save data', () => {
        component.onSubmit();

        expect(uploadService.createItem).not.toHaveBeenCalled();
      });
    });
  });
});
