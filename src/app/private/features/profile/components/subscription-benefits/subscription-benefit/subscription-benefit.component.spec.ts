import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SubscriptionBenefitComponent } from './subscription-benefit.component';

describe('SubscriptionBenefitsComponent', () => {
  let component: SubscriptionBenefitComponent;
  let fixture: ComponentFixture<SubscriptionBenefitComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [],
        declarations: [SubscriptionBenefitComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionBenefitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show title', () => {
    const expected = 'testTitle';
    component.title = expected;

    fixture.detectChanges();
    const titleHtml = fixture.debugElement.query(By.css('.SubscriptionBenefit__title'));

    expect(titleHtml.nativeElement.textContent).toEqual(expected);
  });

  it('should show description', () => {
    const expected = 'testDescription';
    component.description = expected;

    fixture.detectChanges();
    const descriptionHtml = fixture.debugElement.query(By.css('.SubscriptionBenefit__subtitle'));

    expect(descriptionHtml.nativeElement.textContent).toEqual(expected);
  });
});
