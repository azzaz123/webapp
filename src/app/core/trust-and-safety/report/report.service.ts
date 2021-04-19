import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ITEMS_API_URL } from '@core/item/item.service';
import { USER_ENDPOINT } from '@core/user/user.service';
import { environment } from '@environments/environment.beta';
import { APP_VERSION } from '@environments/version';
import { Observable, of } from 'rxjs';
import { ITEM_REPORT_REASONS } from './constants/item-report-reasons';
import { USER_REPORT_REASONS } from './constants/user-report-reasons';
import { ItemReportReason } from './interfaces/item-report-reason.interface';
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

  public getItemReportReasons(): Observable<ItemReportReason[]> {
    return of(ITEM_REPORT_REASONS);
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

  public reportListing(itemId: number | string, comments: string, reason: ItemReportReason): Observable<any> {
    return this.http.post(`${environment.baseUrl}${ITEMS_API_URL}/${itemId}/report`, {
      comments: comments,
      reason: reason.value,
    });
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
