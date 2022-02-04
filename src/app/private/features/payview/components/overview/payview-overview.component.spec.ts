import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PayviewOverviewComponent } from '@private/features/payview/components/overview/payview-overview.component';

describe('PayviewOverviewComponent', () => {
  let component: PayviewOverviewComponent;
  let fixture: ComponentFixture<PayviewOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PayviewOverviewComponent],
      imports: [HttpClientTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayviewOverviewComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
