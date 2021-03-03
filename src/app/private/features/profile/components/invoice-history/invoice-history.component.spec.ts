import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { InvoiceService } from '@core/invoice/invoice.service';
import { MOCK_INVOICE_HISTORY, MOCK_INVOICE_HISTORY_MAPPED, MOCK_INVOICE_HISTORY_SORTED } from '@fixtures/invoice.fixtures.spec';
import { of, throwError } from 'rxjs';
import { InvoiceHistoryComponent, TRANSACTIONS_FILTERS } from './invoice-history.component';

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

      fixture.detectChanges();
      const loadMoreDiv = fixture.debugElement.query(By.css('.InvoiceHistory__load-more-container'));

      expect(loadMoreDiv).toBeTruthy();
    });
  });

  describe('when we dont need load more data...', () => {
    it('should NOT show load more because we dont have more than 5 invoices', () => {
      spyOn(invoiceService, 'getInvoiceTransactions').and.returnValue(of(MOCK_INVOICE_HISTORY_MAPPED));

      fixture.detectChanges();
      const loadMoreDiv = fixture.debugElement.query(By.css('.InvoiceHistory__load-more-container'));

      expect(loadMoreDiv).toBeNull();
    });
  });

  describe('when there is a error', () => {
    it('should show a error message', () => {
      spyOn(invoiceService, 'getInvoiceTransactions').and.returnValue(throwError('error'));
      fixture.detectChanges();

      const content = fixture.debugElement.query(By.css('.content'));
      const element = content.queryAll(By.css('span'));

      expect(element).toHaveLength(1);
      expect(element[0].nativeElement.textContent).toBe('Sorry, we cannot load your invoices at this time. Please try again later.');
    });
  });

  describe('when the transactions are empty', () => {
    it('should show empty invoices message if has invoice data', () => {
      spyOn(invoiceService, 'getInvoiceTransactions').and.returnValue(of([]));
      component.active = true;

      fixture.detectChanges();

      const content = fixture.debugElement.query(By.css('.content'));
      const element = content.queryAll(By.css('span'));

      expect(element).toHaveLength(1);
      expect(element[0].nativeElement.textContent).toBe('Your history is empty.');
    });
    it('should show empty invoice date message if has not invoice data', () => {
      spyOn(invoiceService, 'getInvoiceTransactions').and.returnValue(of([]));
      component.active = false;

      fixture.detectChanges();

      const content = fixture.debugElement.query(By.css('.content'));
      const element = content.queryAll(By.css('span'));

      expect(element).toHaveLength(1);
      expect(element[0].nativeElement.textContent).toBe(
        "You don't have any old invoices. Fill in the invoicing data for future purchases."
      );
    });
  });

  describe('when we load more items...', () => {
    it('should update the list limit in the current filter', () => {
      component.selectedFilter = TRANSACTIONS_FILTERS.ALL;

      component.loadMore();

      expect(component.filterConfig[TRANSACTIONS_FILTERS.ALL].limit).toEqual(10);
      expect(component.filterConfig[TRANSACTIONS_FILTERS.INVOICES].limit).toEqual(5);
      expect(component.filterConfig[TRANSACTIONS_FILTERS.CREDIT].limit).toEqual(5);
    });
  });

  describe('when we change category', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });
    describe('... an select all', () => {
      it('should show all transaciones', () => {
        component.onChangeFilter(TRANSACTIONS_FILTERS.ALL);
        fixture.detectChanges();

        expect(component.filteredTransactions).toEqual(MOCK_INVOICE_HISTORY_SORTED);
        expect(component.invoiceTransactions).toEqual(MOCK_INVOICE_HISTORY_SORTED);
      });
      it('should button all has to be selected', () => {
        component.onChangeFilter(TRANSACTIONS_FILTERS.ALL);
        fixture.detectChanges();

        const selectedButton = fixture.debugElement.queryAll(By.css('.invoice--selected'));

        expect(selectedButton).toHaveLength(1);
        expect(selectedButton[0].nativeElement.textContent).toBe('All');
      });
    });
    describe('... an select invoices', () => {
      it('should show only invoices', () => {
        const expected = MOCK_INVOICE_HISTORY_SORTED.filter((invoice) => invoice.price >= 0);

        component.onChangeFilter(TRANSACTIONS_FILTERS.INVOICES);
        fixture.detectChanges();

        expect(component.filteredTransactions).toEqual(expected);
        expect(component.invoiceTransactions).toEqual(MOCK_INVOICE_HISTORY_SORTED);
      });
      it('should button invoices has to be selected', () => {
        component.onChangeFilter(TRANSACTIONS_FILTERS.INVOICES);
        fixture.detectChanges();

        const selectedButton = fixture.debugElement.queryAll(By.css('.invoice--selected'));

        expect(selectedButton).toHaveLength(1);
        expect(selectedButton[0].nativeElement.textContent).toBe('Invoices');
      });
    });
    describe('... an select credit memos', () => {
      it('should show only credit memos', () => {
        const expected = MOCK_INVOICE_HISTORY_SORTED.filter((invoice) => invoice.price < 0);

        component.onChangeFilter(TRANSACTIONS_FILTERS.CREDIT);
        fixture.detectChanges();

        expect(component.filteredTransactions).toEqual(expected);
        expect(component.invoiceTransactions).toEqual(MOCK_INVOICE_HISTORY_SORTED);
      });
      it('should button credit memos has to be selected', () => {
        component.onChangeFilter(TRANSACTIONS_FILTERS.CREDIT);
        fixture.detectChanges();

        const selectedButton = fixture.debugElement.queryAll(By.css('.invoice--selected'));

        expect(selectedButton).toHaveLength(1);
        expect(selectedButton[0].nativeElement.textContent).toBe('Credit memos');
      });
    });
  });
});
