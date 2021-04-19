import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { USER_REPORT_REASONS } from './constants/user-report-reasons';
import { ReportReason } from './interfaces/report-reason.interface';

export const LAST_USER_REPORT_REASON_ID = 0;

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor() {}

  public getUserReportReasons(): Observable<ReportReason[]> {
    return of(USER_REPORT_REASONS.sort(this.sortUserReportReasons));
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
