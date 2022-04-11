export type PAYVIEW_PROMOTION_ERROR_CODES =
  | 'promocode already used'
  | 'promocode expired'
  | 'item category different to promocode item category'
  | 'item max weight greater than promocode max weight'
  | 'item price smaller than promocode min price'
  | 'promocode not active yet'
  | 'promocode does not exist'
  | 'not buyer first transaction';
