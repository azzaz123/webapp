export const INBOX_ITEM_STATUSES: any = {
    sold: 'sold',
    reserved: 'reserved',
    notAvailable: 'not available',
    published: 'published'
};

export interface InboxItemPrice {
    amount: number;
    currency: string;
}

export interface InboxImage {
    urls_by_size: {
        small: string;
    };
}

export class InboxItem {
    constructor(private _id: string,
        private _price: InboxItemPrice,
        private _title: string,
        private _mainImage: InboxImage,
        private _itemUrl: string,
        private _status: string,
        private _isMine: boolean) {
        this.mapStatusToFlags(this.status);
    }

    public sold = false;
    public reserved = false;
    public published = false;
    public notAvailable = false;

    public views: number;
    public favorites: number;

    private mapStatusToFlags(status: string) {
        switch (status) {
            case INBOX_ITEM_STATUSES.sold:
                this.sold = true;
                break;
            case INBOX_ITEM_STATUSES.reserved:
                this.reserved = true;
                break;
            case INBOX_ITEM_STATUSES.notAvailable:
                this.notAvailable = true;
                break;
            case INBOX_ITEM_STATUSES.published:
                this.published = true;
                break;
            default:
                this.published = true;
                break;
        }
    }

    get id(): string {
        return this._id;
    }

    get price(): InboxItemPrice {
        return this._price;
    }

    get title(): string {
        return this._title;
    }

    get status() {
        return this._status;
    }

    set status(value: string) {
        this._status = value;
    }

    get mainImage(): InboxImage {
        return this._mainImage;
    }

    get isMine(): boolean {
        return this._isMine;
    }

    set isMine(value: boolean) {
        this._isMine = value;
    }

    get itemUrl(): string {
        return this._itemUrl;
    }

    set itemUrl(value: string) {
        this._itemUrl = value;
    }

    public setFakeImage(image: string) {
        this._mainImage = {
            urls_by_size: {
                small: '',
            }
        };
    }
}

export const InboxItemPlaceholder = new InboxItem(null, null, 'unknown', null, null, INBOX_ITEM_STATUSES.notAvailable, false);
