import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { Observable } from 'rxjs';

import { HelpService } from './help.service';
import { FAQS, FAQ_FEATURES } from '../../tests/faq.fixtures.spec';

describe('HelpService', () => {
  let service: HelpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HelpService]
    });
    service = TestBed.inject(HelpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  })

  describe('getFaqs', () => {
    it('should get localized faqs from web resources', () => {
      let response: any;
      let localId = 'es';

      service.getFaqs(localId).subscribe(res => response = res);
      const req: TestRequest = httpMock.expectOne(`assets/json/faq.${localId}.json`);
      req.flush(FAQS);

      expect(req.request.method).toBe('GET');
      expect(response).toEqual(FAQS);
    });
  });

  describe('getFeatures', () => {
    it('should get localized faq features from web resources', () => {
      let response: any;
      let localId = 'es';

      service.getFeatures(localId).subscribe(res => response = res);
      const req: TestRequest = httpMock.expectOne(`assets/json/faq-features.${localId}.json`);
      req.flush(FAQ_FEATURES);

      expect(req.request.method).toBe('GET');
      expect(response).toEqual(FAQ_FEATURES);
    });
  });
});
