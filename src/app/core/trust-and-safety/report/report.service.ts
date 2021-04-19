import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { USER_REPORT_REASONS } from './constants/user-report-reasons';
import { ReportReason } from './interfaces/report-reason.interface';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor() {}

  public getUserReportReasons(): Observable<ReportReason[]> {
    return of(USER_REPORT_REASONS);
  }
}
