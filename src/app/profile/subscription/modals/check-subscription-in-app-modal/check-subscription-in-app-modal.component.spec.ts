import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckSubscriptionInAppModalComponent } from './check-subscription-in-app-modal.component';

describe('CheckSubscriptionInAppModalComponent', () => {
  let component: CheckSubscriptionInAppModalComponent;
  let fixture: ComponentFixture<CheckSubscriptionInAppModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckSubscriptionInAppModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckSubscriptionInAppModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
