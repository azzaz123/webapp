import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Profile } from './profile';
import { Observable } from 'rxjs/Observable';
import { EventService } from '../event/event.service';
import { Response } from '@angular/http';
import { ProfilesData, ProfileResponse } from './profile-response.interface';
import { I18nService } from '../i18n/i18n.service';
import { AccessTokenService } from '../http/access-token.service';
import * as _ from 'lodash';
import { ResourceService } from '../resource/resource.service';

@Injectable()
export class ProfileService extends ResourceService {
  protected API_URL = 'api/v3/users';
  protected _profile: Profile;

  constructor(http: HttpService,
              protected event: EventService,
              protected i18n: I18nService,
              protected accessTokenService: AccessTokenService) {
    super(http);
  }

  get profile(): Profile {
    return this._profile;
  }

  private getPaginationItems(url: string, init, status?): Observable<ProfilesData> {
    return this.http.get(url, {
        init: init,
        expired: status
      })
      .map((r: Response) => {
          const res: any[] = r.json();
          const nextPage: string = r.headers.get('x-nextpage');
          const params = _.chain(nextPage).split('&')
            .map(_.partial(_.split, _, '=', 2))
            .fromPairs()
            .value();
          const nextInit: number = nextPage ? +params.init : null;
          let data: Profile[] = [];
          if (res.length > 0) {
            data = res.map((i: any) => {
              return i;
            });
          }
          return {
            data: data,
            init: nextInit
          };
        }
      )
  }

  public myFavorites(init: number): Observable<ProfilesData> {
    return this.getPaginationItems(this.API_URL + '/me/users/favorites', init)
      .map((profilesData: ProfilesData) => {
        profilesData.data = profilesData.data.map((profile: Profile) => {
          profile.favorited = true;
          return profile;
        });
        return profilesData;
      });
  }

  public favoriteItem(id: string, favorited: boolean): Observable<any> {
    return this.http.put(this.API_URL + '/' + id + '/favorite', {
      favorited: favorited
    });
  }

  protected mapRecordData(data: ProfileResponse): Profile {
    return new Profile(
      data.id,
      data.item_images,
      data.micro_name,
      data.num_total_items,
      data.scoring_stars,
      data.user_image,
      data.favorited,
      data.isProfessional
    );
  }

}