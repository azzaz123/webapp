import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionTrackingGeneralInfoComponent } from './transaction-tracking-general-info.component';

describe('TransactionTrackingGeneralInfoComponent', () => {
  let component: TransactionTrackingGeneralInfoComponent;
  let fixture: ComponentFixture<TransactionTrackingGeneralInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionTrackingGeneralInfoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionTrackingGeneralInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
