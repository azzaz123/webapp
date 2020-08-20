import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { InvoiceItemComponent } from './invoice-item.component';
import { MOCK_INVOICE_HISTORY, MOCK_INVOICE_DOWNLOAD } from '../../../../tests/invoice.fixtures.spec';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { InvoiceService } from 'app/core/invoice/invoice.service';
import { of } from 'rxjs';

describe('InvoiceItemComponent', () => {
  let component: InvoiceItemComponent;
  let fixture: ComponentFixture<InvoiceItemComponent>;
  let invoiceService: InvoiceService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InvoiceItemComponent],
      providers: [
        {
          provide: InvoiceService, useValue: {
            downloadInvoice() {
              return of(MOCK_INVOICE_DOWNLOAD)
            }
          }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceItemComponent);
    invoiceService = TestBed.get(InvoiceService);
    component = fixture.componentInstance;
  });
  
  describe('downloadInvoice', () => {
    it('should download the invoice on click', () => {
      const event = new Event('MouseEvent');
      spyOn(event, 'stopPropagation');

      component.downloadInvoice(event, MOCK_INVOICE_HISTORY[0]);

    });
  });

});
