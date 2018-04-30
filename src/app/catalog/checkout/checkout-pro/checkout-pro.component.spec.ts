import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutProComponent } from './checkout-pro.component';

describe('CheckoutProComponent', () => {
  let component: CheckoutProComponent;
  let fixture: ComponentFixture<CheckoutProComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckoutProComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutProComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
