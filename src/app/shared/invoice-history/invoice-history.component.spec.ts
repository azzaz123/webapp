import { of } from 'rxjs';
import { TestBed, ComponentFixture, fakeAsync } from '@angular/core/testing';
import { InvoiceHistoryComponent } from './invoice-history.component';
import { InvoiceService } from 'app/core/invoice/invoice.service';
import {
  MOCK_INVOICE_HISTORY,
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
    invoiceService = TestBed.get(InvoiceService);
  });

  describe('showLoadMore', () => {
    it('should set showLoadMore to there are more than 5 invoices', () => {
      component.invoiceTransactions = MOCK_INVOICE_HISTORY;
      component.total = MOCK_INVOICE_HISTORY.length;

      component.showLoadMore();

      expect(component.showLoadMore()).toBe(true);
    });
  });

  describe('sortedInvoices', () => {
    it('should return the invoices sorted by date', () => {
      component.invoiceTransactions = MOCK_INVOICE_HISTORY;

      expect(component.sortedInvoices).toEqual(MOCK_INVOICE_HISTORY_SORTED);
    });
  });

  describe('loadMore', () => {
    it('should update the list limit', () => {
      component.loadMore();

      expect(component.limit).toEqual(10);
    });
  });
});
