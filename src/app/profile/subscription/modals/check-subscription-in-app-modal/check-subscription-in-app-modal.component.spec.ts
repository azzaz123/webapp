import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckSubscriptionInAppModalComponent } from './check-subscription-in-app-modal.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('CheckSubscriptionInAppModalComponent', () => {
  let component: CheckSubscriptionInAppModalComponent;
  let fixture: ComponentFixture<CheckSubscriptionInAppModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckSubscriptionInAppModalComponent ],
      providers: [
        NgbActiveModal
      ],
      schemas: [NO_ERRORS_SCHEMA]
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
