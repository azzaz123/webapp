export interface Invoice {
  id: string;
  price: number;
  currency: string;
  description: string;
  date: number;
  invoice_generated: boolean;
}

export interface InvoiceTransactions {
  id: string;
  price: number;
  currency: string;
  description: string;
  date: number;
  invoice_generated: boolean;
}

export interface InvoiceDownload {
  file: string;
}
