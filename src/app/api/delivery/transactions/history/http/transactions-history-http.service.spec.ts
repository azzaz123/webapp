import { HttpParams } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MOCK_TRANSACTIONS_HISTORY_DTO } from '@api/fixtures/delivery/transactions/history/transactions-history.fixtures.spec';
import { TransactionsHistoryDto } from '../dtos/transactions-history-dto.interface';
import { DELIVERY_TRANSACTIONS_HISTORY_ENDPOINT } from './endpoints';
import { TransactionsHistoryHttpService } from './transactions-history-http.service';

describe('TransactionsHistoryHttpService', () => {
  let service: TransactionsHistoryHttpService;
  let httpMock: HttpTestingController;
  let queryParams: HttpParams;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TransactionsHistoryHttpService],
    });
    service = TestBed.inject(TransactionsHistoryHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('when asking to get the transactions history to server', () => {
    describe('and when asking for an specific page', () => {
      const page = 1337;

      beforeEach(() => {
        queryParams = new HttpParams().appendAll({
          page: page.toString(),
        });
      });

      it('should ask server for an specific page', () => {
        let response: TransactionsHistoryDto;
        const expectedUrl = `${DELIVERY_TRANSACTIONS_HISTORY_ENDPOINT}?page=${page}`;

        service.get(queryParams).subscribe((data) => (response = data));
        const req: TestRequest = httpMock.expectOne(expectedUrl);
        req.flush(MOCK_TRANSACTIONS_HISTORY_DTO);

        expect(req.request.method).toBe('GET');
        expect(response).toEqual(MOCK_TRANSACTIONS_HISTORY_DTO);
      });
    });
  });
});
