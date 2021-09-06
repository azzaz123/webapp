import { Model } from '../resource/model.interface';
import { UserExtrainfo, UserLocation, UserStatsOld, UserValidations, Image } from './user-response.interface';
import { Item } from '../item/item';

export const PLACEHOLDER_AVATAR = '/assets/images/user.png';
export const PLACEHOLDER_COVER = '/assets/images/cover.svg';

export class User implements Model {
  private _itemDistance: number;
  private _sellingItem: Item;
  private _itemsCount: number;
  private _blocked: boolean;

  constructor(
    private _id: string,
    private _microName?: string,
    private _image?: any,
    private _location?: UserLocation,
    private _stats?: UserStatsOld,
    private _validations?: UserValidations,
    private _verificationLevel?: number,
    private _scoringStars?: number,
    private _scoringStarts?: number,
    private _responseRate?: string,
    private _online?: boolean,
    private _type?: string,
    private _receivedReports?: number,
    private _webSlug?: string,
    private _firstName?: string,
    private _lastName?: string,
    private _birthDate?: number,
    private _gender?: string,
    private _email?: string,
    private _featured = false,
    private _extraInfo?: UserExtrainfo,
    private _coverImage?: Image,
    private _registerDate?: Date
  ) {
    this._type = this.mapType(this._type);
  }

  get id(): string {
    return this._id;
  }

  get microName(): string {
    return this._microName;
  }

  get image(): any {
    return this._image;
  }

  set image(value: any) {
    this._image = value;
  }

  get location(): UserLocation {
    return this._location;
  }

  set location(value: UserLocation) {
    this._location = value;
  }

  get stats(): UserStatsOld {
    return this._stats;
  }

  get validations(): UserValidations {
    return this._validations;
  }

  get verificationLevel(): number {
    return this._verificationLevel;
  }

  get scoringStars(): number {
    return this._scoringStars;
  }

  get scoringStarts(): number {
    return this._scoringStarts;
  }

  set scoringStars(value: number) {
    this._scoringStars = value;
  }

  get responseRate(): string {
    return this._responseRate;
  }

  set responseRate(value: string) {
    this._responseRate = value;
  }

  get online(): boolean {
    return this._online;
  }

  get type(): string {
    return this._type;
  }

  get receivedReports(): number {
    return this._receivedReports;
  }

  set receivedReports(value: number) {
    this._receivedReports = value;
  }

  get itemDistance(): number {
    return this._itemDistance;
  }

  set itemDistance(value: number) {
    this._itemDistance = value;
  }

  set webSlug(value: string) {
    this._webSlug = value;
  }

  get webSlug(): string {
    return this._webSlug;
  }

  set online(value: boolean) {
    this._online = value;
  }

  private mapType(type: string) {
    return type ? type : 'inactive';
  }

  get sellingItem(): Item {
    return this._sellingItem;
  }

  set sellingItem(value: Item) {
    this._sellingItem = value;
  }

  get itemsCount(): number {
    return this._itemsCount;
  }

  set itemsCount(value: number) {
    this._itemsCount = value;
  }

  get blocked(): boolean {
    return this._blocked;
  }

  set blocked(value: boolean) {
    this._blocked = value;
  }

  get firstName(): string {
    return this._firstName;
  }

  set firstName(value: string) {
    this._firstName = value;
  }

  get lastName(): string {
    return this._lastName;
  }

  set lastName(value: string) {
    this._lastName = value;
  }

  get birthDate(): number {
    return this._birthDate;
  }

  set birthDate(value: number) {
    this._birthDate = value;
  }

  get gender(): string {
    return this._gender;
  }

  set gender(value: string) {
    this._gender = value;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }

  get featured(): boolean {
    return this._featured;
  }

  set featured(value: boolean) {
    this._featured = value;
  }

  get extraInfo(): UserExtrainfo {
    return this._extraInfo;
  }

  get coverImage(): any {
    return this._coverImage;
  }

  set coverImage(value: any) {
    this._coverImage = value;
  }

  get registerDate(): Date {
    return this._registerDate;
  }

  set registerDate(value: Date) {
    this._registerDate = value;
  }

  public setCoverImageUrl(url: string) {
    if (!this._coverImage) {
      this._coverImage = {
        id: '',
        original_width: 0,
        original_height: 0,
        average_hex_color: '',
        urls_by_size: {
          original: url,
          small: url,
          large: url,
          medium: url,
          xlarge: url,
        },
      };
    } else {
      this._coverImage.urls_by_size.original = url;
      this._coverImage.urls_by_size.small = url;
      this._coverImage.urls_by_size.large = url;
      this._coverImage.urls_by_size.medium = url;
      this._coverImage.urls_by_size.xlarge = url;
    }
  }
}
