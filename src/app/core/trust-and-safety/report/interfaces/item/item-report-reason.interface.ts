import { ITEM_REPORT_REASON_ID } from '../../enum/item-report-reasons.enum';
import { ReportReason } from '../report-reason.interface';

export interface ItemReportReason extends ReportReason {
  id: ITEM_REPORT_REASON_ID;
}
