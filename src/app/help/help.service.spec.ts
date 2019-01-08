import { TestBed } from '@angular/core/testing';

import { HelpService } from './help.service';
import { HttpService } from '../core/http/http.service';
import { TEST_HTTP_PROVIDERS } from '../../tests/utils.spec';
import { Response, ResponseOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { FAQ_FEATURES, FAQS } from '../../tests/faq.fixtures.spec';

let service: HelpService;
let http: HttpService;

describe('HelpService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ...TEST_HTTP_PROVIDERS,
        HelpService
      ]
    });
    service = TestBed.get(HelpService);
    http = TestBed.get(HttpService);
  });

  describe('getFaqs', () => {
    it('should call endpoint', () => {
      let response: any;
      const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(FAQS)});
      spyOn(http, 'getNoBase').and.returnValue(Observable.of(new Response(res)));

      service.getFaqs('es').subscribe((res) => {
        response = res
      });

      expect(http.getNoBase).toHaveBeenCalledWith('assets/json/faq.es.json');
      expect(response).toEqual(FAQS);
    });
  });

  describe('getFeatures', () => {
    it('should call endpoint', () => {
      let response: any;
      const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(FAQ_FEATURES)});
      spyOn(http, 'getNoBase').and.returnValue(Observable.of(new Response(res)));

      service.getFeatures('es').subscribe((res) => {
        response = res
      });

      expect(http.getNoBase).toHaveBeenCalledWith('assets/json/faq-features.es.json');
      expect(response).toEqual(FAQ_FEATURES);
    });
  });
});
