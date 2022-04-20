import { SALES_AS_BUYER_ENDPOINT } from './endpoint';
import { TestBed } from '@angular/core/testing';

import { SalesAsBuyerHttpService } from './sales-as-buyer-http.service';
import { HttpTestingController, HttpClientTestingModule, TestRequest } from '@angular/common/http/testing';
import { HttpParams } from '@angular/common/http';
import { SalesAsBuyerDto } from '../dtos/sales-as-buyer-dto.interface';
import { MOCK_SALES_AS_BUYER_DTO } from '@api/fixtures/bff/sales/sales-as-buyer.fixtures.spec';

describe('SalesAsBuyerHttpService', () => {
  let service: SalesAsBuyerHttpService;
  let httpMock: HttpTestingController;
  let queryParams: HttpParams;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SalesAsBuyerHttpService],
    });
    service = TestBed.inject(SalesAsBuyerHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('when asking to get the sales as buyer to the server', () => {
    describe('and when asking fo an specific page', () => {
      const page: number = 2;

      beforeEach(() => {
        queryParams = new HttpParams().appendAll({
          page: page.toString(),
        });
      });

      it('should ask server for an specific page', () => {
        let response: SalesAsBuyerDto;
        const expectedUrl: string = `${SALES_AS_BUYER_ENDPOINT}?page=${page}`;

        service.get(queryParams).subscribe((data) => (response = data));
        const req: TestRequest = httpMock.expectOne(expectedUrl);
        req.flush(MOCK_SALES_AS_BUYER_DTO);

        expect(req.request.method).toBe('GET');
        expect(response).toEqual(MOCK_SALES_AS_BUYER_DTO);
      });
    });
  });
});
