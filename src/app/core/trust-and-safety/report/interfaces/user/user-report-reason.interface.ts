import { USER_REPORT_REASON_ID } from '../../enum/user-report-reasons.enum';
import { ReportReason } from '../report-reason.interface';

export interface UserReportReason extends ReportReason {
  id: USER_REPORT_REASON_ID;
}
