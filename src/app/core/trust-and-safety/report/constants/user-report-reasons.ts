import { ReportReason } from '../interfaces/report-reason.interface';

export const USER_REPORT_REASONS: ReportReason[] = [
  { id: 0, label: $localize`:@@web_user_report_reason_other:Other reason` },
  { id: 3, label: $localize`:@@web_user_report_reason_fraud:Scam` },
  { id: 4, label: $localize`:@@web_user_report_reason_possible_fraud:Suspicious behaviour` },
  { id: 5, label: $localize`:@@web_user_report_reason_bad_behavior:Bad behaviour` },
  { id: 6, label: $localize`:@@web_user_report_reason_did_not_show_up:No-show` },
  { id: 7, label: $localize`:@@web_user_report_reason_bad_product:Defective or wrong item` },
];
