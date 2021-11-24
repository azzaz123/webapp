import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionDetailSelectorComponent } from './transaction-detail-selector.component';

describe('TransactionDetailSelectorComponent', () => {
  let component: TransactionDetailSelectorComponent;
  let fixture: ComponentFixture<TransactionDetailSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionDetailSelectorComponent],
      imports: [],
      providers: [],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionDetailSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
