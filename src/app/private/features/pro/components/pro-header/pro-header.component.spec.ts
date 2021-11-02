import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { subscriptionsHeaderBenefits } from '@core/subscriptions/subscription-benefits/constants/subscription-benefits';
import { SubscriptionBenefitsService } from '@core/subscriptions/subscription-benefits/services/subscription-benefits.service';
import { MockSubscriptionBenefitsService } from '@fixtures/subscription-benefits.fixture';
import { of } from 'rxjs';

import { ProHeaderComponent } from './pro-header.component';

describe('ProHeaderComponent', () => {
  let component: ProHeaderComponent;
  let fixture: ComponentFixture<ProHeaderComponent>;
  let subscriptionBenefits: SubscriptionBenefitsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProHeaderComponent],
      providers: [
        {
          provide: SubscriptionBenefitsService,
          useClass: MockSubscriptionBenefitsService,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProHeaderComponent);
    component = fixture.componentInstance;
    subscriptionBenefits = TestBed.inject(SubscriptionBenefitsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('benefits', () => {
    describe('and has to show benefits', () => {
      beforeEach(() => {
        component.showBenefits = true;
      });
      describe('and has benefits', () => {
        beforeEach(() => {
          spyOn(subscriptionBenefits, 'getSubscriptionsHeaderBenefits').and.returnValue(of(subscriptionsHeaderBenefits));
          fixture.detectChanges();
        });
        it('should show benefits', () => {
          const benefits = fixture.debugElement.queryAll(By.css('.Benefit'));

          expect(benefits.length).toEqual(subscriptionsHeaderBenefits.length);

          benefits.forEach((benefit, index) => {
            const title: HTMLElement = benefit.query(By.css('.ProHeader__title')).nativeElement;
            expect(title.textContent).toEqual(subscriptionsHeaderBenefits[index].title);

            const description: HTMLElement = benefit.query(By.css('.ProHeader__description')).nativeElement;
            expect(description.textContent).toEqual(subscriptionsHeaderBenefits[index].description);

            const iconSrc: HTMLElement = benefit.query(By.css('tsl-svg-icon')).nativeNode.src;
            expect(iconSrc).toEqual(subscriptionsHeaderBenefits[index].iconPath);
          });
        });
      });
      describe('and has not benefits', () => {
        beforeEach(() => {
          spyOn(subscriptionBenefits, 'getSubscriptionsHeaderBenefits').and.returnValue(of([]));
          fixture.detectChanges();
        });
        it('should not show benefits', () => {
          const benefits = fixture.debugElement.queryAll(By.css('.Benefit'));

          expect(benefits.length).toEqual(0);
        });
      });
    });
    describe('and has not to show benefits', () => {
      beforeEach(() => {
        component.showBenefits = false;
        spyOn(subscriptionBenefits, 'getSubscriptionsHeaderBenefits').and.returnValue(of(subscriptionsHeaderBenefits));
        fixture.detectChanges();
      });
      it('should not show benefits', () => {
        const benefits = fixture.debugElement.queryAll(By.css('.Benefit'));

        expect(benefits.length).toEqual(0);
      });
    });
  });
});
