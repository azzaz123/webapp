import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DiscountAvailableUnsubscribeInAppModalComponent } from './discount-available-unsubscribe-in-app-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DiscountAvailableUnsubscribeInAppModalComponent', () => {
  let component: DiscountAvailableUnsubscribeInAppModalComponent;
  let fixture: ComponentFixture<DiscountAvailableUnsubscribeInAppModalComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [DiscountAvailableUnsubscribeInAppModalComponent],
        providers: [NgbActiveModal],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(
      DiscountAvailableUnsubscribeInAppModalComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
