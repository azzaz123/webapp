import { ReportReason } from '../interfaces/report-reason.interface';

export const ITEM_REPORT_REASONS: ReportReason[] = [
  { id: 2, label: $localize`:@@web_item_report_reason_people_animals:People or animals` },
  { id: 3, label: $localize`:@@web_item_report_reason_joke:Joke` },
  { id: 4, label: $localize`:@@web_item_report_reason_fake_product:Fake product` },
  { id: 5, label: $localize`:@@web_item_report_reason_explicit_content:Explicit content` },
  { id: 6, label: $localize`:@@web_item_report_reason_wrong_image:Doesn't match with the image` },
  { id: 7, label: $localize`:@@web_item_report_reason_food_drink:Food or drinks` },
  { id: 8, label: $localize`:@@web_item_report_reason_drugs_medicines:Drugs or medicines` },
  { id: 9, label: $localize`:@@web_item_report_reason_duplicated_product:Doubled product` },
  { id: 10, label: $localize`:@@web_item_report_reason_forbidden_product_service:Forbidden product or service` },
  { id: 11, label: $localize`:@@web_item_report_reason_resale:Resale (tickets, etc)` },
  { id: 12, label: $localize`:@@web_item_report_reason_ads_spam:Ad or spam` },
];
