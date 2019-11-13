import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionsSlotsListComponent } from './subscriptions-slots-list.component';
import { MatIconModule } from '@angular/material/icon';
import { SubscriptionsSlotItemComponent } from '../subscriptions-slot-item/subscriptions-slot-item.component';
import { MOCK_SUBSCRIPTION_SLOT_CARS } from '../../../../../tests/subscriptions.fixtures.spec';

describe('SubscriptionsSlotsListComponent', () => {
  let component: SubscriptionsSlotsListComponent;
  let fixture: ComponentFixture<SubscriptionsSlotsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatIconModule],
      declarations: [ SubscriptionsSlotsListComponent, SubscriptionsSlotItemComponent ]
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
