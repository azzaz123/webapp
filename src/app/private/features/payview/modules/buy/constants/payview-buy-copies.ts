import { PAYVIEW_BUY_ERROR_CODES } from '@private/features/payview/modules/buy/types/payview-buy-error-code.type';

export const PAYVIEW_BUY_DEFAULT_ERROR: string = $localize`:@@pay_view_buyer_snackbar_generic_error_payment_error_message:La compra no se ha realizado, algo ha fallado durante el pago. Vuelve a intentarlo.`;

export const PAYVIEW_BUY_ERRORS: Record<PAYVIEW_BUY_ERROR_CODES, string> = {
  ['product price out of range to calculate costs']: $localize`:@@pay_view_buyer_bargain_pop_up_price_out_of_range_inline_error:"No puedes proponer este precio, está fuera del rango aceptado.`,
  ['user does not have address']: $localize`:@@pay_view_buyer_sender_address_request_due_to_pickup_point_method_modal_description:Para realizar la compra debes añadir tu dirección. En caso de que quieras hacer una devolución, serás el remitente.`,
};
