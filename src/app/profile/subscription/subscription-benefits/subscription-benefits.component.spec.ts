import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SubscriptionBenefitsComponent } from './subscription-benefits.component';
import { SubscriptionsService } from '../../../core/subscriptions/subscriptions.service';
import { MockSubscriptionService, MOCK_SUBSCRIPTION_BENEFITS } from '../../../../tests/subscriptions.fixtures.spec';
import { By } from '@angular/platform-browser';

describe('SubscriptionBenefitsComponent', () => {
  let component: SubscriptionBenefitsComponent;
  let fixture: ComponentFixture<SubscriptionBenefitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ ],
      declarations: [ SubscriptionBenefitsComponent ],
      providers: [
        { provide: SubscriptionsService, useClass: MockSubscriptionService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
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

  it('should get benefits from backend', () => {
    component.ngOnInit();

    expect(component.benefits).toEqual(MOCK_SUBSCRIPTION_BENEFITS);
  });

  it('should show as many subscription benefits as they come from backend', () => {
    component.ngOnInit();
    fixture.detectChanges();

    const benefitsHTML = fixture.debugElement.queryAll(By.css('.SubscriptionBenefitCard'));
    expect(benefitsHTML.length).toEqual(MOCK_SUBSCRIPTION_BENEFITS.length);
  })
});
