import { BehaviorSubject, from, Observable, of, ReplaySubject } from 'rxjs';

import { catchError, tap, map, take, finalize } from 'rxjs/operators';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { User } from './user';
import { EventService } from '../event/event.service';
import { UserLocation, UserResponse, Image } from './user-response.interface';
import { AccessTokenService } from '../http/access-token.service';
import { environment } from '@environments/environment';
import { UserInfoResponse, UserProInfo } from './user-info.interface';
import { Coordinate, StoreLocation, StoreLocationResponse } from '../geolocation/address-response.interface';
import { Counters, Ratings, UserStats, UserStatsResponse } from './user-stats.interface';
import { UserData, UserProData } from './user-data.interface';
import { UnsubscribeReason } from './unsubscribe-reason.interface';
import { CookieService } from 'ngx-cookie';
import { NgxPermissionsService } from 'ngx-permissions';
import { PhoneMethodResponse } from './phone-method.interface';

import { APP_VERSION } from '@environments/version';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { InboxUser } from '@private/features/chat/core/model';
import { ReleaseVersionService } from '@core/release-version/release-version.service';

import { PERMISSIONS } from './user-constants';
import { APP_LOCALE } from '@configs/subdomains.config';
import { SITE_URL } from '@configs/site-url.config';
import { mParticle } from '@core/analytics/mparticle.constants';

export const LOGOUT_ENDPOINT = 'shnm-portlet/api/v1/access.json/logout2';
export const USER_BASE_ENDPOINT = 'api/v3/users/';
export const USER_BY_ID_ENDPOINT = (userId: string) => `${USER_BASE_ENDPOINT}${userId}`;
export const USER_ENDPOINT = `${USER_BASE_ENDPOINT}me/`;
export const USER_ONLINE_ENDPOINT = `${USER_ENDPOINT}online`;
export const USER_LOCATION_ENDPOINT = `${USER_ENDPOINT}location`;
export const USER_COVER_IMAGE_ENDPOINT = `${USER_ENDPOINT}cover-image`;
export const USER_PHONE_INFO_ENDPOINT = (userId: string) => `${USER_BASE_ENDPOINT}${userId}/phone-method`;
export const USER_STORE_LOCATION_ENDPOINT = `${USER_ENDPOINT}bumped-profile/store-location`;
export const USER_STATS_ENDPOINT = `${USER_ENDPOINT}stats`;
export const USER_EXTRA_INFO_ENDPOINT = (userId: string) => `${USER_BASE_ENDPOINT}${userId}/extra-info`;
export const USER_EMAIL_ENDPOINT = `${USER_ENDPOINT}email`;
export const USER_PASSWORD_ENDPOINT = `${USER_ENDPOINT}password`;
export const USER_UNSUBSCRIBE_ENDPOINT = `${USER_ENDPOINT}unsubscribe/`;
export const USER_UNSUBSCRIBE_REASONS_ENDPOINT = `${USER_UNSUBSCRIBE_ENDPOINT}reason`;
export const USER_STATS_BY_ID_ENDPOINT = (userId: string) => `${USER_BASE_ENDPOINT}${userId}/stats`;

export const PROTOOL_ENDPOINT = 'api/v3/protool/';
export const PROTOOL_EXTRA_INFO_ENDPOINT = `${PROTOOL_ENDPOINT}extraInfo`;
export enum USER_TYPE {
  PROFESSIONAL = 'professional',
  FEATURED = 'featured',
  NORMAL = 'normal',
}

