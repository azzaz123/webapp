import { DecimalPipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UPLOAD_FORM_CAR_VALUES } from '@fixtures/item.fixtures.spec';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomCurrencyPipe } from '@shared/pipes';
import { of } from 'rxjs';
import { CarKeysService } from '../../core/services/car-keys/car-keys.service';
import { PreviewModalComponent } from './preview-modal.component';

describe('PreviewModalComponent', () => {
  let component: PreviewModalComponent;
  let fixture: ComponentFixture<PreviewModalComponent>;
  let carKeysService: CarKeysService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        providers: [
          NgbActiveModal,
          DecimalPipe,
          {
            provide: CarKeysService,
            useValue: {
              getTypeName() {
                return of({});
              },
            },
          },
        ],
        declarations: [PreviewModalComponent, CustomCurrencyPipe],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewModalComponent);
    component = fixture.componentInstance;
    component.itemPreview = UPLOAD_FORM_CAR_VALUES;
    carKeysService = TestBed.inject(CarKeysService);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('hasCarExtras', () => {
    it('should set hasCarExtras', () => {
      component.itemPreview = UPLOAD_FORM_CAR_VALUES;
      expect(component.hasCarExtras).toBeTruthy();
      component.itemPreview = {
        ...UPLOAD_FORM_CAR_VALUES,
        gearbox: '',
        body_type: '',
        num_seats: null,
        engine: '',
      };
      expect(component.hasCarExtras).toBeFalsy();
    });
  });

  describe('hasExtras', () => {
    it('should set hasExtras', () => {
      component.itemPreview = {
        ...UPLOAD_FORM_CAR_VALUES,
        sale_conditions: {
          fix_price: false,
          shipping_allowed: false,
          exchange_allowed: false,
        },
      };
      expect(component.hasExtras).toBeFalsy();
      component.itemPreview = {
        ...UPLOAD_FORM_CAR_VALUES,
        sale_conditions: {
          fix_price: true,
          shipping_allowed: false,
          exchange_allowed: false,
        },
      };
      expect(component.hasExtras).toBeTruthy();
    });
  });

  describe('getBodyType', () => {
    it('should set bodyType', () => {
      spyOn(carKeysService, 'getTypeName').and.returnValue(of('test'));
      component.itemPreview = {
        ...UPLOAD_FORM_CAR_VALUES,
        body_type: 'body',
      };
      component.getBodyType();
      expect(carKeysService.getTypeName).toHaveBeenCalledWith('body');
      expect(component.bodyType).toBe('test');
    });
  });
});
