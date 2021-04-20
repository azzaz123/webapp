import { USER_REPORT_REASON_ID } from '../enum/user-report-reasons.enum';
import { UserReportReason } from '../interfaces/user/user-report-reason.interface';

export const USER_REPORT_REASONS_ICONS_FOLDER = '/assets/icons/';

export const USER_REPORT_REASONS: UserReportReason[] = [
  {
    id: USER_REPORT_REASON_ID.SCAM,
    label: $localize`:@@web_user_report_reason_fraud:Scam`,
    iconPath: `${USER_REPORT_REASONS_ICONS_FOLDER}scam.svg`,
  },
  {
    id: USER_REPORT_REASON_ID.SUSPICIOUS,
    label: $localize`:@@web_user_report_reason_possible_fraud:Suspicious behaviour`,
    iconPath: `${USER_REPORT_REASONS_ICONS_FOLDER}suspicious.svg`,
  },
  {
    id: USER_REPORT_REASON_ID.BAD_BEHAVIOUR,
    label: $localize`:@@web_user_report_reason_bad_behavior:Bad behaviour`,
    iconPath: `${USER_REPORT_REASONS_ICONS_FOLDER}behaviour.svg`,
  },
  {
    id: USER_REPORT_REASON_ID.NO_SHOW,
    label: $localize`:@@web_user_report_reason_did_not_show_up:No-show`,
    iconPath: `${USER_REPORT_REASONS_ICONS_FOLDER}no-show.svg`,
  },
  {
    id: USER_REPORT_REASON_ID.DEFECTIVE,
    label: $localize`:@@web_user_report_reason_bad_product:Defective or wrong item`,
    iconPath: `${USER_REPORT_REASONS_ICONS_FOLDER}defective.svg`,
  },
  {
    id: USER_REPORT_REASON_ID.OTHER,
    label: $localize`:@@web_user_report_reason_other:Other reason`,
    iconPath: `${USER_REPORT_REASONS_ICONS_FOLDER}ghost.svg`,
  },
];
