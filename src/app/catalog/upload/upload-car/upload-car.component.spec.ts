import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadCarComponent } from './upload-car.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CarSuggestionsService } from './car-suggestions.service';
import { Observable } from 'rxjs/Observable';
import { CarKeysService } from './car-keys.service';
import { TEST_HTTP_PROVIDERS, ErrorsService } from 'shield';
import { Router } from '@angular/router';
import { CAR_BODY_TYPES, CAR_BRANDS, CAR_MODELS, CAR_VERSIONS, CAR_YEARS } from '../../../../tests/car.fixtures';
import { NgbPopoverConfig, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

describe('UploadCarComponent', () => {
  let component: UploadCarComponent;
  let fixture: ComponentFixture<UploadCarComponent>;
  let carSuggestionsService: CarSuggestionsService;
  let carKeysService: CarKeysService;
  let errorService: ErrorsService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgbPopoverModule],
      providers: [
        FormBuilder,
        TEST_HTTP_PROVIDERS,
        NgbPopoverConfig,
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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call getBrands and getCarTypes', () => {
      spyOn<any>(component, 'getBrands');
      spyOn<any>(component, 'getCarTypes');
      component.ngOnInit();
      expect(component['getBrands']).toHaveBeenCalled();
      expect(component['getCarTypes']).toHaveBeenCalled();
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
  });

  describe('onSubmit', () => {
    it('should has category set by default', () => {
      expect(component.uploadForm.get('category_id').value).toBe('100');
    });
    it('should emit uploadEvent if form is valid', () => {
      let input: any;
      component.uploadForm.get('model').patchValue('test');
      component.uploadForm.get('brand').patchValue('test');
      component.uploadForm.get('title').patchValue('test');
      component.uploadForm.get('year').patchValue(2017);
      component.uploadForm.get('sale_price').patchValue(1000000);
      component.uploadForm.get('currency_code').patchValue('EUR');
      component.uploadForm.get('images').patchValue([{'image': true}]);
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
    it('should open success message', () => {
      spyOn(errorService, 'i18nSuccess');
      component.onUploaded('1234');
      expect(errorService.i18nSuccess).toHaveBeenCalledWith('productCreated');
    });
    it('should redirect', () => {
      spyOn(router, 'navigate');
      component.onUploaded('1234');
      expect(router.navigate).toHaveBeenCalledWith(['/catalog/list', {created: true}]);
    });
  });

  describe('onError', () => {
    it('should set loading to false', () => {
      component.loading = true;
      component.onError('response');
      expect(component.loading).toBeFalsy();
    });
  });

});
