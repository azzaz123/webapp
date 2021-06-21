import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankDetailsOverviewComponent } from './bank-details-overview.component';

describe('BankDetailsOverviewComponent', () => {
  let component: BankDetailsOverviewComponent;
  let fixture: ComponentFixture<BankDetailsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BankDetailsOverviewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankDetailsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
