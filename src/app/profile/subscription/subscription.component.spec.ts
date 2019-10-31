import { SubscriptionComponent } from "./subscription.component";
import { ComponentFixture, TestBed, async, fakeAsync, tick } from "@angular/core/testing";
import { CategoryService } from "../../core/category/category.service";
import { SubscriptionsService } from "../../core/subscriptions/subscriptions.service";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { Observable } from "rxjs";
import { CATEGORY_DATA_WEB } from "../../../tests/category.fixtures.spec";
import { MAPPED_SUBSCRIPTIONS } from "../../../tests/subscriptions.fixtures.spec";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddNewSubscriptionModalComponent } from "./modals/add-new-subscription-modal.component";
import { EditSubscriptionModalComponent } from './modals/edit-subscription-modal.component'

describe('SubscriptionComponent', () => {
  let component: SubscriptionComponent;
  let fixture: ComponentFixture<SubscriptionComponent>;
  let categoryService: CategoryService;
  let subscriptionsService: SubscriptionsService;
  let modalService: NgbModal;
  const componentInstance: any = {};
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriptionComponent ],
      providers: [
        EventService,
        {
          provide: SubscriptionsService, useValue: {
            getSubscriptions() {
              return Observable.of(MAPPED_SUBSCRIPTIONS);
            }
          }
        },
        {
          provide: CategoryService, useValue: {
            getCategories() {
                return Observable.of(CATEGORY_DATA_WEB);
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
        },
      ],
    schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));
  
  beforeEach(() => {
    modalService = TestBed.get(NgbModal);
    fixture = TestBed.createComponent(SubscriptionComponent);
    component = fixture.componentInstance;
    subscriptionsService = TestBed.get(SubscriptionsService);
    categoryService = TestBed.get(CategoryService);
    fixture.detectChanges();
  });

  describe('OnInit', () => {
    it('should get the mapped subscriptions', () => {
      spyOn(categoryService, 'getCategories').and.callThrough();
      spyOn(subscriptionsService, 'getSubscriptions').and.callThrough();
      
      component.ngOnInit();
      
      expect(component.subscriptions).toEqual(MAPPED_SUBSCRIPTIONS);
    });

    afterEach(() => {
      TestBed.resetTestingModule();
    });
  });

  describe('openSubscriptionModal', () => {
    it('should open the addNewSubscription modal', () => {
      spyOn(modalService, 'open').and.callThrough();

      component.openSubscriptionModal(MAPPED_SUBSCRIPTIONS[0]);

      expect(modalService.open).toHaveBeenCalledWith(AddNewSubscriptionModalComponent, {
        windowClass: 'review'
      });
    });

    it('should not open the EditSubscription modal', () => {
      spyOn(modalService, 'open').and.callThrough();

      component.openSubscriptionModal(MAPPED_SUBSCRIPTIONS[2]);

      expect(modalService.open).not.toHaveBeenCalledWith(EditSubscriptionModalComponent, {
        windowClass: 'review'
      });
    });

    afterEach(() => {
      TestBed.resetTestingModule();
    });
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });
  
});