import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubscriptionBenefitsService } from '@core/subscriptions/subscription-benefits/services/subscription-benefits.service';
import { MockSubscriptionBenefitsService } from '@fixtures/subscription-benefits.fixture';

import { ProHeaderComponent } from './pro-header.component';

describe('ProHeaderComponent', () => {
  let component: ProHeaderComponent;
  let fixture: ComponentFixture<ProHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProHeaderComponent],
      providers: [
        {
          provide: SubscriptionBenefitsService,
          useClass: MockSubscriptionBenefitsService,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
