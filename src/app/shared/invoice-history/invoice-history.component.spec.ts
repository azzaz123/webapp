import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { TestBed, ComponentFixture, fakeAsync } from '@angular/core/testing';
import { InvoiceHistoryComponent } from './invoice-history.component';
import { InvoiceService } from 'app/core/invoice/invoice.service';
import {
  MOCK_INVOICE_HISTORY,
  MOCK_INVOICE_HISTORY_MAPPED,
  MOCK_INVOICE_HISTORY_SORTED,
} from '../../../tests/invoice.fixtures.spec';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('InvoiceComponent', () => {
  let component: InvoiceHistoryComponent;
  let fixture: ComponentFixture<InvoiceHistoryComponent>;
  let invoiceService: InvoiceService;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [InvoiceHistoryComponent],
      providers: [
        {
          provide: InvoiceService,
          useValue: {
            getInvoiceTransactions() {
              return of(MOCK_INVOICE_HISTORY);
            },
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceHistoryComponent);
    component = fixture.componentInstance;
    invoiceService = TestBed.inject(InvoiceService);
  });

  describe('when we need load more data...', () => {
    it('should show load more because we have more than 5 invoices', () => {
      component.invoiceTransactions = MOCK_INVOICE_HISTORY;
      component.total = MOCK_INVOICE_HISTORY.length;

      fixture.detectChanges();
      const loadMoreDiv = fixture.debugElement.query(
        By.css('.InvoiceHistory__load-more-container')
      );

      expect(loadMoreDiv).toBeTruthy();
    });
  });

  describe('when we dont need load more data...', () => {
    it('should NOT show load more because we dont have more than 5 invoices', () => {
      spyOn(invoiceService, 'getInvoiceTransactions').and.returnValue(
        of(MOCK_INVOICE_HISTORY_MAPPED)
      );

      fixture.detectChanges();
      const loadMoreDiv = fixture.debugElement.query(
        By.css('.InvoiceHistory__load-more-container')
      );

      expect(loadMoreDiv).toBeNull();
    });
  });

  describe('when we sort invoices...', () => {
    it('should return the invoices sorted by date', () => {
      component.invoiceTransactions = MOCK_INVOICE_HISTORY;

      expect(component.sortedInvoices).toEqual(MOCK_INVOICE_HISTORY_SORTED);
    });
  });

  describe('when we load more items...', () => {
    it('should update the list limit', () => {
      component.loadMore();

      expect(component.limit).toEqual(10);
    });
  });
});
