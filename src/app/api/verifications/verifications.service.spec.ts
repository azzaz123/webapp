import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Verifications } from '@api/core/model/verifications';
import { MOCK_VERIFICATIONS_MAPPED, MOCK_VERIFICATIONS_RESPONSE } from '@api/fixtures/verifications/verifications.fixtures.spec';
import { of } from 'rxjs';
import { VerificationsHttpService } from './http/verifications-http.service';

import { VerificationsService } from './verifications.service';

describe('VerificationsService', () => {
  let service: VerificationsService;
  let verificationsHttpService: VerificationsHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [VerificationsService, VerificationsHttpService],
    });
    service = TestBed.inject(VerificationsService);
    verificationsHttpService = TestBed.inject(VerificationsHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asking to get Verifications', () => {
    beforeEach(() => {
      spyOn(verificationsHttpService, 'get').and.returnValue(of(MOCK_VERIFICATIONS_RESPONSE));
    });

    it('should get all the verifications', () => {
      service.verifications$.subscribe();

      expect(verificationsHttpService.get).toHaveBeenCalled();
    });

    it('should map server response to web context', () => {
      let response: Verifications;

      service.verifications$.subscribe((data) => (response = data));

      expect(JSON.stringify(response)).toEqual(JSON.stringify(MOCK_VERIFICATIONS_MAPPED));
    });
  });
});
