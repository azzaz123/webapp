import { from, Observable, of } from 'rxjs';

import { mergeMap, catchError, tap, map } from 'rxjs/operators';
import { Inject, Injectable } from '@angular/core';
import { PERMISSIONS, User } from './user';
import { EventService } from '../event/event.service';
import { Item } from '../item/item';
import { UserLocation, UserResponse, Image } from './user-response.interface';
import { BanReason } from '../item/ban-reason.interface';
import { I18nService } from '../i18n/i18n.service';
import { AccessTokenService } from '../http/access-token.service';
import { environment } from '../../../environments/environment';
import { UserInfoResponse, UserProInfo } from './user-info.interface';
import { Coordinate } from '../geolocation/address-response.interface';
import { Counters, Ratings, UserStats, UserStatsResponse } from './user-stats.interface';
import { UserData, UserProData } from './user-data.interface';
import { UnsubscribeReason } from './unsubscribe-reason.interface';
import { CookieService } from 'ngx-cookie';
import { NgxPermissionsService } from 'ngx-permissions';
import { PhoneMethodResponse } from './phone-method.interface';

import { APP_VERSION } from '../../../environments/version';
import { UserReportApi } from './user-report.interface';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { InboxUser, InboxItem } from '@features/chat/core/model';

export const LOGOUT_ENDPOINT = 'shnm-portlet/api/v1/access.json/logout2';
export const USER_BASE_ENDPOINT = 'api/v3/users/';
export const USER_BY_ID_ENDPOINT = (userId: string) => `${USER_BASE_ENDPOINT}${userId}`;
export const USER_ENDPOINT = `${USER_BASE_ENDPOINT}me/`;
export const USER_ONLINE_ENDPOINT = `${USER_ENDPOINT}online`;
export const USER_LOCATION_ENDPOINT = `${USER_ENDPOINT}location`;
export const USER_COVER_IMAGE_ENDPOINT = `${USER_ENDPOINT}cover-image`;
export const USER_PHONE_INFO_ENDPOINT = (userId: string) => `${USER_BASE_ENDPOINT}${userId}/phone-method`;
export const USER_STORE_LOCATION_ENDPOINT = `${USER_ENDPOINT}bumped-profile/store-location'`;
export const USER_STATS_ENDPOINT = `${USER_ENDPOINT}stats`;
export const USER_EXTRA_INFO_ENDPOINT = (userId: string) => `${USER_BASE_ENDPOINT}${userId}/extra-info`;
export const USER_EMAIL_ENDPOINT = `${USER_ENDPOINT}email`;
export const USER_PASSWORD_ENDPOINT = `${USER_ENDPOINT}password`;
export const USER_UNSUBSCRIBE_ENDPOINT = `${USER_ENDPOINT}unsubscribe/`;
export const USER_UNSUBSCRIBE_REASONS_ENDPOINT = `${USER_UNSUBSCRIBE_ENDPOINT}reason`;
export const USER_REPORT_ENDPOINT = (userId: string) => `${USER_ENDPOINT}report/user/${userId}`;
export const USER_STATS_BY_ID_ENDPOINT = (userId: string) => `${USER_BASE_ENDPOINT}${userId}/stats`;
export const USER_PROFILE_SUBSCRIPTION_INFO_ENDPOINT = `${USER_ENDPOINT}profile-subscription-info/`;
export const USER_PROFILE_SUBSCRIPTION_INFO_TYPE_ENDPOINT = `${USER_ENDPOINT}type`;

export const PROTOOL_ENDPOINT = 'api/v3/protool/';
export const PROTOOL_EXTRA_INFO_ENDPOINT = `${PROTOOL_ENDPOINT}extraInfo`;
export enum USER_TYPE {
  PROFESSIONAL = 'professional',
  FEATURED = 'featured',
  NORMAL = 'normal',
}

