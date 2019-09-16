import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionsSlotItemComponent } from './subscriptions-slot-item.component';
import { MatIconModule } from '@angular/material/icon';
import { MOCK_SUBSCRIPTION_SLOT } from '../../../../../tests/subscriptions.fixtures.spec';

describe('SubscriptionsSlotItemComponent', () => {
  let component: SubscriptionsSlotItemComponent;
  let fixture: ComponentFixture<SubscriptionsSlotItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ MatIconModule ],
      declarations: [ SubscriptionsSlotItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionsSlotItemComponent);
    component = fixture.componentInstance;
    component.subscriptionSlot = MOCK_SUBSCRIPTION_SLOT;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
