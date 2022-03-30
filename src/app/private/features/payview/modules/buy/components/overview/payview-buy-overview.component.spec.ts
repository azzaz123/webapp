import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ButtonComponent } from '@shared/button/button.component';
import { PayviewBuyOverviewComponent } from '@private/features/payview/modules/buy/components/overview/payview-buy-overview.component';

describe('PayviewBuyOverviewComponent', () => {
  const payviewBuySelector: string = '.PayviewBuy';

  let component: PayviewBuyOverviewComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<PayviewBuyOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ButtonComponent, PayviewBuyOverviewComponent],
      imports: [HttpClientTestingModule],
      providers: [],
    }).compileComponents();
  });

  describe('WHEN initializes', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(PayviewBuyOverviewComponent);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;

      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });
});
