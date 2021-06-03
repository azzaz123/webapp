import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ITEMS_API_URL } from '@core/item/item.service';
import { environment } from '@environments/environment';
import { APP_VERSION } from '@environments/version';
import { ITEM_ID } from '@fixtures/item.fixtures.spec';
import { USER_ID } from '@fixtures/user.fixtures.spec';
import { ITEM_REPORT_REASONS } from './constants/item-report-reasons';
import { UserReportRequest } from './interfaces/user/user-report-request.interface';

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
      const expectedUserReportRequest: UserReportRequest = {
        userId: USER_ID,
        itemHashId: ITEM_HASH,
        conversationHash: CONVERSATIONS_HASH,
        comments: COMMENT,
        reason: REASON,
        targetCrm: 'zendesk',
      };

      service.reportUser(expectedUserReportRequest).subscribe();

      const req = httpMock.expectOne(`${environment.baseUrl}${USER_REPORT_ENDPOINT(USER_ID)}`);
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(expectedUserReportRequest);
      expect(req.request.headers.get('AppBuild')).toEqual(APP_VERSION);
    });
  });

  describe('when reporting an item', () => {
    it('should send report to server', () => {
      const comments = 'comments';
      const itemReportReason = ITEM_REPORT_REASONS[0];
      const expectedUrl = `${environment.baseUrl}${ITEMS_API_URL}/${ITEM_ID}/report`;
      const expectedBodyRequest = {
        comments,
        reason: itemReportReason.id,
      };

      service.reportItem(ITEM_ID, 'comments', itemReportReason).subscribe();
      const req = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.url).toBe(expectedUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(expectedBodyRequest);
    });
  });
});
