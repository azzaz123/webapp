
export interface Invoice {
    title: string;
    price: number;
    category_id: number;
    transaction_date: number;
    available?: boolean;
    category_name?: string;
    category_icon?: string;
}

export interface InvoiceDownload {
    file: string;
}