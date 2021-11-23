import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionDetailRedirectionComponent } from './transaction-detail-redirection.component';

describe('TransactionDetailRedirectionComponent', () => {
  let component: TransactionDetailRedirectionComponent;
  let fixture: ComponentFixture<TransactionDetailRedirectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionDetailRedirectionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionDetailRedirectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
