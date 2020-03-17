import { Inject, Injectable } from '@angular/core';
import { PERMISSIONS, User } from './user';
import { Observable, of } from 'rxjs';
import { EventService } from '../event/event.service';
import { ResourceService } from '../resource/resource.service';
import { GeoCoord, HaversineService } from 'ng2-haversine';
import { Item } from '../item/item';
import { LoginResponse } from './login-response.interface';
import { UserLocation, UserResponse, MotorPlan, ProfileSubscriptionInfo, Image } from './user-response.interface';
import { BanReason } from '../item/ban-reason.interface';
import { I18nService } from '../i18n/i18n.service';
import { AccessTokenService } from '../http/access-token.service';
import { environment } from '../../../environments/environment';
import { UserInfoResponse, UserProInfo } from './user-info.interface';
import { Coordinate } from '../geolocation/address-response.interface';
import { AvailableSlots, Counters, Ratings, UserStatsResponse } from './user-stats.interface';
import { UserData, UserProData, UserProDataNotifications } from './user-data.interface';
import { UnsubscribeReason } from './unsubscribe-reason.interface';
import { CookieService } from 'ngx-cookie';
import { NgxPermissionsService } from 'ngx-permissions';
import { FeatureflagService, FEATURE_FLAGS_ENUM } from './featureflag.service';
import { PhoneMethodResponse } from './phone-method.interface';
import { InboxUser } from '../../chat/model/inbox-user';
import { SplitTestService } from '../tracking/split-test.service';
import { InboxItem } from '../../chat/model';
import { APP_VERSION } from '../../../environments/version';
import { UserReportApi } from './user-report.interface';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { catchError, tap, map, finalize } from 'rxjs/operators';
import { isEmpty } from 'lodash-es';

export const LOGIN_ENDPOINT = 'shnm-portlet/api/v1/access.json/login3';
export const LOGOUT_ENDPOINT = 'rest/logout';

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

@Injectable()
export class UserService {
  private banReasons: BanReason[] = null;
  protected _user: User;
  private meObservable: Observable<User>;
  private presenceInterval: any;
  protected _motorPlan: MotorPlan;
  private motorPlanObservable: Observable<MotorPlan>;
  private _users: User[] = [];

  constructor(private http: HttpClient,
              protected event: EventService,
              protected i18n: I18nService,
              protected haversineService: HaversineService,
              protected accessTokenService: AccessTokenService,
              private cookieService: CookieService,
              private permissionService: NgxPermissionsService,
              private featureflagService: FeatureflagService,
              private splitTestService: SplitTestService,
              @Inject('SUBDOMAIN') private subdomain: string) {
  }

  get user(): User {
    return this._user;
  }

  public login(data: any): Observable<LoginResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const body = new HttpParams()
      .set('emailAddress', data.emailAddress)
      .set('installationType', data.installationType)
      .set('password', data.password);

