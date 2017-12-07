import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ErrorsService, Location, MOCK_USER, TEST_HTTP_PROVIDERS, User, USER_ID } from 'shield';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { NgbModal, NgbPopoverConfig, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { UploadProductComponent } from './upload-product.component';
import { CategoryService } from '../../../core/category/category.service';
import { CATEGORIES_OPTIONS, CATEGORIES_OPTIONS_CONSUMER_GOODS } from '../../../../tests/category.fixtures';
import { PreviewModalComponent } from '../preview-modal/preview-modal.component';

export const MOCK_USER_NO_LOCATION: User = new User(USER_ID);

export const USER_LOCATION: Location = {
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
  let router: Router;
  let categoryService: CategoryService;
  let modalService: NgbModal;
  let componentInstance: any = {};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgbPopoverModule],
      providers: [
        FormBuilder,
        NgbPopoverConfig,
        TEST_HTTP_PROVIDERS,
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
    router = TestBed.get(Router);
    modalService = TestBed.get(NgbModal);
  });

  describe('ngOnChanges', () => {
    it('should get and set categories', () => {
      component.ngOnChanges();
      expect(categoryService.getUploadCategories).toHaveBeenCalled();
      expect(component.categories).toEqual(CATEGORIES_OPTIONS_CONSUMER_GOODS);
    });
    describe('with preselected category', () => {
      beforeEach(() => {
        component.categoryId = '13000';
        component.ngOnChanges();
      });
      it('should set form category_id', () => {
        expect(component.uploadForm.get('category_id').value).toBe('13000');
      });
      it('should set fixedCategory', () => {
        expect(component.fixedCategory).toBe('Real Estate');
      });
    });
  });

  describe('ngAfterViewChecked', () => {
    it('should set focus', fakeAsync(() => {
      component.titleField = {
        nativeElement: {
          focus() {
          }
        }
      };
      spyOn(component.titleField.nativeElement, 'focus');
      fixture.detectChanges();
      tick();
      expect(component.titleField.nativeElement.focus).toHaveBeenCalled();
      expect(component['focused']).toBeTruthy();
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
      component.uploadForm.get('images').patchValue([{'image': true}]);
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
      fixture.detectChanges();
      expect(component.uploadForm.get('delivery_info').valid).toBeTruthy();
      component.uploadForm.get('sale_conditions.shipping_allowed').patchValue(true);
      expect(component.uploadForm.get('delivery_info').valid).toBeFalsy();
    })
  });

  describe('onUploaded', () => {
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
      component.uploadForm.get('images').patchValue([{'image': true}]);
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
      })
    });
    it('should set itemPreview', () => {
      expect(componentInstance.itemPreview).toEqual({
        category_id: '200',
        title: 'test',
        description: 'test',
        'sale_price': 1000000,
        currency_code: 'EUR',
        images: [{'image': true}],
        sale_conditions: {
          fix_price: false,
          exchange_allowed: false,
          shipping_allowed: false
        },
        delivery_info: null,
        location: {
          address: USER_LOCATION.full_address,
          latitude: USER_LOCATION.approximated_latitude,
          longitude: USER_LOCATION.approximated_longitude
        }
      });
    });
    it('should submit form', fakeAsync(() => {
      expect(component.onSubmit).toHaveBeenCalled();
    }));
  });

});
