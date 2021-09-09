import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CategoryService } from '@core/category/category.service';
import { CATEGORIES_DATA_CONSUMER_GOODS } from '@fixtures/category.fixtures.spec';
import { MOCK_SUBSCRIPTION_CONSUMER_GOODS_NOT_SUBSCRIBED_MAPPED } from '@fixtures/subscriptions.fixtures.spec';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SelectOptionComponent } from '@shared/form/components/select/select-option/select-option.component';
import { of } from 'rxjs';
import { CategoryListingModalComponent } from './category-listing-modal.component';

describe('CategoryListingModalComponent', () => {
  let component: CategoryListingModalComponent;
  let fixture: ComponentFixture<CategoryListingModalComponent>;
  let activeModal: NgbActiveModal;
  let categoryService: CategoryService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CategoryListingModalComponent, SelectOptionComponent],
        providers: [
          {
            provide: CategoryService,
            useValue: {
              getCategoryById() {},
            },
          },
          {
            provide: NgbActiveModal,
            useValue: {
              close() {},
            },
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryListingModalComponent);
    component = fixture.componentInstance;
    activeModal = TestBed.inject(NgbActiveModal);
    categoryService = TestBed.inject(CategoryService);
    component.subscription = MOCK_SUBSCRIPTION_CONSUMER_GOODS_NOT_SUBSCRIBED_MAPPED;
  });

  describe('Show categories', () => {
    describe('and category exists', () => {
      beforeEach(() => {
        spyOn(categoryService, 'getCategoryById').and.returnValue(of(CATEGORIES_DATA_CONSUMER_GOODS[0]));
        fixture.detectChanges();
      });
      it('should show category', () => {
        const items = fixture.debugElement.queryAll(By.directive(SelectOptionComponent));

        expect(items.length).toEqual(component.subscription.category_ids.length);
      });
    });
    describe('and category not exists', () => {
      beforeEach(() => {
        spyOn(categoryService, 'getCategoryById').and.returnValue(of(undefined));
        fixture.detectChanges();
      });
      it('should show not category', () => {
        const items = fixture.debugElement.query(By.directive(SelectOptionComponent));

        expect(items).toBeFalsy();
      });
    });
  });

  describe('Close modal', () => {
    it('should close modal', () => {
      spyOn(activeModal, 'close').and.callThrough();

      component.onClose();

      expect(activeModal.close).toHaveBeenCalledTimes(1);
      expect(activeModal.close).toHaveBeenCalledWith();
    });
  });
});
