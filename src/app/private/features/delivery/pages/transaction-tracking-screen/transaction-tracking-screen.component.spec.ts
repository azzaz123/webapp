import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionTrackingScreenComponent } from './transaction-tracking-screen.component';

describe('TransactionTrackingScreenComponent', () => {
  let component: TransactionTrackingScreenComponent;
  let fixture: ComponentFixture<TransactionTrackingScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionTrackingScreenComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionTrackingScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
