import { PAYVIEW_PROMOTION_ERROR_CODES } from '@private/features/payview/modules/promotion/types/payview-promotion-error-code.type';

export const PAYVIEW_PROMOTION_DEFAULT_ERROR: string = $localize`:@@pay_view_buyer_promo_code_pop_up_generic_inline_error:Something happened… The promotion hasn't been applied.`;
export const PAYVIEW_PROMOTION_EDITOR_PROMOCODE_PLACEHOLDER: string = $localize`:@@pay_view_buyer_promo_code_pop_up_placeholder:Promotional code`;
export const PAYVIEW_PROMOTION_EDITOR_TITLE: string = $localize`:@@pay_view_buyer_promo_code_pop_up_title:Apply the promo. It will make you feel good.`;
export const PAYVIEW_PROMOTION_EDITOR_TITLE_SEPARATOR: string = '.';

export const PAYVIEW_PROMOTION_ERRORS: Record<PAYVIEW_PROMOTION_ERROR_CODES, string> = {
  ['promocode already used']: $localize`:@@pay_view_buyer_promo_code_pop_up_already_used_inline_error:This promotional code has already been used.`,
  ['promocode expired']: $localize`:@@pay_view_buyer_promo_code_pop_up_expired_inline_error:Ouch! This promotional code has expired.`,
  ['item category different to promocode item category']: $localize`:@@pay_view_buyer_promo_code_pop_up_category_unmatch_inline_error:This promotion cannot be applied to this kind of product category.`,
  ['item max weight greater than promocode max weight']: $localize`:@@pay_view_buyer_promo_code_pop_up_max_weight_exceeded_inline_error:This promotion cannot be applied, the product is too heavy`,
  ['item price smaller than promocode min price']: $localize`:@@pay_view_buyer_promo_code_pop_up_min_price_not_reached_inline_error:This promotion cannot be applied to such a low price purchase.`,
  ['promocode not active yet']: $localize`:@@pay_view_buyer_promo_code_pop_up_not_active_yet_inline_error:This promotion is not active yet. Be patient.`,
  ['promocode does not exist']: $localize`:@@pay_view_buyer_promo_code_pop_up_no_valid_inline_error:This promotional code doesn't exist.`,
  ['not buyer first transaction']: $localize`:@@pay_view_buyer_promo_code_pop_up_not_first_transaction_inline_error:The promotional code is only valid if you have never shipped before.`,
};
