import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadRealestateComponent } from './upload-realestate.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TrackingService } from '../../../core/tracking/tracking.service';
import { MockTrackingService } from '../../../../tests/tracking.fixtures.spec';
import { RealestateKeysService } from './realestate-keys.service';
import { Observable } from 'rxjs/Observable';
import { ErrorsService } from '../../../core/errors/errors.service';
import { Router } from '@angular/router';
import { MOCK_ITEM_V3, UPLOAD_FORM_REALESTATE_VALUES } from '../../../../tests/item.fixtures.spec';
import { Key } from './key.interface';
import { IOption } from 'ng-select';
import { USER_LOCATION } from '../../../../tests/user.fixtures.spec';

describe('UploadRealestateComponent', () => {
  let component: UploadRealestateComponent;
  let fixture: ComponentFixture<UploadRealestateComponent>;
  let errorService: ErrorsService;
  let router: Router;
  let trackingService: TrackingService;
  let realestateKeysService: RealestateKeysService;
  const RESPONSE: Key[] = [{id: 'test', icon_id: 'test', text: 'test'}];
  const RESPONSE_OPTION: IOption[] = [{value: 'test', label: 'test'}];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadRealestateComponent ],
      providers: [
        FormBuilder,
        {provide: TrackingService, useClass: MockTrackingService},
        {
          provide: RealestateKeysService, useValue: {
          getOperations() {
            return Observable.of(RESPONSE);
          },
          getConditions() {
            return Observable.of(RESPONSE_OPTION);
          },
          getExtras() {
            return Observable.of(RESPONSE);
          },
          getTypes() {
            return Observable.of(RESPONSE);
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
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadRealestateComponent);
    component = fixture.componentInstance;
    errorService = TestBed.get(ErrorsService);
    router = TestBed.get(Router);
    trackingService = TestBed.get(TrackingService);
    realestateKeysService = TestBed.get(RealestateKeysService)
  });

  describe('ngOnInit', () => {
    it('should call getOperations and set it', () => {
      spyOn(realestateKeysService, 'getOperations').and.callThrough();

      fixture.detectChanges();

      expect(realestateKeysService.getOperations).toHaveBeenCalled();
      expect(component.operations).toEqual(RESPONSE);
    });

    it('should call getConditions and set it', () => {
      spyOn(realestateKeysService, 'getConditions').and.callThrough();

      fixture.detectChanges();

      expect(realestateKeysService.getConditions).toHaveBeenCalled();
      expect(component.conditions).toEqual(RESPONSE_OPTION);
    });

    it('should call getExtras and set it', () => {
      spyOn(realestateKeysService, 'getExtras').and.callThrough();

      fixture.detectChanges();

      expect(realestateKeysService.getExtras).toHaveBeenCalled();
      expect(component.extras).toEqual(RESPONSE);
    });

    it('should call getTypes and set it', () => {
      spyOn(realestateKeysService, 'getTypes').and.callThrough();

      fixture.detectChanges();

      expect(realestateKeysService.getTypes).toHaveBeenCalledWith('rent');
      expect(component.types).toEqual(RESPONSE);
    });

    it('should call getTypes when operation change', () => {
      spyOn(realestateKeysService, 'getTypes').and.callThrough();
      fixture.detectChanges();

      component.uploadForm.get('operation').setValue('operation');

      expect(realestateKeysService.getTypes).toHaveBeenCalledWith('operation');
      expect(component.types).toEqual(RESPONSE);
    });

    it('should set coordinates when location change', () => {
      const USER_LOCATION_COORDINATES: any = {
        latitude: USER_LOCATION.approximated_latitude,
        longitude: USER_LOCATION.approximated_longitude,
        address: USER_LOCATION.title,
        approximated_location: false
      };
      fixture.detectChanges();

      component.uploadForm.get('location').patchValue(USER_LOCATION_COORDINATES);

      expect(component.coordinates).toEqual(USER_LOCATION_COORDINATES);
    });

  });

  describe('onSubmit', () => {
    it('should has category set by default', () => {
      expect(component.uploadForm.get('category_id').value).toBe('13000');
    });

    it('should emit uploadEvent if form is valid', () => {
      let input: any;
      component.uploadForm.patchValue(UPLOAD_FORM_REALESTATE_VALUES);
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

  });

  describe('onUploaded', () => {
    it('should redirect', () => {
      component.item = MOCK_ITEM_V3;
      const uploadedEvent = {
        action: 'updated',
        response: {
          id: '1'
        }
      };
      spyOn(router, 'navigate');

      component.onUploaded(uploadedEvent);

      expect(router.navigate).toHaveBeenCalledWith(['/catalog/list', {[uploadedEvent.action]: true, itemId: uploadedEvent.response.id, onHold: true}]);
    });

    it('should redirect with onHold true', () => {
      component.item = MOCK_ITEM_V3;
      component.item.flags.onhold = true;
      const uploadedEvent = {
        action: 'updated',
        response: {
          id: '1'
        }
      };
      spyOn(router, 'navigate');

      component.onUploaded(uploadedEvent);

      expect(router.navigate).toHaveBeenCalledWith(['/catalog/list', {[uploadedEvent.action]: true, itemId: uploadedEvent.response.id, onHold: true}]);
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

  describe('selectUrgent', () => {
    it('should set as urgent when checkbox is selected', () => {
      component.selectUrgent(true);

      expect(component.isUrgent).toBeTruthy();
    });
    it('should set as not urgent when checkbox is unselected', () => {
      component.selectUrgent(false);

      expect(component.isUrgent).toBeFalsy();
    });
  });

  describe('emitLocation', () => {
    let categoryId: number;

    it('should emit location updated event', () => {
      component.locationSelected.subscribe((s: number) => {
        categoryId = s;
      });

      component.emitLocation();

      expect(categoryId).toBe(13000);
    });
  });
});
