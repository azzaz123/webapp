import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PayviewSummaryHeaderComponent } from '@private/features/payview/modules/summary/components/header/payview-summary-header.component';

describe('PayviewSummaryHeaderComponent', () => {
  let component: PayviewSummaryHeaderComponent;
  let fixture: ComponentFixture<PayviewSummaryHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PayviewSummaryHeaderComponent],
      imports: [HttpClientTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayviewSummaryHeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
