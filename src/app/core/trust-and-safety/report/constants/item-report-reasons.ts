import { ReportReason } from '../interfaces/report-reason.interface';

export const ITEM_REPORT_REASON_ICON_FOLDER = 'assets/icons/';

export const ITEM_REPORT_REASONS: ReportReason[] = [
  {
    id: 2,
    label: $localize`:@@web_item_report_reason_people_animals:People or animals`,
    iconPath: `${ITEM_REPORT_REASON_ICON_FOLDER}animals.svg`,
  },
  { id: 3, label: $localize`:@@web_item_report_reason_joke:Joke`, iconPath: `${ITEM_REPORT_REASON_ICON_FOLDER}joke.svg` },
  { id: 4, label: $localize`:@@web_item_report_reason_fake_product:Fake product`, iconPath: `${ITEM_REPORT_REASON_ICON_FOLDER}fake.svg` },
  {
    id: 5,
    label: $localize`:@@web_item_report_reason_explicit_content:Explicit content`,
    iconPath: `${ITEM_REPORT_REASON_ICON_FOLDER}explicit.svg`,
  },
  {
    id: 6,
    label: $localize`:@@web_item_report_reason_wrong_image:Doesn't match with the image`,
    iconPath: `${ITEM_REPORT_REASON_ICON_FOLDER}picture.svg`,
  },
  { id: 7, label: $localize`:@@web_item_report_reason_food_drink:Food or drinks`, iconPath: `${ITEM_REPORT_REASON_ICON_FOLDER}food.svg` },
  {
    id: 8,
    label: $localize`:@@web_item_report_reason_drugs_medicines:Drugs or medicines`,
    iconPath: `${ITEM_REPORT_REASON_ICON_FOLDER}drugs.svg`,
  },
  {
    id: 9,
    label: $localize`:@@web_item_report_reason_duplicated_product:Doubled product`,
    iconPath: `${ITEM_REPORT_REASON_ICON_FOLDER}duplicated.svg`,
  },
  {
    id: 10,
    label: $localize`:@@web_item_report_reason_forbidden_product_service:Forbidden product or service`,
    iconPath: `${ITEM_REPORT_REASON_ICON_FOLDER}forbidden.svg`,
  },
  {
    id: 11,
    label: $localize`:@@web_item_report_reason_resale:Resale (tickets, etc)`,
    iconPath: `${ITEM_REPORT_REASON_ICON_FOLDER}resale.svg`,
  },
  { id: 12, label: $localize`:@@web_item_report_reason_ads_spam:Ad or spam`, iconPath: `${ITEM_REPORT_REASON_ICON_FOLDER}ad.svg` },
];
