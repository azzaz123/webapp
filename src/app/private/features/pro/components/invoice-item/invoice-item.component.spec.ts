import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ErrorsService } from '@core/errors/errors.service';
import { InvoiceService } from '@core/invoice/invoice.service';
import { MOCK_INVOICE_HISTORY } from '@fixtures/invoice.fixtures.spec';
import { of, throwError } from 'rxjs';
import { InvoiceItemComponent } from './invoice-item.component';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';

describe('InvoiceItemComponent', () => {
  const invoiceNotGenerated = MOCK_INVOICE_HISTORY[1];
  let component: InvoiceItemComponent;
  let fixture: ComponentFixture<InvoiceItemComponent>;
  let invoiceService: InvoiceService;
  let errorService: ErrorsService;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [InvoiceItemComponent],
      providers: [
        {
          provide: InvoiceService,
          useValue: {
            downloadInvoice() {
              return of(new Blob());
            },
            generateInvoice() {
              return of(null);
            },
          },
        },
        {
          provide: ErrorsService,
          useValue: {
            show() {},
            i18nError() {},
            i18nSuccess() {},
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceItemComponent);
    component = fixture.componentInstance;
    component.active = true;
    component.invoice = MOCK_INVOICE_HISTORY[0];
    errorService = TestBed.inject(ErrorsService);
    invoiceService = TestBed.inject(InvoiceService);
    fixture.detectChanges();
  });

  describe('when we click on invoice button...', () => {
    it('should handle the invoice', fakeAsync(() => {
      spyOn(component, 'handleInvoice');

      const button = fixture.debugElement.nativeElement.querySelector('tsl-button');
      button.click();
      tick();

      expect(component.handleInvoice).toHaveBeenCalled();
    }));
  });

  describe('when we handle an invoice...', () => {
    beforeEach(() => {
      spyOn(errorService, 'i18nSuccess');
      spyOn(errorService, 'i18nError');
      invoiceNotGenerated.invoice_generated = false;
    });

    describe('when the transaction is active... ', () => {
      describe('when the invoice service succeed.. ', () => {
        it('should have been enabled', () => {
          const invoiceActionButton = fixture.debugElement.query(By.css('tsl-button')).nativeElement;

          fixture.detectChanges();

          expect(invoiceActionButton.disabled).toBe(false);
        });

        it('should generate an invoice and show success message', () => {
          spyOn(invoiceService, 'generateInvoice').and.returnValue(of(null));

          component.handleInvoice(new Event('click'), invoiceNotGenerated);

          expect(invoiceService.generateInvoice).toHaveBeenCalledWith(invoiceNotGenerated);
          expect(invoiceNotGenerated.invoice_generated).toEqual(true);
          expect(errorService.i18nSuccess).toHaveBeenCalledWith(TRANSLATION_KEY.INVOICE_GENERATED);
        });

        it('should download the invoice and show success message', () => {
          spyOn(invoiceService, 'downloadInvoice').and.returnValue(of(new Blob()));

          component.handleInvoice(new Event('click'), component.invoice);

          expect(invoiceService.downloadInvoice).toHaveBeenCalledWith(component.invoice);
          expect(errorService.i18nSuccess).toHaveBeenCalledWith(TRANSLATION_KEY.INVOICE_DOWNLOADED);
        });
      });

      describe('when the invoice service fails.. ', () => {
        it('shouldnt generate the invoice and should show an error', () => {
          spyOn(invoiceService, 'generateInvoice').and.returnValue(throwError(null));

          component.handleInvoice(new Event('click'), invoiceNotGenerated);

          expect(invoiceService.generateInvoice).toHaveBeenCalledWith(invoiceNotGenerated);
          expect(invoiceNotGenerated.invoice_generated).toEqual(false);
          expect(errorService.i18nError).toHaveBeenCalledWith(TRANSLATION_KEY.INVOICE_CANNOT_GENERATE_ERROR);
        });

        it('shouldnt download the invoice and should show an error', () => {
          spyOn(invoiceService, 'downloadInvoice').and.returnValue(throwError(null));

          component.handleInvoice(new Event('click'), component.invoice);

          expect(invoiceService.downloadInvoice).toHaveBeenCalledWith(component.invoice);
          expect(errorService.i18nError).toHaveBeenCalledWith(TRANSLATION_KEY.INVOICE_CANNOT_DOWNLOAD_ERROR);
        });
      });
    });

    describe('when the transaction is not active..', () => {
      beforeEach(() => {
        component.active = false;
      });

      it('should have been disabled', () => {
        const invoiceActionButton = fixture.debugElement.query(By.css('tsl-button')).nativeElement;

        fixture.detectChanges();

        expect(invoiceActionButton.disabled).toBe(true);
      });

      it('it shouldnt call the invoice service', () => {
        spyOn(invoiceService, 'generateInvoice');
        spyOn(invoiceService, 'downloadInvoice');

        component.handleInvoice(new Event('click'), invoiceNotGenerated);

        expect(invoiceService.generateInvoice).not.toHaveBeenCalled();
        expect(invoiceService.downloadInvoice).not.toHaveBeenCalled();
      });
    });
  });
});