    return this.http.post<LoginResponse>(`${environment.baseUrl}${LOGIN_ENDPOINT}`, body, { headers })
      .pipe(map(r => this.storeData(r)));
  }

  public logout() {
    const logoutUrl = `${environment.siteUrl.replace('es', this.subdomain)}${LOGOUT_ENDPOINT}`;
    this.http.post<string>(logoutUrl, null, { responseType: 'text' as 'json' }).subscribe(r => this.logoutActions(r));
  }

  public logoutLocal() {
    this.logoutActions();
  }

  private logoutActions(redirect?: string) {
    const redirectUrl = redirect ? redirect : environment.siteUrl.replace('es', this.subdomain);
    const cookieOptions = environment.name === 'local' ? { domain: 'localhost' } : { domain: '.wallapop.com' };
    this.cookieService.remove('publisherId', cookieOptions);
    this.cookieService.remove('creditName', cookieOptions);
    this.cookieService.remove('creditQuantity', cookieOptions);
    this.accessTokenService.deleteAccessToken();
    this.permissionService.flushPermissions();
    this.event.emit(EventService.USER_LOGOUT, redirectUrl);
    this.splitTestService.reset();
  }

  public get isLogged(): boolean {
    return this.accessTokenService.accessToken ? true : false;
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
        clearInterval(this.presenceInterval);
      }
    }, interval);
  }

  public get(id: string, noCache?: boolean): Observable<User> {
    const user = this._users.find(user => user.id === id);
    
    if (user) {
      return of(user);
    }

    return this.http.get<UserResponse>(`${environment.baseUrl}${USER_BY_ID_ENDPOINT(id)}`)
      .pipe(
        map(user => this.mapRecordData(user)),
        tap(user => this._users.push(user)),
        catchError(() => of(this.getFakeUser(id)))
      );
  }

  public getFakeUser(id: string): User {
    return new User(id, 'No disponible');
  }

  public me(): Observable<User> {
    if (this._user) {
      return of(this._user);
    }

    return this.http.get<UserResponse>(`${environment.baseUrl}${USER_ENDPOINT}`)
      .pipe(
        map(r => this.mapRecordData(r)),
        tap(user => this._user = user)
      )
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
    const currentUserCoord: GeoCoord = {
      latitude: this.user.location.approximated_latitude,
      longitude: this.user.location.approximated_longitude,
    };
    const userCoord: GeoCoord = {
      latitude: user.location.approximated_latitude || user.location.latitude,
      longitude: user.location.approximated_longitude || user.location.longitude,
    };
    return this.haversineService.getDistanceInKilometers(currentUserCoord, userCoord);
  }

  protected storeData(data: LoginResponse): LoginResponse {
    this.accessTokenService.storeAccessToken(data.token);
    this.event.emit(EventService.USER_LOGIN, data.token);
    return data;
  }

  public getBanReasons(): Observable<BanReason[]> {
    if (!this.banReasons) {
      this.banReasons = this.i18n.getTranslations('reportUserReasons');
    }
    return Observable.of(this.banReasons);
  }

  public reportUser(userId: string, itemHash: string, conversationHash: string, reason: number, comments: string)
    : Observable<UserReportApi> {
    return this.http.post<UserReportApi>(`${environment.baseUrl}${USER_REPORT_ENDPOINT(userId)}`, {
        itemHashId: itemHash,
        conversationHash: conversationHash,
        comments: comments,
        reason: reason
      },
      {
        headers: new HttpHeaders().append('AppBuild', APP_VERSION)
      });
  }

  public getInfo(userId: string): Observable<UserInfoResponse> {
    return this.http.get<UserInfoResponse>(`${environment.baseUrl}${USER_EXTRA_INFO_ENDPOINT(userId)}`);
  }

  public getProInfo(): Observable<UserProInfo> {
    return this.http.get<UserProInfo>(`${environment.baseUrl}${PROTOOL_EXTRA_INFO_ENDPOINT}`);
  }

  public getUserCover(): Observable<Image> {
    return this.http.get<Image>(`${environment.baseUrl}${USER_COVER_IMAGE_ENDPOINT}`)
    .pipe(catchError(error => of({} as Image)));
  }

  public updateProInfo(data: UserProData): Observable<any> {
    return this.http.post(`${environment.baseUrl}${PROTOOL_EXTRA_INFO_ENDPOINT}`, data);
  }

  public updateLocation(coordinates: Coordinate): Observable<UserLocation> {
    return this.http.put<UserLocation>(`${environment.baseUrl}${USER_LOCATION_ENDPOINT}`, {
      latitude: coordinates.latitude,
      longitude: coordinates.longitude
    });
  }

  public updateSearchLocationCookies(location: Coordinate) {
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + (15 * 60 * 1000));
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
      address: coordinates.name
    });
  }

  public getStats(): Observable<UserStatsResponse> {
    return this.http.get<any>(`${environment.baseUrl}${USER_STATS_ENDPOINT}`)
    .map(response => {
      return {
        ratings: this.toRatingsStats(response.ratings),
        counters: this.toCountersStats(response.counters)
      };
    });
  }

  // TODO: Remove if not used when public web is in webapp
  public getUserStats(userId: string): Observable<UserStatsResponse> {
    return this.http.get<any>(`${environment.baseUrl}${USER_STATS_BY_ID_ENDPOINT(userId)}`)
    .map(response => {
      return {
        ratings: this.toRatingsStats(response.ratings),
        counters: this.toCountersStats(response.counters)
      };
    });
  }

  public getPhoneInfo(userId: string): Observable<PhoneMethodResponse> {
    return this.http.get<PhoneMethodResponse>(`${environment.baseUrl}${USER_PHONE_INFO_ENDPOINT(userId)}`)
    .pipe(catchError(() => of(null)));
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
    return this.http.post<UserResponse>(`${environment.baseUrl}${USER_ENDPOINT}`, data)
      .pipe(
        map(response => this.mapRecordData(response)),
        tap(user => this._user = user)
      );
  }

  public updateEmail(email_address: string): Observable<any> {
    return this.http.post(`${environment.baseUrl}${USER_EMAIL_ENDPOINT}`, { email_address });
  }

  public updatePassword(old_password: string, new_password: string): Observable<any> {
    return this.http.post(`${environment.baseUrl}${USER_PASSWORD_ENDPOINT}`, { old_password, new_password });
  }

  public getUnsubscribeReasons(): Observable<UnsubscribeReason[]> {
    const params = { language: this.i18n.locale };
    return this.http.get<UnsubscribeReason[]>(`${environment.baseUrl}${USER_UNSUBSCRIBE_REASONS_ENDPOINT}`, { params });
  }

  public unsubscribe(reason_id: number, other_reason: string): Observable<any> {
    return this.http.post(`${environment.baseUrl}${USER_UNSUBSCRIBE_ENDPOINT}`, { reason_id, other_reason });
  }

  protected mapRecordData(data: UserResponse): User {
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

  public setPermission(userType: string): void {
    if (environment.profeatures) {
      this.permissionService.addPermission(PERMISSIONS[userType]);
    } else {
      this.permissionService.addPermission(PERMISSIONS['normal']);
    }
  }

  public hasPerm(permission: string): Observable<boolean> {
    return this.me()
    .flatMap(() => {
      return Observable.fromPromise(this.permissionService.hasPermission(PERMISSIONS[permission]));
    });
  }

  public isProfessional(): Observable<boolean> {
    return this.hasPerm('professional');
  }

  public isProUser(): Observable<boolean> {
    return Observable.forkJoin([
      this.isProfessional(),
      this.getMotorPlan(),
      this.me()
    ])
    .map((values: any[]) => {
      return values[0] || !!(values[1] && values[1].type) || values[2].featured;
    });
  }

  public getMotorPlan(): Observable<MotorPlan> {
    if (this._motorPlan) {
      return Observable.of(this._motorPlan);
    } else if (this.motorPlanObservable) {
      return this.motorPlanObservable;
    }
    this.motorPlanObservable = this.http.get<MotorPlan>(`${environment.baseUrl}${USER_PROFILE_SUBSCRIPTION_INFO_TYPE_ENDPOINT}`)
    .map((motorPlan: MotorPlan) => {
      this._motorPlan = motorPlan;
      return motorPlan;
    })
    .share()
    .do(() => {
      this.motorPlanObservable = null;
    })
    .catch(() => {
      this.motorPlanObservable = null;
      return Observable.of(null);
    });
    return this.motorPlanObservable;
  }

  public getMotorPlans(): Observable<ProfileSubscriptionInfo> {
    return this.http.get<ProfileSubscriptionInfo>(`${environment.baseUrl}${USER_PROFILE_SUBSCRIPTION_INFO_ENDPOINT}`);
  }

  public setSubscriptionsFeatureFlag(): Observable<boolean> {
    return this.featureflagService.getFlag(FEATURE_FLAGS_ENUM.SUBSCRIPTIONS)
    .map((isActive: boolean) => {
      return isActive;
    });
  }
}
