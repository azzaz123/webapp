import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ITEMS_API_URL } from '@core/item/item.service';
import { USER_ENDPOINT } from '@core/user/user.service';
import { environment } from '@environments/environment';
import { APP_VERSION } from '@environments/version';
import { Observable, of } from 'rxjs';
import { ITEM_REPORT_REASONS } from './constants/item-report-reasons';
import { USER_REPORT_REASONS } from './constants/user-report-reasons';
import { UserReportResponse } from './interfaces/user/user-report-response.interface';
import { UserReportRequest } from './interfaces/user/user-report-request.interface';
import { UserReportReason } from './interfaces/user/user-report-reason.interface';
import { ItemReportReason } from './interfaces/item/item-report-reason.interface';
import { USER_REPORT_REASON_ID } from './enum/user-report-reasons.enum';

export const USER_REPORT_ENDPOINT = (userId: string) => `${USER_ENDPOINT}report/user/${userId}`;
export const ITEM_REPORT_ENDPOINT = (itemId: number | string) => `${ITEMS_API_URL}/${itemId}/report`;

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor(private http: HttpClient) {}

  public getUserReportReasons(): Observable<UserReportReason[]> {
    return of(USER_REPORT_REASONS);
  }

  public getItemReportReasons(): Observable<ItemReportReason[]> {
    return of(ITEM_REPORT_REASONS);
  }

  public reportUser(userReportRequest: UserReportRequest): Observable<UserReportResponse> {
    return this.http.post<UserReportResponse>(
      `${environment.baseUrl}${USER_REPORT_ENDPOINT(userReportRequest.userId)}`,
      userReportRequest,
      {
        headers: new HttpHeaders().append('AppBuild', APP_VERSION),
      }
    );
  }

  public reportItem(itemId: number | string, comments: string, reason: ItemReportReason): Observable<null> {
    return this.http.post<null>(`${environment.baseUrl}${ITEM_REPORT_ENDPOINT(itemId)}`, {
      comments: comments,
      reason: reason.id,
    });
  }
}
