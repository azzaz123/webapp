import { TestBed } from '@angular/core/testing';

import { SalesAsBuyerApiService } from './sales-as-buyer-api.service';
import { SalesAsBuyerHttpService } from './http/sales-as-buyer-http.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SalesAsBuyerApiService', () => {
  let service: SalesAsBuyerApiService;
  let salesAsBuyerHttpService: SalesAsBuyerHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SalesAsBuyerHttpService, SalesAsBuyerApiService],
    });
    service = TestBed.inject(SalesAsBuyerApiService);
    salesAsBuyerHttpService = TestBed.inject(SalesAsBuyerHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