export const LOCAL_STORAGE_TRY_PRO_SLOT = 'try-pro-slot';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _user: User;
  private _users: User[] = [];
  private banReasons: BanReason[];
  private presenceInterval: any;

  constructor(
    private http: HttpClient,
    private event: EventService,
    private i18n: I18nService,
    private accessTokenService: AccessTokenService,
    private cookieService: CookieService,
    private permissionService: NgxPermissionsService,
    @Inject('SUBDOMAIN') private subdomain: string
  ) {}

  get user(): User {
    return this._user;
  }

  get isPro(): boolean {
    return this._user && this._user.featured;
  }

  public getReleaseVersion(appVersion: string): number {
    return +appVersion
      .split('.')
      .map((subVersion: string) => ('00' + subVersion).slice(-3))
      .reduce((a: string, b: string) => a + b);
  }

  public logout(redirect?: string): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders(<string | string[] | any>{
      DeviceAccessToken: this.cookieService.get('deviceAccessToken' + environment.cookieSuffix)
        ? this.cookieService.get('deviceAccessToken' + environment.cookieSuffix)
        : '',
      AppBuild: this.getReleaseVersion(APP_VERSION),
      DeviceOS: '0',
    });
    return this.http.post(`${environment.baseUrl}${LOGOUT_ENDPOINT}`, null, { headers }).pipe(
      tap(() => {
        const redirectUrl = redirect ? redirect : environment.siteUrl.replace('es', this.subdomain);
        const cookieOptions = environment.name === 'local' ? { domain: 'localhost' } : { domain: '.wallapop.com' };
        this.cookieService.remove('publisherId', cookieOptions);
        this.cookieService.remove('creditName', cookieOptions);
        this.cookieService.remove('creditQuantity', cookieOptions);
        this.accessTokenService.deleteAccessToken();
        this.permissionService.flushPermissions();
        this.event.emit(EventService.USER_LOGOUT, redirectUrl);
      })
    );
  }

  public get isLogged(): boolean {
    return !!this.accessTokenService.accessToken;
  }

  private sendUserPresence() {
    return this.http.post(`${environment.baseUrl}${USER_ONLINE_ENDPOINT}`, null).subscribe();
  }

  public sendUserPresenceInterval(interval: number) {
    this.sendUserPresence();
    this.presenceInterval = setInterval(() => {
      if (this.isLogged) {
        this.sendUserPresence();
      } else {
        console.log('not logged');
        clearInterval(this.presenceInterval);
      }
    }, interval);
  }

  public get(id: string, noCache?: boolean): Observable<User> {
    const user = this._users.find((user) => user.id === id);

    if (user) {
      return of(user);
    }

    return this.http.get<UserResponse>(`${environment.baseUrl}${USER_BY_ID_ENDPOINT(id)}`).pipe(
      map((user) => this.mapRecordData(user)),
      tap((user) => this._users.push(user)),
      catchError(() => of(this.getFakeUser(id)))
    );
  }

  public getFakeUser(id: string): User {
    return new User(id, 'No disponible');
  }

  public me(useCache = true): Observable<User> {
    if (useCache && this._user) {
      return of(this._user);
    }

    return this.http.get<UserResponse>(`${environment.baseUrl}${USER_ENDPOINT}`).pipe(
      map((r) => this.mapRecordData(r)),
      tap((user) => (this._user = user)),
      // TODO: This will need to be parsed when devops team adds CORS headers on API gateway error
      catchError((error) => {
        this.logout(null);
        return of(error);
      })
    );
  }

  public checkUserStatus() {
    if (this.isLogged) {
      this.event.emit(EventService.USER_LOGIN, this.accessTokenService.accessToken);
    }
  }

  public calculateDistanceFromItem(user: User | InboxUser, item: Item | InboxItem): number {
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

  public getBanReasons(): Observable<BanReason[]> {
    if (!this.banReasons) {
      this.banReasons = this.i18n.getTranslations('reportUserReasons');
    }
    return of(this.banReasons);
  }

  public reportUser(
    userId: string,
    itemHashId: string,
    conversationHash: string,
    reason: number,
    comments: string
  ): Observable<UserReportApi> {
    return this.http.post<UserReportApi>(
      `${environment.baseUrl}${USER_REPORT_ENDPOINT(userId)}`,
      {
        itemHashId,
        conversationHash,
        comments,
        reason,
        targetCrm: 'zendesk',
      },
      {
        headers: new HttpHeaders().append('AppBuild', APP_VERSION),
      }
    );
  }

  public getInfo(userId: string): Observable<UserInfoResponse> {
    return this.http.get<UserInfoResponse>(`${environment.baseUrl}${USER_EXTRA_INFO_ENDPOINT(userId)}`);
  }

  public getProInfo(): Observable<UserProInfo> {
    return this.http.get<UserProInfo>(`${environment.baseUrl}${PROTOOL_EXTRA_INFO_ENDPOINT}`);
  }

  public getUserCover(): Observable<Image> {
    return this.http.get<Image>(`${environment.baseUrl}${USER_COVER_IMAGE_ENDPOINT}`).pipe(catchError((error) => of({} as Image)));
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

  // TODO: This is in the apps but currently not now in web. Not being used but in the future is going to be implemented
  public updateStoreLocation(coordinates: Coordinate): Observable<any> {
    return this.http.post(`${environment.baseUrl}${USER_STORE_LOCATION_ENDPOINT}`, {
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      address: coordinates.name,
    });
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
      tap((user) => (this._user = user))
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
    const params = { language: this.i18n.locale };
    return this.http.get<UnsubscribeReason[]>(`${environment.baseUrl}${USER_UNSUBSCRIBE_REASONS_ENDPOINT}`, { params });
  }

  public unsubscribe(reason_id: number, other_reason: string): Observable<any> {
    return this.http.post(`${environment.baseUrl}${USER_UNSUBSCRIBE_ENDPOINT}`, { reason_id, other_reason });
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
      data.extra_info
    );
  }

  public checkUserPermissions(): Observable<boolean> {
    if (!this.isLogged) {
      return of(true);
    }

    return this.me(false).pipe(
      tap((user) => this.setPermission(user)),
      map(() => true),
      catchError(() => of(true))
    );
  }

  public setPermission(user: User): void {
    user.featured && user.type !== USER_TYPE.PROFESSIONAL
      ? this.permissionService.addPermission(PERMISSIONS[USER_TYPE.FEATURED])
      : this.permissionService.addPermission(PERMISSIONS[user.type]);
  }

  public hasPerm(permission: string): Observable<boolean> {
    return this.me().pipe(
      mergeMap(() => {
        return from(this.permissionService.hasPermission(PERMISSIONS[permission]));
      })
    );
  }

  // TODO: This is if user is car dealer, should be `isCarDealer`
  public isProfessional(): Observable<boolean> {
    return this.hasPerm(USER_TYPE.PROFESSIONAL);
  }

  // TODO: This logic is correct for now, but should be checked using the subscriptions BFF
  public isProUser(): Observable<boolean> {
    return this.me().pipe(map((user) => user.featured));
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

  public suggestPro(): boolean {
    return !this.isPro && !localStorage.getItem(`${this.user.id}-${LOCAL_STORAGE_TRY_PRO_SLOT}`);
  }
}
