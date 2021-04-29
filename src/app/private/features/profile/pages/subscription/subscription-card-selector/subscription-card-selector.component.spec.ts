import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionCardSelectorComponent } from './subscription-card-selector.component';

describe('SubscriptionCardSelectorComponent', () => {
  let component: SubscriptionCardSelectorComponent;
  let fixture: ComponentFixture<SubscriptionCardSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubscriptionCardSelectorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionCardSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
