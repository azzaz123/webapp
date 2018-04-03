import { TestBed } from '@angular/core/testing';
import { SuggesterService } from './suggester.service';
import { SuggesterResponse } from './suggester-response.interface';
import { SUGGESTER_DATA_WEB } from '../../../../tests/suggester.fixtures.spec';
import { ResponseOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { TEST_HTTP_PROVIDERS } from '../../../../tests/utils.spec';
import { HttpService } from '../../../core/http/http.service';

let service: SuggesterService;
let http: HttpService;

describe('SuggesterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SuggesterService, ...TEST_HTTP_PROVIDERS]
    });
    service = TestBed.get(SuggesterService);
    http = TestBed.get(HttpService);
  });

  describe('getSuggestions', () => {
    it('should return the json from the suggester', () => {
      let response: SuggesterResponse[];
      const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(SUGGESTER_DATA_WEB)});
      spyOn(http, 'getNoBase').and.returnValue(Observable.of(new Response(res)));
      service.getSuggestions('Seat').subscribe((data: SuggesterResponse[]) => {
        response = data;
      });
      expect(response).toEqual(SUGGESTER_DATA_WEB);
    });
  });
});
