import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { USER_ENDPOINT } from '@core/user/user.service';
import { environment } from '@environments/environment.beta';
import { APP_VERSION } from '@environments/version';
import { Observable, of } from 'rxjs';
import { USER_REPORT_REASONS } from './constants/user-report-reasons';
import { ReportReason } from './interfaces/report-reason.interface';
import { UserReportApi } from './interfaces/user-report.interface';

export const USER_REPORT_ENDPOINT = (userId: string) => `${USER_ENDPOINT}report/user/${userId}`;
export const LAST_USER_REPORT_REASON_ID = 0;

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor(private http: HttpClient) {}

  public getUserReportReasons(): Observable<ReportReason[]> {
    return of(USER_REPORT_REASONS.sort(this.sortUserReportReasons));
  }

  public reportUser(
    userId: string,
    itemHashId: string,
    conversationHash: string,
    reason: number,
    comments: string
  ): Observable<UserReportApi> {
    return this.http.post<UserReportApi>(
      `${environment.baseUrl}${USER_REPORT_ENDPOINT(userId)}`,
      {
        itemHashId,
        conversationHash,
        comments,
        reason,
        targetCrm: 'zendesk',
      },
      {
        headers: new HttpHeaders().append('AppBuild', APP_VERSION),
      }
    );
  }

  private sortUserReportReasons(a: ReportReason, b: ReportReason): number {
    if (a.id === LAST_USER_REPORT_REASON_ID) {
      return 1;
    }

    if (b.id === LAST_USER_REPORT_REASON_ID) {
      return -1;
    }
  }
}