export const LOCAL_STORAGE_TRY_PRO_SLOT = 'try-pro-slot';
export const LOCAL_STORAGE_CLICK_PRO_SECTION = 'click-pro-section';
export const LOCAL_STORAGE_SUGGEST_PRO_SHOWN = 'suggest-pro-shown';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _user: User;
  private readonly _userSubject: ReplaySubject<User> = new ReplaySubject();
  private _users: User[] = [];
  private presenceInterval: any;
  private _isProSectionClicked: boolean;
  private isProUserSubject = new BehaviorSubject(false);

  constructor(
    private http: HttpClient,
    private event: EventService,
    private accessTokenService: AccessTokenService,
    private cookieService: CookieService,
    private permissionService: NgxPermissionsService,
    private releaseVersionService: ReleaseVersionService,
    @Inject(LOCALE_ID) private locale: APP_LOCALE,
    @Inject(SITE_URL) private siteUrl: string
  ) {}

  get user(): User {
    return this._user;
  }

  get user$(): Observable<User> {
    return this._userSubject.asObservable();
  }

  get isPro(): boolean {
    return this._user && this._user.featured;
  }

  get isProUser$(): Observable<boolean> {
    return this.isProUserSubject.asObservable();
  }

  get isClickedProSection(): boolean {
    return this._isProSectionClicked;
  }

  public get isLogged(): boolean {
    return !!this.accessTokenService.accessToken;
  }

  public get(id: string, cache: boolean = true): Observable<User> {
    const user = this._users.find((user) => user.id === id);

    if (user && cache) {
      return of(user);
    }

    return this.http.get<UserResponse>(`${environment.baseUrl}${USER_BY_ID_ENDPOINT(id)}`).pipe(
      map((user) => this.mapRecordData(user)),
      tap((user) => this._users.push(user)),
      catchError(() => of(this.getFakeUser(id)))
    );
  }

  public logoutLogic(redirect?: string): void {
    const redirectUrl = redirect ? redirect : this.siteUrl;
    const cookieOptions = environment.name === 'local' ? { domain: 'localhost' } : { domain: '.wallapop.com' };
    this.cookieService.remove('publisherId', cookieOptions);
    this.cookieService.remove('creditName', cookieOptions);
    this.cookieService.remove('creditQuantity', cookieOptions);
    this.accessTokenService.deleteAccessToken();
    this.permissionService.flushPermissions();
    this.logoutMParticle(() => this.event.emit(EventService.USER_LOGOUT, redirectUrl));
  }

  public isCurrentUser(userId: string): boolean {
    return this.isLogged && this.user?.id === userId;
  }

  public getFakeUser(id: string): User {
    return new User(id, 'No disponible');
  }

  public getLoggedUserInformation(): Observable<User> {
    return this.http.get<UserResponse>(`${environment.baseUrl}${USER_ENDPOINT}`).pipe(map((r) => this.mapRecordData(r)));
  }

  public checkUserStatus() {
    if (this.isLogged) {
      this.event.emit(EventService.USER_LOGIN, this.accessTokenService.accessToken);
    }
  }

  public calculateDistanceFromItem(user: User | InboxUser): number {
    if (!user.location || !this.user.location) {
      return null;
    }
    const currentUserCoord: Coordinate = {
      latitude: this.user.location.approximated_latitude,
      longitude: this.user.location.approximated_longitude,
    };
    const userCoord: Coordinate = {
      latitude: user.location.approximated_latitude || user.location.latitude,
      longitude: user.location.approximated_longitude || user.location.longitude,
    };
    return this.getDistanceInKilometers(currentUserCoord, userCoord);
  }

  public getInfo(userId: string): Observable<UserInfoResponse> {
    return this.http.get<UserInfoResponse>(`${environment.baseUrl}${USER_EXTRA_INFO_ENDPOINT(userId)}`);
  }

  public getProInfo(): Observable<UserProInfo> {
    return this.http.get<UserProInfo>(`${environment.baseUrl}${PROTOOL_EXTRA_INFO_ENDPOINT}`);
  }

  public getUserCover(): Observable<Image> {
    return this.http.get<Image>(`${environment.baseUrl}${USER_COVER_IMAGE_ENDPOINT}`).pipe(catchError(() => of({} as Image)));
  }

  public updateProInfo(data: UserProData): Observable<any> {
    return this.http.post(`${environment.baseUrl}${PROTOOL_EXTRA_INFO_ENDPOINT}`, data);
  }

  public updateLocation(coordinates: Coordinate): Observable<UserLocation> {
    return this.http.put<UserLocation>(`${environment.baseUrl}${USER_LOCATION_ENDPOINT}`, {
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
    });
  }

  public updateSearchLocationCookies(location: Coordinate) {
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + 15 * 60 * 1000);
    const cookieOptions = { expires: expirationDate, domain: '.wallapop.com' };

    this.cookieService.put('searchLat', location.latitude.toString(), cookieOptions);
    this.cookieService.put('searchLng', location.longitude.toString(), cookieOptions);
    this.cookieService.put('searchPosName', location.name, cookieOptions);
  }

  public updateStoreLocation(storeLocation: StoreLocation): Observable<StoreLocationResponse> {
    return this.http.post<StoreLocationResponse>(`${environment.baseUrl}${USER_STORE_LOCATION_ENDPOINT}`, storeLocation);
  }

  public getStats(): Observable<UserStats> {
    return this.http.get<UserStatsResponse>(`${environment.baseUrl}${USER_STATS_ENDPOINT}`).pipe(
      map((response) => {
        return {
          ratings: this.toRatingsStats(response.ratings),
          counters: this.toCountersStats(response.counters),
        };
      })
    );
  }

  // TODO: Remove if not used when public web is in webapp
  public getUserStats(userId: string): Observable<UserStats> {
    return this.http.get<any>(`${environment.baseUrl}${USER_STATS_BY_ID_ENDPOINT(userId)}`).pipe(
      map((response) => {
        return {
          ratings: this.toRatingsStats(response.ratings),
          counters: this.toCountersStats(response.counters),
        };
      })
    );
  }

  public getPhoneInfo(userId: string): Observable<PhoneMethodResponse> {
    return this.http.get<PhoneMethodResponse>(`${environment.baseUrl}${USER_PHONE_INFO_ENDPOINT(userId)}`).pipe(catchError(() => of(null)));
  }

  public toRatingsStats(ratings): Ratings {
    return ratings.reduce(({}, rating) => {
      return { reviews: rating.value };
    }, {});
  }

  public toCountersStats(counters): Counters {
    return counters.reduce((counterObj, counter) => {
      counterObj[counter.type] = counter.value;
      return counterObj;
    }, {});
  }

  public edit(data: UserData): Observable<User> {
    return this.http.post<UserResponse>(`${environment.baseUrl}${USER_ENDPOINT}`, data).pipe(
      map((response) => this.mapRecordData(response)),
      tap((user) => {
        this._user = user;
        this.isProUserSubject.next(this.isPro);
      })
    );
  }

  public updateEmail(email_address: string): Observable<any> {
    return this.http.post(`${environment.baseUrl}${USER_EMAIL_ENDPOINT}`, {
      email_address,
    });
  }

  public updatePassword(old_password: string, new_password: string): Observable<any> {
    return this.http.post(`${environment.baseUrl}${USER_PASSWORD_ENDPOINT}`, {
      old_password,
      new_password,
    });
  }

  public getUnsubscribeReasons(): Observable<UnsubscribeReason[]> {
    const params = { language: this.locale };
    return this.http.get<UnsubscribeReason[]>(`${environment.baseUrl}${USER_UNSUBSCRIBE_REASONS_ENDPOINT}`, { params });
  }

  public unsubscribe(reason_id: number, other_reason: string): Observable<any> {
    return this.http.post(`${environment.baseUrl}${USER_UNSUBSCRIBE_ENDPOINT}`, { reason_id, other_reason });
  }

  public initializeUser(): Promise<User> {
    return this.getLoggedUserInformation()
      .pipe(
        tap((user) => {
          this._user = user;
          this._userSubject.next(user);
          this.isProUserSubject.next(this.isPro);
        }),
        tap(() => this.getStoredIsClickedProSection()),
        catchError((error) => {
          this.logout(null);
          return of(error);
        })
      )
      .toPromise();
  }

  //TODO: This is needed for the current subscriptions flow but this should handled in some other way when
  // the application is reactive to changes in the user object
  public getAndUpdateLoggedUser(): Observable<User> {
    return this.getLoggedUserInformation().pipe(
      tap((user) => {
        this._user = user;
        this.isProUserSubject.next(this.isPro);
      })
    );
  }

  public hasPerm(permission: string): Observable<boolean> {
    return from(this.permissionService.hasPermission(PERMISSIONS[permission]));
  }

  // TODO: This is if user is car dealer, should be `isCarDealer`
  public isProfessional(): Observable<boolean> {
    return this.hasPerm(USER_TYPE.PROFESSIONAL);
  }

  // TODO: This logic is correct for now, but should be checked using the subscriptions BFF
  public isProUser(): boolean {
    return this.user.featured;
  }

  public suggestPro(): boolean {
    return !this.isPro && !localStorage.getItem(`${this.user.id}-${LOCAL_STORAGE_TRY_PRO_SLOT}`);
  }

  public setClickedProSection(): void {
    this.saveLocalStore(LOCAL_STORAGE_CLICK_PRO_SECTION, 'true');
    this._isProSectionClicked = true;
  }

  public saveLocalStore(key: string, value: string): void {
    localStorage.setItem(`${this.user.id}-${key}`, value);
  }

  public getLocalStore(key: string): string {
    return localStorage.getItem(`${this.user.id}-${key}`);
  }

  public hasStoreLocation(user: User): boolean {
    return !!(user.extraInfo && user.extraInfo.address?.length > 0 && (user.extraInfo.latitude || user.extraInfo.longitude));
  }
  public logout(redirect?: string): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders({
      DeviceAccessToken: this.accessTokenService.deviceAccessToken,
      AppBuild: this.releaseVersionService.getReleaseVersion(APP_VERSION),
      DeviceOS: '0',
    });
    return this.http.post(`${environment.baseUrl}${LOGOUT_ENDPOINT}`, null, { headers }).pipe(
      take(1),
      finalize(() => {
        this.logoutLogic(redirect);
      })
    );
  }

  public sendUserPresenceInterval(interval: number) {
    this.sendUserPresence();
    this.presenceInterval = setInterval(() => {
      if (this.isLogged) {
        this.sendUserPresence();
      } else {
        clearInterval(this.presenceInterval);
      }
    }, interval);
  }

  // FIXME: This should be handled through the analytics service
  private logoutMParticle(callback: () => void): void {
    const identityCallback = (result: mParticle.IdentityResult) => {
      if (result.getUser()) {
        callback();
      }
    };
    mParticle.Identity.logout({ userIdentities: {} }, identityCallback);
  }

  private sendUserPresence() {
    return this.http.post(`${environment.baseUrl}${USER_ONLINE_ENDPOINT}`, null).subscribe();
  }

  private mapRecordData(data: UserResponse): User {
    if (!data || !data.id) {
      return null;
    }

    return new User(
      data.id,
      data.micro_name,
      data.image,
      data.location,
      data.stats,
      data.validations,
      data.verification_level,
      data.scoring_stars,
      data.scoring_starts,
      data.response_rate,
      data.online,
      data.type,
      data.received_reports,
      data.web_slug,
      data.first_name,
      data.last_name,
      data.birth_date,
      data.gender,
      data.email,
      data.featured,
      data.extra_info,
      null,
      null,
      data.phone
    );
  }

  private getDistanceInKilometers(coord1: Coordinate, coord2: Coordinate): number {
    const distance = this.getDistance(coord1, coord2);
    return 6371 * distance;
  }

  private getDistance(coord1: Coordinate, coord2: Coordinate): number {
    const v1 = this.toRadians(coord1.latitude);
    const v2 = this.toRadians(coord2.latitude);
    const s1 = this.toRadians(coord2.latitude - coord1.latitude);
    const s2 = this.toRadians(coord2.longitude - coord1.longitude);
    const a = Math.pow(Math.sin(s1 / 2), 2) + Math.cos(v1) * Math.cos(v2) * Math.pow(Math.sin(s2 / 2), 2);
    return 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  private toRadians(value: number): number {
    return (value * Math.PI) / 180;
  }

  private getStoredIsClickedProSection(): void {
    this._isProSectionClicked = !!this.getLocalStore(LOCAL_STORAGE_CLICK_PRO_SECTION);
  }
}
