import {
  InvoiceService,
  INVOICE_DOWNLOAD_ENDPOINT,
  INVOICE_HISTORY_ENDPOINT,
} from './invoice.service';
import {
  HttpTestingController,
  HttpClientTestingModule,
  TestRequest,
} from '@angular/common/http/testing';
import { TestBed, fakeAsync } from '@angular/core/testing';
import { environment } from 'environments/environment';
import { MOCK_INVOICE_HISTORY } from '../../../tests/invoice.fixtures.spec';
import { InvoiceTransaction } from './invoice.interface';

describe('InvoiceService', () => {
  const invoice = MOCK_INVOICE_HISTORY[0];
  let service: InvoiceService;
  let httpMock: HttpTestingController;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      providers: [InvoiceService],
      imports: [HttpClientTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    service = TestBed.inject(InvoiceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('when requesting transactions...', () => {
    it('should get user transactions', () => {
      const expectedUrl = `${environment.baseUrl}${INVOICE_HISTORY_ENDPOINT}`;
      let response: InvoiceTransaction[];

      service.getInvoiceTransactions().subscribe((r) => (response = r));
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(MOCK_INVOICE_HISTORY);

      expect(req.request.url).toEqual(expectedUrl);
      expect(response).toEqual(MOCK_INVOICE_HISTORY);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('when generating an invoice...', () => {
    it('should request invoice', () => {
      const expectedUrl = `${environment.baseUrl}${INVOICE_DOWNLOAD_ENDPOINT}/${invoice.id}`;

      service.generateInvoice(invoice).subscribe();
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.url).toEqual(expectedUrl);
      expect(req.request.method).toBe('POST');
    });
  });

  describe('when downloading an invoice...', () => {
    it('should return the blob of the invoice', () => {
      const blobInvoice = new Blob([JSON.stringify(invoice)]);
      const expectedUrl = `${environment.baseUrl}${INVOICE_DOWNLOAD_ENDPOINT}/${invoice.id}`;
      let response: Blob;

      service.downloadInvoice(invoice).subscribe((r) => (response = r));
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(blobInvoice);

      expect(req.request.url).toEqual(expectedUrl);
      expect(response).toEqual(blobInvoice);
      expect(req.request.method).toBe('GET');
    });
  });
});
