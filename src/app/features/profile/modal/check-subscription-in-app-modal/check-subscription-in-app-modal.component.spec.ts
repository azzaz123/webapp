import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CheckSubscriptionInAppModalComponent } from './check-subscription-in-app-modal.component';

describe('CheckSubscriptionInAppModalComponent', () => {
  let component: CheckSubscriptionInAppModalComponent;
  let fixture: ComponentFixture<CheckSubscriptionInAppModalComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CheckSubscriptionInAppModalComponent],
        providers: [NgbActiveModal],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckSubscriptionInAppModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
