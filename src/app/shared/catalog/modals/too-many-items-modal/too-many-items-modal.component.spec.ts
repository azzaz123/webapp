import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TooManyItemsModalComponent } from './too-many-items-modal.component';
import { ButtonComponent } from '../../../button/button.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ItemService } from '../../../../core/item/item.service';
import { SubscriptionsService } from '../../../../core/subscriptions/subscriptions.service';
import {
  MOCK_ITEM_V3_2,
  MOCK_ITEM_V3_3,
} from '../../../../../tests/item.fixtures.spec';
import {
  MockSubscriptionService,
  MAPPED_SUBSCRIPTIONS_ADDED,
} from '../../../../../tests/subscriptions.fixtures.spec';
import { SUBSCRIPTION_TYPES } from '../../../../core/subscriptions/subscriptions.service';

describe('TooManyItemsModalComponent', () => {
  let component: TooManyItemsModalComponent;
  let fixture: ComponentFixture<TooManyItemsModalComponent>;
  let itemService: ItemService;
  let subscriptionsService: SubscriptionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [TooManyItemsModalComponent, ButtonComponent],
      providers: [
        NgbActiveModal,
        { provide: SubscriptionsService, useClass: MockSubscriptionService },
        {
          provide: ItemService,
          useValue: {
            get() {
              return of(MOCK_ITEM_V3_3);
            },
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TooManyItemsModalComponent);
    itemService = TestBed.inject(ItemService);
    subscriptionsService = TestBed.inject(SubscriptionsService);
    component = fixture.componentInstance;
    component.type = SUBSCRIPTION_TYPES.stripe;
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(subscriptionsService, 'getSubscriptions').and.returnValue(
        of(MAPPED_SUBSCRIPTIONS_ADDED)
      );
    });
    describe('subscription has free trial', () => {
      it('should set isFreeTrial to true', () => {
        spyOn(itemService, 'get').and.returnValue(of(MOCK_ITEM_V3_3));

        component.itemId = MOCK_ITEM_V3_3.id;
        component.ngOnInit();

        expect(component.isFreeTrial).toBe(true);
      });
    });
    describe('subscription has no free trial', () => {
      it('should set isFreeTrial to false', () => {
        spyOn(itemService, 'get').and.returnValue(of(MOCK_ITEM_V3_2));

        component.itemId = MOCK_ITEM_V3_2.id;
        component.ngOnInit();

        expect(component.isFreeTrial).toBe(false);
      });
    });
  });
});
