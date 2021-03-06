export interface InvoiceTransaction {
  id: string;
  price: number;
  currency: string;
  description: string;
  date: number;
  invoice_generated: boolean;
  currencySymbol?: string;
}
