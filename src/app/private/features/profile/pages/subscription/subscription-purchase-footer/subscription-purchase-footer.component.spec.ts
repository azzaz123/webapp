import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionPurchaseFooterComponent } from './subscription-purchase-footer.component';

describe('SubscriptionPurchaseFooterComponent', () => {
  let component: SubscriptionPurchaseFooterComponent;
  let fixture: ComponentFixture<SubscriptionPurchaseFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubscriptionPurchaseFooterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionPurchaseFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
