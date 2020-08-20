import { Invoice, InvoiceDownload } from 'app/core/invoice/invoice.interface';

export const MOCK_INVOICE_HISTORY: Invoice[] = [
  {
    title: 'Cars15',
    price: 35,
    category_id: 100,
    transaction_date: 1000000000000,
    available: true,
  },
  {
    title: 'Cars15',
    price: 35,
    category_id: 100,
    transaction_date: 1100000000000,
    available: false,
  },
  {
    title: 'Cars15',
    price: 35,
    category_id: 100,
    transaction_date: 1500000000000,
    available: true,
  },
  {
    title: 'Cars15',
    price: 35,
    category_id: 100,
    transaction_date: 1200000000000,
    available: false,
  },
  {
    title: 'Cars15',
    price: 35,
    category_id: 100,
    transaction_date: 1600000000000,
    available: true,
  },
  {
    title: 'Cars15',
    price: 35,
    category_id: 100,
    transaction_date: 1400000000000,
    available: false,
  },
  {
    title: 'Cars15',
    price: 35,
    category_id: 100,
    transaction_date: 1300000000000,
    available: true,
  },
  {
    title: 'Cars15',
    price: 35,
    category_id: 100,
    transaction_date: 1100000000000,
    available: false,
  },
  {
    title: 'Cars15',
    price: 35,
    category_id: 100,
    transaction_date: 1110000000000,
    available: true,
  },
  {
    title: 'Cars15',
    price: 35,
    category_id: 100,
    transaction_date: 1900000000000,
    available: false,
  },
  {
    title: 'Cars15',
    price: 35,
    category_id: 100,
    transaction_date: 1700000000000,
    available: true,
  },
  {
    title: 'Cars15',
    price: 35,
    category_id: 100,
    transaction_date: 1800000000000,
    available: false,
  }
];

export const MOCK_INVOICE_HISTORY_MAPPED: Invoice[] = [
  {
    title: 'Cars15',
    price: 35,
    category_id: 100,
    transaction_date: 1825730400000,
    available: false,
    category_icon: 'car',
    category_name: 'Cars'
  },
  {
    title: 'Cars15',
    price: 35,
    category_id: 100,
    transaction_date: 1825710400000,
    available: false,
    category_icon: 'car',
    category_name: 'Cars'
  }
];

export const MOCK_INVOICE_HISTORY_SORTED: Invoice[] = [
  {
    title: 'Cars15',
    price: 35,
    category_id: 100,
    transaction_date: 1900000000000,
    available: false,
  },
  {
    title: 'Cars15',
    price: 35,
    category_id: 100,
    transaction_date: 1800000000000,
    available: false,
  },
  {
    title: 'Cars15',
    price: 35,
    category_id: 100,
    transaction_date: 1700000000000,
    available: true,
  },
  {
    title: 'Cars15',
    price: 35,
    category_id: 100,
    transaction_date: 1600000000000,
    available: true,
  },
  {
    title: 'Cars15',
    price: 35,
    category_id: 100,
    transaction_date: 1500000000000,
    available: true,
  },
  {
    title: 'Cars15',
    price: 35,
    category_id: 100,
    transaction_date: 1400000000000,
    available: false,
  },
  {
    title: 'Cars15',
    price: 35,
    category_id: 100,
    transaction_date: 1300000000000,
    available: true,
  },
  {
    title: 'Cars15',
    price: 35,
    category_id: 100,
    transaction_date: 1200000000000,
    available: false,
  },
  {
    title: 'Cars15',
    price: 35,
    category_id: 100,
    transaction_date: 1110000000000,
    available: true,
  },
  {
    title: 'Cars15',
    price: 35,
    category_id: 100,
    transaction_date: 1100000000000,
    available: false,
  },
  {
    title: 'Cars15',
    price: 35,
    category_id: 100,
    transaction_date: 1100000000000,
    available: false,
  },
  {
    title: 'Cars15',
    price: 35,
    category_id: 100,
    transaction_date: 1000000000000,
    available: true,
  }
];

export const MOCK_INVOICE_DOWNLOAD: InvoiceDownload = {
  file: 'pdfURL'
}
