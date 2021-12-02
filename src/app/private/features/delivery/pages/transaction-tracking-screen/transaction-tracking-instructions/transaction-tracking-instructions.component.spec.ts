import { ActivatedRoute } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ButtonComponent } from '@shared/button/button.component';
import { MOCK_TRANSACTION_TRACKING_INSTRUCTIONS } from '@api/fixtures/core/model/transaction/tracking/transaction-tracking-instructions.fixtures.spec';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';
import { TransactionTrackingBannerComponent } from '@private/features/delivery/pages/transaction-tracking-screen/components/banner/transaction-tracking-banner.component';
import { TransactionTrackingHeaderComponent } from '@private/features/delivery/pages/transaction-tracking-screen/components/sections';
import { TransactionTrackingInstructionsComponent } from '@private/features/delivery/pages/transaction-tracking-screen';
import { TransactionTrackingService } from '@api/bff/delivery/transaction-tracking/transaction-tracking.service';

import { of } from 'rxjs';

describe('TransactionTrackingInstructionsComponent', () => {
  let component: TransactionTrackingInstructionsComponent;
  let fixture: ComponentFixture<TransactionTrackingInstructionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [
        ButtonComponent,
        SvgIconComponent,
        TransactionTrackingBannerComponent,
        TransactionTrackingHeaderComponent,
        TransactionTrackingInstructionsComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => 'some value',
              },
            },
          },
        },
        {
          provide: TransactionTrackingService,
          useValue: {
            getInstructions() {
              return of(MOCK_TRANSACTION_TRACKING_INSTRUCTIONS);
            },
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionTrackingInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
