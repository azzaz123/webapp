import { ITEM_REPORT_REASON_VALUE } from '../enums/item-report-reasons.enum';
import { ItemReportReason } from '../interfaces/item-report-reason.interface';

export const ITEM_REPORT_REASON_ICON_FOLDER = 'assets/icons/';

export const ITEM_REPORT_REASONS: ItemReportReason[] = [
  {
    id: 2,
    label: $localize`:@@web_item_report_reason_people_animals:People or animals`,
    iconPath: `${ITEM_REPORT_REASON_ICON_FOLDER}animals.svg`,
    value: ITEM_REPORT_REASON_VALUE.PEOPLE_ANIMALS,
  },
  {
    id: 3,
    label: $localize`:@@web_item_report_reason_joke:Joke`,
    iconPath: `${ITEM_REPORT_REASON_ICON_FOLDER}joke.svg`,
    value: ITEM_REPORT_REASON_VALUE.JOKE,
  },
  {
    id: 4,
    label: $localize`:@@web_item_report_reason_fake_product:Fake product`,
    iconPath: `${ITEM_REPORT_REASON_ICON_FOLDER}fake.svg`,
    value: ITEM_REPORT_REASON_VALUE.FAKE,
  },
  {
    id: 5,
    label: $localize`:@@web_item_report_reason_explicit_content:Explicit content`,
    iconPath: `${ITEM_REPORT_REASON_ICON_FOLDER}explicit.svg`,
    value: ITEM_REPORT_REASON_VALUE.EXPLICIT,
  },
  {
    id: 6,
    label: $localize`:@@web_item_report_reason_wrong_image:Doesn't match with the image`,
    iconPath: `${ITEM_REPORT_REASON_ICON_FOLDER}picture.svg`,
    value: ITEM_REPORT_REASON_VALUE.WRONG_IMAGE,
  },
  {
    id: 7,
    label: $localize`:@@web_item_report_reason_food_drink:Food or drinks`,
    iconPath: `${ITEM_REPORT_REASON_ICON_FOLDER}food.svg`,
    value: ITEM_REPORT_REASON_VALUE.FOOD,
  },
  {
    id: 8,
    label: $localize`:@@web_item_report_reason_drugs_medicines:Drugs or medicines`,
    iconPath: `${ITEM_REPORT_REASON_ICON_FOLDER}drugs.svg`,
    value: ITEM_REPORT_REASON_VALUE.DRUGS,
  },
  {
    id: 9,
    label: $localize`:@@web_item_report_reason_duplicated_product:Doubled product`,
    iconPath: `${ITEM_REPORT_REASON_ICON_FOLDER}duplicated.svg`,
    value: ITEM_REPORT_REASON_VALUE.DUPLICATED,
  },
  {
    id: 10,
    label: $localize`:@@web_item_report_reason_forbidden_product_service:Forbidden product or service`,
    iconPath: `${ITEM_REPORT_REASON_ICON_FOLDER}forbidden.svg`,
    value: ITEM_REPORT_REASON_VALUE.FORBIDDEN,
  },
  {
    id: 11,
    label: $localize`:@@web_item_report_reason_resale:Resale (tickets, etc)`,
    iconPath: `${ITEM_REPORT_REASON_ICON_FOLDER}resale.svg`,
    value: ITEM_REPORT_REASON_VALUE.RESALE,
  },
  {
    id: 12,
    label: $localize`:@@web_item_report_reason_ads_spam:Ad or spam`,
    iconPath: `${ITEM_REPORT_REASON_ICON_FOLDER}ad.svg`,
    value: ITEM_REPORT_REASON_VALUE.AD_SPAM,
  },
];
