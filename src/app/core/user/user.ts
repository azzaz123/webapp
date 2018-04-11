import { Model } from '../resource/model.interface';
import { UserLocation, UserStats, UserValidations } from './user-response.interface';
import { Item } from '../item/item';
import { environment } from '../../../environments/environment';

export const USER_BASE_PATH = 'http://es.wallapop.com/user/';
export const PLACEHOLDER_AVATAR = '/assets/images/user.png';
export const PERMISSIONS = {
  'normal': 'isNormal',
  'professional': 'isProfessional'
};

export class User implements Model {

  private _itemDistance: number;
  private _webLink: string;
  private _sellingItem: Item;
  private _itemsCount: number;
  private _blocked: boolean;

  constructor(private _id: string,
              private _microName?: string,
              private _image?: any,
              private _location?: UserLocation,
              private _stats?: UserStats,
              private _validations?: UserValidations,
              private _verificationLevel?: number,
              private _scoringStars?: number,
              private _scoringStarts?: number,
              private _responseRate?: string,
              private _online?: boolean,
              private _type?: string,
              private _receivedReports?: number,
              private webSlug?: string,
              private _firstName?: string,
              private _lastName?: string,
              private _birthDate?: number,
              private _gender?: string,
              private _email?: string) {

    this._webLink = webSlug ? USER_BASE_PATH + webSlug : null;
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

  get stats(): UserStats {
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

  get itemDistance(): number {
    return this._itemDistance;
  }

  set itemDistance(value: number) {
    this._itemDistance = value;
  }

  get webLink(): string {
    return this._webLink;
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

  getUrl(subdomain: string) {
    return environment.siteUrl.replace('es', subdomain) + 'user/' + this.webSlug;
  }
}
