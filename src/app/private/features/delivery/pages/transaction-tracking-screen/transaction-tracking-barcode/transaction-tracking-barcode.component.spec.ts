import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ActivatedRoute } from '@angular/router';
import { ButtonComponent } from '@shared/button/button.component';
import { DELIVERY_PATH_PARAMS } from '@private/features/delivery/delivery-routing-constants';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';
import { TransactionTrackingBarcodeComponent } from '@private/features/delivery/pages/transaction-tracking-screen';
import { TransactionTrackingHeaderComponent } from '@private/features/delivery/pages/transaction-tracking-screen/components/sections';

const fakeBarcode = 'This_is_a_fake_barcode';
const transactionTrackingBarcodeSelector = '#barcode';
const transactionTrackingBarcodeImageSelector = `${transactionTrackingBarcodeSelector} img`;
const transactionTrackingHeaderSelector = 'tsl-transaction-tracking-header';

describe('TransactionTrackingBarcodeComponent', () => {
  let component: TransactionTrackingBarcodeComponent;
  let fixture: ComponentFixture<TransactionTrackingBarcodeComponent>;
  let debugElement: DebugElement;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [ButtonComponent, SvgIconComponent, TransactionTrackingBarcodeComponent, TransactionTrackingHeaderComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => {
                  if (key === DELIVERY_PATH_PARAMS.BARCODE) {
                    return fakeBarcode;
                  }
                  return 'bad param';
                },
              },
            },
          },
        },
      ],
    }).compileComponents();
  });

  describe('WHEN starting the component', () => {
    beforeEach(() => {
      activatedRoute = TestBed.inject(ActivatedRoute);
      fixture = TestBed.createComponent(TransactionTrackingBarcodeComponent);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should show the header', () => {
      const header = debugElement.query(By.css(transactionTrackingHeaderSelector));

      expect(header).toBeTruthy();
    });

    it('should show the barcode container', () => {
      const barcode = debugElement.query(By.css(transactionTrackingBarcodeSelector));

      expect(barcode).toBeTruthy();
    });

    it('should show the barcode image', () => {
      const barcode = debugElement.query(By.css(transactionTrackingBarcodeImageSelector));

      expect(barcode).toBeTruthy();
    });
  });
  describe('WHEN there is no barcode', () => {
    beforeEach(() => {
      TestBed.overrideProvider(ActivatedRoute, {
        useValue: {
          snapshot: {
            paramMap: {
              get: () => {
                return null;
              },
            },
          },
        },
      });
      fixture = TestBed.createComponent(TransactionTrackingBarcodeComponent);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
      fixture.detectChanges();
    });

    it('should not show the barcode', () => {
      const barcode = debugElement.query(By.css(transactionTrackingBarcodeImageSelector));

      expect(barcode).toBeFalsy();
    });
  });
});
