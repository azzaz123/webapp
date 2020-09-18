import { Item } from '../../core/item/item';

export interface InboxUserLocation {
  approximated_latitude: number;
  approximated_longitude: number;
}

export class InboxUser {
  constructor(private _id: string,
              private _microName: string,
              private _blocked: boolean,
              private _available: boolean,
              private _profileUrl: string,
              private _avatarUrl: string,
              private _responseRate: string,
              private _sellingItem: Item,
              private _sellingItemCount: number,
              private _score: number,
              private _location: any,
              private _distanceInKm: number,
              private _malicious: boolean) {
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get microName(): string {
    return this._microName;
  }

  get blocked(): boolean {
    return this._blocked;
  }

  set blocked(value: boolean) {
    this._blocked = value;
  }

  get available(): boolean {
    return this._available;
  }

  set available(value: boolean) {
    this._available = value;
  }

  get profileUrl(): string {
    return this._profileUrl;
  }

  set profileUrl(value: string) {
    this._profileUrl = value;
  }

  get avatarUrl(): string {
    return this._avatarUrl;
  }

  set avatarUrl(value: string) {
    this._avatarUrl = value;
  }

  get responseRate(): string {
    return this._responseRate;
  }

  set responseRate(value: string) {
    this._responseRate = value;
  }

  get score(): number {
    return this._score;
  }

  set score(value: number) {
    this._score = value;
  }

  get location(): any {
    return this._location;
  }

  set location(value: any) {
    this._location = value;
  }

  get sellingItem(): Item {
    return this._sellingItem;
  }

  set sellingItem(value: Item) {
    this._sellingItem = value;
  }

  get sellingItemCount(): number {
    return this._sellingItemCount;
  }

  set sellingItemCount(value: number) {
    this._sellingItemCount = value;
  }

  get distanceInKm(): number {
    return this._distanceInKm;
  }

  set distanceInKm(value: number) {
    this._distanceInKm = value;
  }

  get malicious() {
    return this._malicious;
  }

  set malicious(value: boolean) {
    this._malicious = value;
  }
}

export const InboxUserPlaceholder = new InboxUser(null, 'unknown', false, false, null, null, null, null, 0, 0, null, null, null);
