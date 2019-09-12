import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionsSlotItemComponent } from './subscriptions-slot-item.component';

describe('SubscriptionsSlotItemComponent', () => {
  let component: SubscriptionsSlotItemComponent;
  let fixture: ComponentFixture<SubscriptionsSlotItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriptionsSlotItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionsSlotItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
