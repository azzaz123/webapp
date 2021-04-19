import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '@environments/environment.beta';
import { APP_VERSION } from '@environments/version';
import { USER_ID } from '@fixtures/user.fixtures.spec';

import { ReportService, USER_REPORT_ENDPOINT } from './report.service';

describe('ReportService', () => {
  let service: ReportService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(ReportService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when reporting user', () => {
    it('should send report to server', () => {
      const CONVERSATIONS_HASH = 'vdqjwyk1kzon';
      const ITEM_HASH = '9ke65g542jox';
      const REASON = 5;
      const COMMENT = 'bla bla bla';
      const expectedBodyRequest = {
        itemHashId: ITEM_HASH,
        conversationHash: CONVERSATIONS_HASH,
        comments: COMMENT,
        reason: REASON,
        targetCrm: 'zendesk',
      };

      service.reportUser(USER_ID, ITEM_HASH, CONVERSATIONS_HASH, REASON, COMMENT).subscribe();

      const req = httpMock.expectOne(`${environment.baseUrl}${USER_REPORT_ENDPOINT(USER_ID)}`);
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(expectedBodyRequest);
      expect(req.request.headers.get('AppBuild')).toEqual(APP_VERSION);
    });
  });
});
