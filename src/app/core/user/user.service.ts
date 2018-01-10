import { Inject, Injectable } from '@angular/core';
import {
  AccessTokenService,
  EventService,
  HttpService,
  I18nService,
  Item,
  LoginResponse,
  User,
  UserService as UserServiceMaster,
  Location,
  USER_LOCATION
} from 'shield';
import { GeoCoord, HaversineService } from 'ng2-haversine';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
import { environment } from '../../../environments/environment';
import { UserInfoResponse } from './user-info.interface';
import { Coordinate } from '../geolocation/address-response.interface';
import {Counters, Ratings, UserStatsResponse} from './user-stats.interface';

@Injectable()
export class UserService extends UserServiceMaster {

  protected API_URL_V2: string = 'api/v3/users';

  constructor(http: HttpService,
              event: EventService,
              i18n: I18nService,
              haversineService: HaversineService,
              accessTokenService: AccessTokenService,
              @Inject('SUBDOMAIN') private subdomain: string) {
    super(http, event, i18n, haversineService, accessTokenService);
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
      this.accessTokenService.deleteAccessToken();
      this.event.emit(EventService.USER_LOGOUT, redirectUrl);
    });
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

  public getInfo(id: string): Observable<UserInfoResponse> {
    return this.http.get(this.API_URL_V3 + '/' + id + '/extra-info')
    .map((r: Response) => r.json())
  }

  public updateLocation(coordinates: Coordinate): Observable<Location> {
    return this.http.put(this.API_URL_V3 + '/me/location', {
      latitude: coordinates.latitude,
      longitude: coordinates.longitude
    })
    .map((r: Response) => r.json())
  }

  public getStats(): Observable<UserStatsResponse> {
    return this.http.get(this.API_URL_V3 + '/me/stats')
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
}
