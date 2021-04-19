import { ReportReason } from '../interfaces/report-reason.interface';

export const USER_REPORT_REASONS_ICONS_FOLDER = '/assets/icons/';

export const USER_REPORT_REASONS: ReportReason[] = [
  { id: 0, label: $localize`:@@web_user_report_reason_other:Other reason`, iconPath: `${USER_REPORT_REASONS_ICONS_FOLDER}ghost.svg` },
  { id: 3, label: $localize`:@@web_user_report_reason_fraud:Scam`, iconPath: `${USER_REPORT_REASONS_ICONS_FOLDER}scam.svg` },
  {
    id: 4,
    label: $localize`:@@web_user_report_reason_possible_fraud:Suspicious behaviour`,
    iconPath: `${USER_REPORT_REASONS_ICONS_FOLDER}suspicious.svg`,
  },
  {
    id: 5,
    label: $localize`:@@web_user_report_reason_bad_behavior:Bad behaviour`,
    iconPath: `${USER_REPORT_REASONS_ICONS_FOLDER}behaviour.svg`,
  },
  {
    id: 6,
    label: $localize`:@@web_user_report_reason_did_not_show_up:No-show`,
    iconPath: `${USER_REPORT_REASONS_ICONS_FOLDER}no-show.svg`,
  },
  {
    id: 7,
    label: $localize`:@@web_user_report_reason_bad_product:Defective or wrong item`,
    iconPath: `${USER_REPORT_REASONS_ICONS_FOLDER}defective.svg`,
  },
];
