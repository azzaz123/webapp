import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionTrackingActionUserActionComponent } from './transaction-tracking-action-user-action.component';

describe('TransactionTrackingActionUserActionComponent', () => {
  let component: TransactionTrackingActionUserActionComponent;
  let fixture: ComponentFixture<TransactionTrackingActionUserActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionTrackingActionUserActionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionTrackingActionUserActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
