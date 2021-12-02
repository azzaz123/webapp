import { Observable, of } from 'rxjs';

import { map, share } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Profile } from './profile';
import { EventService } from '../event/event.service';
import { ProfileResponse, ProfilesData } from './profile-response.interface';
import { I18nService } from '../i18n/i18n.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Model } from '../resource/model.interface';
import { environment } from '../../../environments/environment';

@Injectable()
export class ProfileService {
  private readonly API_URL = 'api/v3/users';

  private _profile: Profile;

  private store: any = {};
  private observables: any = {};

  constructor(private httpClient: HttpClient, protected event: EventService, protected i18n: I18nService) {}

  get profile(): Profile {
    return this._profile;
  }

  public get(id: string, noCache?: boolean): Observable<Profile> {
    if (this.store[id] && !noCache) {
      return of(this.store[id]);
    } else if (this.observables[id]) {
      return this.observables[id];
    } else {
      this.observables[id] = this.httpClient.get<ProfileResponse>(`${environment.baseUrl}${this.API_URL}/${id}`).pipe(
        map((resp: ProfileResponse) => (resp.id ? this.mapRecordData(resp) : null)),
        map((model: Model) => this.addToStore(model, id)),
        share()
      );
      return this.observables[id];
    }
  }

  public myFavorites(init: number): Observable<ProfilesData> {
    return this.getPaginationItems(`${environment.baseUrl}${this.API_URL}/me/users/favorites`, init).pipe(
      map((profilesData: ProfilesData) => {
        profilesData.data = profilesData.data.map((profile: Profile) => {
          profile.favorited = true;
          return profile;
        });
        return profilesData;
      })
    );
  }

  public favoriteItem(id: string, favorited: boolean): Observable<any> {
    return this.httpClient.put(`${environment.baseUrl}${this.API_URL}/${id}/favorite`, {
      favorited: favorited,
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
      data.is_professional,
      data.screen_name
    );
  }

  private addToStore(model: Model, id: string): Model {
    if (model) {
      this.store[id] = model;
    }
    delete this.observables[id];
    return model;
  }

  private getPaginationItems(url: string, init: number): Observable<ProfilesData> {
    return this.httpClient
      .get(url, {
        observe: 'response',
        params: {
          init: init.toString(),
        },
      })
      .pipe(
        map((resp: HttpResponse<any[]>) => {
          const nextPage: string = resp.headers.get('x-nextpage');
          const params = {};
          if (nextPage) {
            nextPage.split('&').forEach((paramSplit) => {
              const paramValues = paramSplit.split('=');
              params[paramValues[0]] = paramValues[1];
            });
          }

          const nextInit = params && params['init'] ? +params['init'] : null;
          let data: Profile[] = [];
          if (resp.body.length > 0) {
            data = resp.body.map((i: any) => {
              return i;
            });
          }
          return {
            data: data,
            init: nextInit,
          };
        })
      );
  }
}
