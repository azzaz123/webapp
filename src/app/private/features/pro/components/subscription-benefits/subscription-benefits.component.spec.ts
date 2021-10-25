import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SubscriptionBenefitsService } from '@core/subscriptions/subscription-benefits/services/subscription-benefits.service';
import { subscriptionBenefitsMapped } from '@fixtures/subscription-benefits.fixture';
import { SubscriptionBenefitComponent } from './subscription-benefit/subscription-benefit.component';
import { SubscriptionBenefitsComponent } from './subscription-benefits.component';

describe('SubscriptionBenefitsComponent', () => {
  let component: SubscriptionBenefitsComponent;
  let fixture: ComponentFixture<SubscriptionBenefitsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [],
        declarations: [SubscriptionBenefitsComponent, SubscriptionBenefitComponent],
        providers: [SubscriptionBenefitsService],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionBenefitsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get benefits from backend', () => {
    component.ngOnInit();

    expect(component.benefits).toEqual(subscriptionBenefitsMapped);
  });

  it('should show as many subscription benefits as they come from backend', () => {
    component.ngOnInit();
    fixture.detectChanges();

    const benefitsHTML = fixture.debugElement.queryAll(By.directive(SubscriptionBenefitComponent));
    expect(benefitsHTML.length).toEqual(subscriptionBenefitsMapped.length);
  });
});
