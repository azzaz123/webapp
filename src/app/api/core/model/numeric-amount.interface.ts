export interface NumericAmount {
  integer: number;
  decimals: number;
  total: number;
  toString: (showSign?: boolean) => string;
}
