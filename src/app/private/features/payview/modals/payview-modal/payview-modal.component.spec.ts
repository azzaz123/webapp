import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PayviewModalComponent } from '@private/features/payview/modals/payview-modal/payview-modal.component';

describe('PayviewModalComponent', () => {
  let component: PayviewModalComponent;
  let fixture: ComponentFixture<PayviewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PayviewModalComponent],
      imports: [HttpClientTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayviewModalComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
