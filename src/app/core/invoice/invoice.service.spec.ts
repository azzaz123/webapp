import { of,  Observable } from 'rxjs';
import { InvoiceService, INVOICE_HISTORY_ENDPOINT } from './invoice.service';
import { HttpTestingController, HttpClientTestingModule, TestRequest } from '@angular/common/http/testing';
import { TestBed, async } from '@angular/core/testing';
import { environment } from 'environments/environment';
import { Invoice } from './invoice.interface';
import { MOCK_INVOICE_HISTORY, MOCK_INVOICE_HISTORY_MAPPED } from '../../../tests/invoice.fixtures.spec';
import { CategoryService } from '../category/category.service';
import { I18nService } from '../i18n/i18n.service';

describe('InvoiceService', () => {
  let service: InvoiceService;
  let httpMock: HttpTestingController;
  let categoryService: CategoryService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        InvoiceService,
        CategoryService,
        I18nService
      ],
      imports: [HttpClientTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    service = TestBed.get(InvoiceService);
    categoryService = TestBed.get(CategoryService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  xdescribe('getInvoices', () => {
    it('should get user billing info', () => {
      const expectedUrl = `${environment.baseUrl}${INVOICE_HISTORY_ENDPOINT}/billing-info/me`;
      let response: Invoice[];

      service.getInvoices().subscribe(r => response = r);
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(MOCK_INVOICE_HISTORY);

      expect(req.request.url).toEqual(expectedUrl);
      expect(response).toEqual(MOCK_INVOICE_HISTORY);
      expect(req.request.method).toBe('GET');
    });

    it('should map the invoices and add the category properties', () => {
      const expectedUrl = `${environment.baseUrl}${INVOICE_HISTORY_ENDPOINT}`;
      const invoicesWithCategory: Invoice[] = [...MOCK_INVOICE_HISTORY];
      service.invoices = null;
      let response: Invoice[];

      service.getInvoices(false).subscribe((res) => response = res);
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(invoicesWithCategory);

      const invoiceWithCategory = response.find(invoice => invoice.category_id === 0);
      const consumerGoodsCategory = categoryService.getConsumerGoodsCategory();
      expect(req.request.url).toBe(expectedUrl);
      expect(response).toEqual(invoicesWithCategory);
      expect(invoiceWithCategory[0].category_icon).toEqual(consumerGoodsCategory.icon_id);
      expect(invoiceWithCategory[0].category_name).toEqual(consumerGoodsCategory.name);
    })
  });

});
