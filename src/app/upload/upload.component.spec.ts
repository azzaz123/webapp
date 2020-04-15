import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UploadComponent } from './upload.component';
import { ItemService } from '../core/item/item.service';
import { PRODUCT_RESPONSE, ITEM_DATA_V3 } from '../../tests/item.fixtures.spec';
import { Observable, of } from 'rxjs';
import { NgxPermissionsModule } from 'ngx-permissions';
import { UserService } from '../core/user/user.service';
import { CARS_CATEGORY } from '../core/item/item-categories';

describe('UploadComponent', () => {
  let component: UploadComponent;
  let fixture: ComponentFixture<UploadComponent>;
  let itemService: ItemService;
  let userService: UserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgxPermissionsModule.forRoot()],
      declarations: [UploadComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: ItemService, useValue: {
            getUrgentProductByCategoryId() { }
          }
        },
        {
          provide: UserService, useValue: {
            isProfessional() {
              return of(false);
            }
          }
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadComponent);
    itemService = TestBed.get(ItemService);
    userService = TestBed.get(UserService);
    component = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(component, 'setCategory');
    });

    it('should set category cars if user is professional', () => {
      spyOn(userService, 'isProfessional').and.returnValue(of(true));

      component.ngOnInit();

      expect(component.setCategory).toHaveBeenCalledWith(CARS_CATEGORY);
    });

    it('should not set any category if user is not professional', () => {
      spyOn(userService, 'isProfessional').and.returnValue(of(false));

      component.ngOnInit();

      expect(component.setCategory).not.toHaveBeenCalled();
    });
  });

  describe('setCategory', () => {
    beforeEach(() => {
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
      spyOn(itemService, 'getUrgentProductByCategoryId').and.returnValue(of(PRODUCT_RESPONSE));

      const categoryId = ITEM_DATA_V3.content.category_id;

      component.getUrgentPrice(categoryId.toString());

      expect(itemService.getUrgentProductByCategoryId).toHaveBeenCalledWith(categoryId.toString());
      expect(component.urgentPrice).toEqual(PRODUCT_RESPONSE.durations[0].market_code);
    });
  });

});
