import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountAvailableUnsubscribeInAppModalComponent } from './discount-available-unsubscribe-in-app-modal.component';

describe('DiscountAvailableUnsubscribeInAppModalComponent', () => {
  let component: DiscountAvailableUnsubscribeInAppModalComponent;
  let fixture: ComponentFixture<DiscountAvailableUnsubscribeInAppModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscountAvailableUnsubscribeInAppModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountAvailableUnsubscribeInAppModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
