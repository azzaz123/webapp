import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ErrorsService, TEST_HTTP_PROVIDERS } from 'shield';
import { ActivatedRoute, Router } from '@angular/router';
import { UploadComponent } from './upload.component';
import { Observable } from 'rxjs/Observable';
import { CategoryService } from '../../core/category/category.service';
import { CATEGORIES_OPTIONS } from '../../../tests/category.fixtures';

describe('UploadComponent', () => {
  let component: UploadComponent;
  let fixture: ComponentFixture<UploadComponent>;
  let errorService: ErrorsService;
  let router: Router;
  let categoryService: CategoryService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        FormBuilder,
        TEST_HTTP_PROVIDERS,
        {
          provide: ActivatedRoute, useValue: {
          params: Observable.of({
            catId: 200
          })
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
          }
        }
        }
      ],
      declarations: [UploadComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadComponent);
    component = fixture.componentInstance;
    categoryService = TestBed.get(CategoryService);
    spyOn(categoryService, 'getUploadCategories').and.callThrough();
    fixture.detectChanges();
    errorService = TestBed.get(ErrorsService);
    router = TestBed.get(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should get and set categories', () => {
      expect(categoryService.getUploadCategories).toHaveBeenCalled();
      expect(component.categories).toEqual(CATEGORIES_OPTIONS);
    });
    it('should set form category_id', () => {
      expect(component.uploadForm.get('category_id').value).toBe(200);
    });
  });

  describe('onSubmit', () => {
    it('should emit uploadEvent if form is valid', () => {
      let input: any;
      component.uploadForm.get('title').patchValue('test');
      component.uploadForm.get('description').patchValue('test');
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
      expect(component.uploadForm.get('title').dirty).toBeTruthy();
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
    it('should set delivery_info as required when shipping_allowed true', () => {
      expect(component.uploadForm.get('delivery_info').valid).toBeTruthy();
      component.uploadForm.get('sale_conditions.shipping_allowed').patchValue(true);
      expect(component.uploadForm.get('delivery_info').valid).toBeFalsy();
    })
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
