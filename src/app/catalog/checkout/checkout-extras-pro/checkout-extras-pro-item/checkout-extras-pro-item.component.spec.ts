import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutExtrasProItemComponent } from './checkout-extras-pro-item.component';

describe('CheckoutExtrasProItemComponent', () => {
  let component: CheckoutExtrasProItemComponent;
  let fixture: ComponentFixture<CheckoutExtrasProItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckoutExtrasProItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutExtrasProItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
