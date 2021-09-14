export enum InboxItemStatus {
  SOLD = 'sold',
  RESERVED = 'reserved',
  NOT_AVAILABLE = 'not available',
  PUBLISHED = 'published',
  UNPUBLISHED = 'unpublished',
}

export class InboxItemPrice {
  amount: number;
  currency: string;
}

export class InboxImage {
  urls_by_size: {
    small: string;
  };
}

export class InboxItem {
  constructor(
    private _id: string,
    private _price: InboxItemPrice,
    private _title: string,
    private _mainImage: InboxImage,
    private _itemSlug: string,
    private _status: InboxItemStatus,
    private _isMine: boolean,
    public categoryId: number
  ) {
    this.mapStatusToFlags(this.status);
  }

  public sold = false;
  public reserved = false;
  public published = false;
  public unpublished = false;
  public notAvailable = false;
  public views: number;
  public favorites: number;

  private mapStatusToFlags(status: string) {
    switch (status) {
      case InboxItemStatus.SOLD:
        this.sold = true;
        break;
      case InboxItemStatus.RESERVED:
        this.reserved = true;
        break;
      case InboxItemStatus.NOT_AVAILABLE:
        this.notAvailable = true;
        break;
      case InboxItemStatus.PUBLISHED:
        this.published = true;
        break;
      case InboxItemStatus.UNPUBLISHED:
        this.unpublished = true;
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

  set status(value: InboxItemStatus) {
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

  get itemSlug(): string {
    return this._itemSlug;
  }

  set itemSlug(value: string) {
    this._itemSlug = value;
  }

  public setFakeImage(image: string) {
    this._mainImage = {
      urls_by_size: {
        small: '',
      },
    };
  }
}

export const InboxItemPlaceholder = new InboxItem(null, null, 'unknown', null, null, InboxItemStatus.NOT_AVAILABLE, false, null);
