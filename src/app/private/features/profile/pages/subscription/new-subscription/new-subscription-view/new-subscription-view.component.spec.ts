import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAPPED_SUBSCRIPTIONS } from '@fixtures/subscriptions.fixtures.spec';

import { NewSubscriptionViewComponent } from './new-subscription-view.component';

describe('NewSubscriptionViewComponent', () => {
  let component: NewSubscriptionViewComponent;
  let fixture: ComponentFixture<NewSubscriptionViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewSubscriptionViewComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSubscriptionViewComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.subscription = MAPPED_SUBSCRIPTIONS[0];
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
