import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionsSlotsListComponent } from './subscriptions-slots-list.component';
import { SubscriptionsSlotItemComponent } from '../subscriptions-slot-item/subscriptions-slot-item.component';
import { MOCK_SUBSCRIPTION_SLOT_CARS } from '../../../../../tests/subscriptions.fixtures.spec';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('SubscriptionsSlotsListComponent', () => {
  let component: SubscriptionsSlotsListComponent;
  let fixture: ComponentFixture<SubscriptionsSlotsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [ SubscriptionsSlotsListComponent, SubscriptionsSlotItemComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionsSlotsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onSelectSubscription', () => {
    it('should emit correct value', () => {
      spyOn(component.subscriptionSlotSelected, 'emit');

      component.onSelectSubscriptionSlot(MOCK_SUBSCRIPTION_SLOT_CARS);

      expect(component.subscriptionSlotSelected.emit).toHaveBeenCalledTimes(1);
      expect(component.subscriptionSlotSelected.emit).toHaveBeenCalledWith(MOCK_SUBSCRIPTION_SLOT_CARS);
    });
  });
});
