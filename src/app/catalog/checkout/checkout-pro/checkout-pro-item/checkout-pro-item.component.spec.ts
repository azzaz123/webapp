import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutProItemComponent } from './checkout-pro-item.component';

describe('CheckoutProItemComponent', () => {
  let component: CheckoutProItemComponent;
  let fixture: ComponentFixture<CheckoutProItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckoutProItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutProItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
