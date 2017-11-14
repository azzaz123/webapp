import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewModalComponent } from './preview-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UPLOAD_FORM_ITEM_VALUES } from '../../../../tests/item.fixtures';
import { Observable } from 'rxjs/Observable';
import { CarKeysService } from '../upload-car/car-keys.service';

describe('PreviewModalComponent', () => {
  let component: PreviewModalComponent;
  let fixture: ComponentFixture<PreviewModalComponent>;
  let carKeysService: CarKeysService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        NgbActiveModal,
        {
          provide: CarKeysService, useValue: {
          getTypeName() {
            return Observable.of({});
          }
        }
        },
      ],
      declarations: [ PreviewModalComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewModalComponent);
    component = fixture.componentInstance;
    component.itemPreview = UPLOAD_FORM_ITEM_VALUES;
    carKeysService = TestBed.get(CarKeysService);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('hasCarExtras', () => {
    it('should set hasCarExtras', () => {
      component.itemPreview = {
        gearbox: false,
        body_type: false,
        num_seats: false,
        engine: false
      };
      expect(component.hasCarExtras).toBeFalsy();
      component.itemPreview = {
        gearbox: true,
        body_type: false,
        num_seats: false,
        engine: false
      };
      expect(component.hasCarExtras).toBeTruthy();
    });
  });

  describe('hasExtras', () => {
    it('should set hasExtras', () => {
      component.itemPreview = {
        sale_conditions: {
          fix_price: false,
          shipping_allowed: false,
          exchange_allowed: false
        }
      };
      expect(component.hasExtras).toBeFalsy();
      component.itemPreview = {
        sale_conditions: {
          fix_price: true,
          shipping_allowed: false,
          exchange_allowed: false
        }
      };
      expect(component.hasExtras).toBeTruthy();
    });
  });

  describe('getBodyType', () => {
    it('should set bodyType', () => {
      spyOn(carKeysService, 'getTypeName').and.returnValue(Observable.of('test'));
      component.itemPreview = {
        body_type: 'body'
      };
      component.getBodyType();
      expect(carKeysService.getTypeName).toHaveBeenCalledWith('body');
      expect(component.bodyType).toBe('test');
    });
  });
});
