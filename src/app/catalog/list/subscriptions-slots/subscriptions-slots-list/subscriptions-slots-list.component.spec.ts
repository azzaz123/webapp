import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionsSlotsListComponent } from './subscriptions-slots-list.component';

describe('SubscriptionsSlotsListComponent', () => {
  let component: SubscriptionsSlotsListComponent;
  let fixture: ComponentFixture<SubscriptionsSlotsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriptionsSlotsListComponent ]
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
});
