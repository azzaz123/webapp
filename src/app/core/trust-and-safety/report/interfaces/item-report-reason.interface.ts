import { ITEM_REPORT_REASON_VALUE } from '../enums/item-report-reasons.enum';
import { ReportReason } from './report-reason.interface';

export interface ItemReportReason extends ReportReason {
  value: ITEM_REPORT_REASON_VALUE;
}
