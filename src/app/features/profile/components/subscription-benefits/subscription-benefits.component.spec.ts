import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import {
  MockSubscriptionService,
  MOCK_SUBSCRIPTION_BENEFITS,
} from '@fixtures/subscriptions.fixtures.spec';
import { SubscriptionBenefitsComponent } from './subscription-benefits.component';

describe('SubscriptionBenefitsComponent', () => {
  let component: SubscriptionBenefitsComponent;
  let fixture: ComponentFixture<SubscriptionBenefitsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [],
        declarations: [SubscriptionBenefitsComponent],
        providers: [
          { provide: SubscriptionsService, useClass: MockSubscriptionService },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

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

    const benefitsHTML = fixture.debugElement.queryAll(
      By.css('.SubscriptionBenefitCard')
    );
    expect(benefitsHTML.length).toEqual(MOCK_SUBSCRIPTION_BENEFITS.length);
  });
});
