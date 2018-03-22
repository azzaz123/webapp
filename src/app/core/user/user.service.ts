import { Inject, Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { User } from './user';
import { Observable } from 'rxjs/Observable';
import { EventService } from '../event/event.service';
import { ResourceService } from '../resource/resource.service';
import { GeoCoord, HaversineService } from 'ng2-haversine';
import { Item } from '../item/item';
import { LoginResponse } from './login-response.interface';
import { Response } from '@angular/http';
import { UserResponse, UserLocation } from './user-response.interface';
import { BanReason } from '../item/ban-reason.interface';
import { I18nService } from '../i18n/i18n.service';
import { AccessTokenService } from '../http/access-token.service';
import { environment } from '../../../environments/environment';
import { UserInfoResponse } from './user-info.interface';
import { Coordinate } from '../geolocation/address-response.interface';
import { Counters, Ratings, UserStatsResponse } from './user-stats.interface';
import { UserData } from './user-data.interface';
import { UnsubscribeReason } from './unsubscribe-reason.interface';
import { CookieService } from 'ngx-cookie';

@Injectable()
export class UserService extends ResourceService {

  public queryParams: any = {};
  protected API_URL = 'api/v3/users';
  private banReasons: BanReason[] = null;
  protected _user: User;
  private meObservable: Observable<User>;

  constructor(http: HttpService,
              protected event: EventService,
              protected i18n: I18nService,
              protected haversineService: HaversineService,
              protected accessTokenService: AccessTokenService,
              private cookieService: CookieService,
              @Inject('SUBDOMAIN') private subdomain: string) {
    super(http);
  }

  get user(): User {
    return this._user;
  }

  public login(data: any): Observable<LoginResponse> {
    return this.http.postUrlEncoded(
      'shnm-portlet/api/v1/access.json/login3',
      data
    )
    .map((r: Response) => r.json())
    .map((r: LoginResponse) => this.storeData(r));
  }

  public logout() {
    const URL = environment.siteUrl.replace('es', this.subdomain);
    this.http.postNoBase(URL + 'rest/logout', undefined, undefined, true).subscribe((response) => {
      const redirectUrl: any = response['_body'];
      const cookieOptions = environment.name === 'local' ? { domain: 'localhost' } : { domain: '.wallapop.com' };
      this.cookieService.remove('publisherId', cookieOptions);
      this.accessTokenService.deleteAccessToken();
      this.event.emit(EventService.USER_LOGOUT, redirectUrl);
    });
  }

  public get isLogged(): boolean {
    return this.accessTokenService.accessToken ? true : false;
  }

  public get(id: string, noCache?: boolean): Observable<User> {
    return <Observable<User>>super.get(id, noCache).catch(() => {
      return Observable.of(this.getFakeUser(id));
    });
  }

  public getFakeUser(id: string): User {
    return new User(id, 'No disponible');
  }

  public me(): Observable<User> {
    if (this._user) {
      return Observable.of(this._user);
    } else if (this.meObservable) {
      return this.meObservable;
    }
    this.meObservable = this.http.get(this.API_URL + '/me')
    .map((r: Response) => r.json())
    .map((r: UserResponse) => this.mapRecordData(r))
    .map((user: User) => {
      this._user = user;
      return user;
    })
    .share()
    .do(() => {
      this.meObservable = null;
    })
    .catch(() => {
      this.meObservable = null;
      return Observable.of(null);
    });
    return this.meObservable;
  }

  public checkUserStatus() {
    if (this.isLogged) {
      this.event.emit(EventService.USER_LOGIN, this.accessTokenService.accessToken);
    }
  }

  public calculateDistanceFromItem(user: User, item: Item): number {
    if (!user.location || !this.user.location) {
      return null;
    }
    const currentUserCoord: GeoCoord = {
      latitude: this.user.location.approximated_latitude,
      longitude: this.user.location.approximated_longitude,
    };
    const userCoord: GeoCoord = {
      latitude: user.location.approximated_latitude,
      longitude: user.location.approximated_longitude,
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

  public reportUser(userId: string,
                    itemId: number,
                    comments: string,
                    reason: number,
                    conversationId: number): Observable<any> {

    let data: any = {
      itemId: itemId,
      comments: comments,
      reason: reason,
      conversationId: conversationId,
    };
    return this.http.post(this.API_URL + '/me/report/user/' + userId, data);
  }

  public updateBlockStatus(userId: string, blocked: boolean) {
    this.store[userId].blocked = blocked;
  }

  public getInfo(id: string): Observable<UserInfoResponse> {
    return this.http.get(this.API_URL + '/' + id + '/extra-info')
    .map((r: Response) => r.json())
  }

  public updateLocation(coordinates: Coordinate): Observable<UserLocation> {
    return this.http.put(this.API_URL + '/me/location', {
      latitude: coordinates.latitude,
      longitude: coordinates.longitude
    })
    .map((r: Response) => r.json())
  }

  public getStats(): Observable<UserStatsResponse> {
    return this.http.get(this.API_URL + '/me/stats')
    .map((r: Response) => {
      return {
        ratings: this.toRatingsStats(r.json().ratings),
        counters: this.toCountersStats(r.json().counters)
      }
    });
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
    return this.http.post(this.API_URL + '/me', data)
    .map((r: Response) => r.json())
    .map((r: UserResponse) => this.mapRecordData(r))
    .do((user: User) => {
      this._user = user;
    });
  }

  public updateEmail(email: string): Observable<any> {
    return this.http.post(this.API_URL + '/me/email', {
      email_address: email
    });
  }

  public updatePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.http.post(this.API_URL + '/me/password', {
      old_password: oldPassword,
      new_password: newPassword
    });
  }

  public getUnsubscribeReasons(): Observable<UnsubscribeReason[]> {
    return this.http.get(this.API_URL + '/me/unsubscribe/reason', {language: this.i18n.locale})
    .map((r: Response) => r.json());
  }

  public unsubscribe(reasonId: number, otherReason: string): Observable<any> {
    return this.http.post(this.API_URL + '/me/unsubscribe', {
      reason_id: reasonId,
      other_reason: otherReason
    });
  }

  protected mapRecordData(data: UserResponse): User {
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
      data.email
    );
  }
}


