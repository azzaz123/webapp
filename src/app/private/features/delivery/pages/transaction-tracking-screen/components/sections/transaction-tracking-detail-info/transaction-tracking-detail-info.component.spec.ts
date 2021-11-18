import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionTrackingDetailInfoComponent } from './transaction-tracking-detail-info.component';

describe('TransactionTrackingDetailInfoComponent', () => {
  let component: TransactionTrackingDetailInfoComponent;
  let fixture: ComponentFixture<TransactionTrackingDetailInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionTrackingDetailInfoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionTrackingDetailInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
