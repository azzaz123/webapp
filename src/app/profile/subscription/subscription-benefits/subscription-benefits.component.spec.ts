import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionBenefitsComponent } from './subscription-benefits.component';

describe('SubscriptionBenefitsComponent', () => {
  let component: SubscriptionBenefitsComponent;
  let fixture: ComponentFixture<SubscriptionBenefitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriptionBenefitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionBenefitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
