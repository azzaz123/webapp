import { Model } from '../resource/model.interface';
import { Image, UserLocation } from '../user/user-response.interface';
import {
  ItemActions,
  ItemFlags,
  ItemSaleConditions,
  DeliveryInfo,
  AutorenewPurchase,
  ItemExtraInfo,
  KmInfo,
  ItemVisibilityFlags,
} from './item-response.interface';

export const FAKE_ITEM_IMAGE_BASE_PATH = '../../../assets/images/fake-item.png';
export const FAKE_ITEM_IMAGE_SMALL_BASE_PATH = '../../../assets/images/fake-item-s.png';
export const FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH = '../../../assets/images/fake-item-s-l.png';
export const ITEM_STATUSES: any = {
  active: 'PUBLISHED',
  sold: ['SOLD_OUTSIDE', 'BOUGHT'],
};

export enum ITEM_TYPES {
  CONSUMER_GOODS = 'consumer_goods',
  CARS = 'cars',
  REAL_ESTATE = 'real_estate',
}

export class Item implements Model {
  private _views: number;

  private _favorites: number;
  private _conversations: number;
  private _purchases: AutorenewPurchase;
  private _favorited: boolean;
  private _selected = false;
  private _bumpExpiringDate: number;
  constructor(
    private _id: string,
    private _legacyId: number,
    private _owner: string,
    private _title?: string,
    private _description?: string,
    private _categoryId?: number,
    private _location?: UserLocation,
    private _salePrice?: number,
    private _currencyCode?: string,
    private _modifiedDate?: number,
    private _url?: string,
    private _flags?: ItemFlags,
    private _actionsAllowed?: ItemActions,
    private _saleConditions?: ItemSaleConditions,
    private _mainImage?: Image,
    private _images?: Image[],
    private _webSlug?: string,
    private _publishedDate?: number,
    private _deliveryInfo?: DeliveryInfo,
    private _itemType: string = ITEM_TYPES.CONSUMER_GOODS,
    private _extraInfo?: ItemExtraInfo,
    private _car_info?: KmInfo,
    private _km?: number,
    private _bumpFlags?: ItemVisibilityFlags,
    private _hashtags?: string[]
  ) {}

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get legacyId(): number {
    return this._legacyId;
  }

  set legacyId(value: number) {
    this._legacyId = value;
  }

  get owner(): string {
    return this._owner;
  }

  set owner(value: string) {
    this._owner = value;
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get categoryId(): number {
    return this._categoryId;
  }

  get location(): UserLocation {
    return this._location;
  }

  get salePrice(): number {
    return this._salePrice;
  }

  get currencyCode(): string {
    return this._currencyCode;
  }

  get modifiedDate(): number {
    return this._modifiedDate;
  }

  get url(): string {
    return this._url;
  }

  get flags(): ItemFlags {
    return this._flags;
  }

  get actionsAllowed(): ItemActions {
    return this._actionsAllowed;
  }

  get saleConditions(): ItemSaleConditions {
    return this._saleConditions;
  }

  get mainImage(): Image {
    return this._mainImage;
  }

  get images(): Image[] {
    return this._images;
  }

  get views(): number {
    return this._views;
  }

  set views(value: number) {
    this._views = value;
  }

  get favorites(): number {
    return this._favorites;
  }

  set favorites(value: number) {
    this._favorites = value;
  }

  get conversations(): number {
    return this._conversations;
  }

  set conversations(value: number) {
    this._conversations = value;
  }

  get purchases(): AutorenewPurchase {
    return this._purchases;
  }

  set purchases(value: AutorenewPurchase) {
    this._purchases = value;
  }

  get favorited(): boolean {
    return this._favorited;
  }

  set favorited(value: boolean) {
    this._favorited = value;
  }

  get publishedDate(): number {
    return this._publishedDate;
  }

  get hashtags(): string[] {
    return this._hashtags;
  }

  set hashtags(value: string[]) {
    this._hashtags = value;
  }

  public setFakeImage(image: string) {
    this._mainImage = {
      id: '',
      legacy_id: 0,
      original_width: 0,
      original_height: 0,
      average_hex_color: '',
      urls_by_size: {
        original: '',
        small: '',
        medium: '',
        large: '',
        xlarge: '',
      },
    };
  }

  set sold(value: boolean) {
    this._flags.sold = value;
  }

  get sold(): boolean {
    return this._flags ? this._flags.sold : false;
  }

  set reserved(value: boolean) {
    this._flags.reserved = value;
  }

  get reserved(): boolean {
    return this._flags ? this._flags.reserved : false;
  }

  set notAvailable(value: boolean) {
    this._flags.notAvailable = value;
  }

  get notAvailable(): boolean {
    return this._flags ? this._flags.notAvailable : false;
  }

  get selected(): boolean {
    return this._selected;
  }

  set selected(value: boolean) {
    this._selected = value;
  }

  get bumpExpiringDate(): number {
    return this._bumpExpiringDate;
  }

  set bumpExpiringDate(value: number) {
    this._bumpExpiringDate = value;
  }

  get bumpLast24h() {
    return this._bumpExpiringDate - Date.now() < 86400;
  }

  get plannedStartsToday() {
    return this._purchases && this._purchases.scheduled_start_date - Date.now() < 86400;
  }

  get webSlug(): string {
    return this._webSlug;
  }

  get featured() {
    return this.flags ? this.flags.bumped || this.flags.highlighted || this.flags.urgent : false;
  }

  get deliveryInfo(): DeliveryInfo {
    return this._deliveryInfo;
  }

  get urgent(): boolean {
    return this._flags ? this._flags.urgent : false;
  }

  set urgent(value: boolean) {
    this._flags.urgent = value;
  }

  get itemType(): string {
    return this._itemType;
  }

  get extraInfo(): ItemExtraInfo {
    return this._extraInfo;
  }

  get car_info(): KmInfo {
    return this._car_info;
  }

  get km(): number {
    return this._km;
  }

  set km(value: number) {
    this._km = value;
  }

  get bumpFlags(): ItemVisibilityFlags {
    return this._bumpFlags;
  }

  set bumpFlags(value: ItemVisibilityFlags) {
    this._bumpFlags = value;
  }
}
