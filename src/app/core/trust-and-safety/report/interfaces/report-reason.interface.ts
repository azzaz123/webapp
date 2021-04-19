import { ITEM_REPORT_REASON_ID } from '../enum/item-report-reasons.enum';
import { USER_REPORT_REASON_ID } from '../enum/user-report-reasons.enum';

export interface ReportReason {
  id: USER_REPORT_REASON_ID | ITEM_REPORT_REASON_ID;
  label: string;
  iconPath: string;
}
