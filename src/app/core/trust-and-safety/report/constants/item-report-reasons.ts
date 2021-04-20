import { ITEM_REPORT_REASON_ID } from '../enum/item-report-reasons.enum';
import { ItemReportReason } from '../interfaces/item/item-report-reason.interface';

export const ITEM_REPORT_REASON_ICON_FOLDER = 'assets/icons/';

export const ITEM_REPORT_REASONS: ItemReportReason[] = [
  {
    id: ITEM_REPORT_REASON_ID.PEOPLE_ANIMALS,
    label: $localize`:@@web_item_report_reason_people_animals:People or animals`,
    iconPath: `${ITEM_REPORT_REASON_ICON_FOLDER}animals.svg`,
  },
  {
    id: ITEM_REPORT_REASON_ID.JOKE,
    label: $localize`:@@web_item_report_reason_joke:Joke`,
    iconPath: `${ITEM_REPORT_REASON_ICON_FOLDER}joke.svg`,
  },
  {
    id: ITEM_REPORT_REASON_ID.FAKE,
    label: $localize`:@@web_item_report_reason_fake_product:Fake product`,
    iconPath: `${ITEM_REPORT_REASON_ICON_FOLDER}fake.svg`,
  },
  {
    id: ITEM_REPORT_REASON_ID.EXPLICIT,
    label: $localize`:@@web_item_report_reason_explicit_content:Explicit content`,
    iconPath: `${ITEM_REPORT_REASON_ICON_FOLDER}explicit.svg`,
  },
  {
    id: ITEM_REPORT_REASON_ID.WRONG_IMAGE,
    label: $localize`:@@web_item_report_reason_wrong_image:Doesn't match with the image`,
    iconPath: `${ITEM_REPORT_REASON_ICON_FOLDER}picture.svg`,
  },
  {
    id: ITEM_REPORT_REASON_ID.FOOD,
    label: $localize`:@@web_item_report_reason_food_drink:Food or drinks`,
    iconPath: `${ITEM_REPORT_REASON_ICON_FOLDER}food.svg`,
  },
  {
    id: ITEM_REPORT_REASON_ID.DRUGS,
    label: $localize`:@@web_item_report_reason_drugs_medicines:Drugs or medicines`,
    iconPath: `${ITEM_REPORT_REASON_ICON_FOLDER}drugs.svg`,
  },
  {
    id: ITEM_REPORT_REASON_ID.DUPLICATED,
    label: $localize`:@@web_item_report_reason_duplicated_product:Doubled product`,
    iconPath: `${ITEM_REPORT_REASON_ICON_FOLDER}duplicated.svg`,
  },
  {
    id: ITEM_REPORT_REASON_ID.FORBIDDEN,
    label: $localize`:@@web_item_report_reason_forbidden_product_service:Forbidden product or service`,
    iconPath: `${ITEM_REPORT_REASON_ICON_FOLDER}forbidden.svg`,
  },
  {
    id: ITEM_REPORT_REASON_ID.RESALE,
    label: $localize`:@@web_item_report_reason_resale:Resale (tickets, etc)`,
    iconPath: `${ITEM_REPORT_REASON_ICON_FOLDER}resale.svg`,
  },
  {
    id: ITEM_REPORT_REASON_ID.AD_SPAM,
    label: $localize`:@@web_item_report_reason_ads_spam:Ad or spam`,
    iconPath: `${ITEM_REPORT_REASON_ICON_FOLDER}ad.svg`,
  },
];
