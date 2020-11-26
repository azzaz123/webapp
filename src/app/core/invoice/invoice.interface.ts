export interface Invoice {
  id: string;
  price: number;
  currency: string;
  description: string;
  date: number;
  invoice_generated: boolean;
}

export interface InvoiceTransaction {
  id: string;
  price: number;
  currency: string;
  description: string;
  date: number;
  invoice_generated: boolean;
  currencySymbol?: string;
}

export interface InvoiceDownload {
  file: string;
}
