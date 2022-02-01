import { ActivatedRoute } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayviewOverviewComponent } from '@private/features/payview/components/overview/payview-overview.component';

describe('PayviewOverviewComponent', () => {
  const fakeHash: string = 'this_is_a_fake_hash';

  let component: PayviewOverviewComponent;
  let fixture: ComponentFixture<PayviewOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PayviewOverviewComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => fakeHash,
              },
            },
          },
        },
      ],
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
