import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UploadComponent } from './upload.component';
import { ItemService } from '../../core/item/item.service';
import { PRODUCT_RESPONSE, ITEM_DATA_V3 } from '../../../tests/item.fixtures.spec';
import { Observable } from 'rxjs/Observable';
import { NgxPermissionsModule } from 'ngx-permissions';

describe('UploadComponent', () => {
  let component: UploadComponent;
  let fixture: ComponentFixture<UploadComponent>;
  let itemService: ItemService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgxPermissionsModule.forRoot()],
      declarations: [UploadComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: ItemService, useValue: {
            getUrgentProductByCategoryId() {}
          }
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadComponent);
    itemService = TestBed.get(ItemService);
    component = fixture.componentInstance;
  });

  describe('setCategory', () => {
    beforeEach( () => {
      spyOn(component, 'getUrgentPrice');
    });
    it('should set categoryId', () => {
      const CATEGORY_ID = 123;

      component.setCategory(CATEGORY_ID.toString());

      expect(component.categoryId).toBe(CATEGORY_ID.toString());
    });

    it('should not call getUrgentPrice if categoryId == -1', () => {
      const CATEGORY_ID = -1;

      component.setCategory(CATEGORY_ID.toString());

      expect(component.getUrgentPrice).not.toHaveBeenCalled();
    });
    it('should call getUrgentPrice if categoryId != -1', () => {
      const CATEGORY_ID = 123;

      component.setCategory(CATEGORY_ID.toString());

      expect(component.getUrgentPrice).toHaveBeenCalledWith(CATEGORY_ID.toString());
    });
  });

  describe('onValidationError', () => {
    it('should set scrollTop to 0', () => {
      component.scrollPanel = {
        nativeElement: {}
      };

      component.onValidationError();

      expect(component.scrollPanel.nativeElement.scrollTop).toBe(0);
    });
  });

  describe('get urgent price', () => {
    it('should set the urgent price', () => {
      spyOn(itemService, 'getUrgentProductByCategoryId').and.returnValue(Observable.of(PRODUCT_RESPONSE));

      const categoryId = ITEM_DATA_V3.content.category_id;

      component.getUrgentPrice(categoryId.toString());

      expect(itemService.getUrgentProductByCategoryId).toHaveBeenCalledWith(categoryId.toString());
      expect(component.urgentPrice).toEqual(PRODUCT_RESPONSE.durations[0].market_code);
    });
  });

});
