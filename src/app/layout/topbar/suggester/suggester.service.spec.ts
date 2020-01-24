import { Observable } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { SuggesterService } from './suggester.service';
import { SuggesterResponse } from './suggester-response.interface';
import { SUGGESTER_DATA_WEB } from '../../../../tests/suggester.fixtures.spec';
import { HttpModuleNew } from '../../../core/http/http.module.new';
import { HttpClient } from '@angular/common/http';

let service: SuggesterService;
let http: HttpClient;

describe('SuggesterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModuleNew],
      providers: [SuggesterService]
    });
    service = TestBed.get(SuggesterService);
    http = TestBed.get(HttpClient);
  });

  describe('getSuggestions', () => {
    it('should return the json from the suggester', () => {
      let response: SuggesterResponse[];
      spyOn(http, 'get').and.returnValue(Observable.of(SUGGESTER_DATA_WEB));

      service.getSuggestions('Seat').subscribe((data: SuggesterResponse[]) => {
        response = data;
      });

      expect(response).toEqual(SUGGESTER_DATA_WEB);
    });
  });
});
