import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import {
  IsFavouriteBodyResponse,
  MarkAsFavouriteBodyRequest,
} from '@public/core/interfaces/public-profile-request.interface';

export const PROFILE_API_URL = 'api/v3/users/';
export const FAVOURITE_API_PATH = 'favorite';

@Injectable({
  providedIn: 'root',
})
export class PublicProfileService {
  constructor(private http: HttpClient) {}

  public isFavourite(userId: string): Observable<boolean> {
    return this.http
      .get(
        `${environment.baseUrl}${PROFILE_API_URL}${userId}/${FAVOURITE_API_PATH}`
      )
      .pipe(
        map((isFavouriteResponse: IsFavouriteBodyResponse) => {
          return isFavouriteResponse.favorited;
        })
      );
  }

  public markAsFavourite(userId: string): Observable<any> {
    return this.http.put(
      `${environment.baseUrl}${PROFILE_API_URL}${userId}/${FAVOURITE_API_PATH}`,
      { favorited: true } as MarkAsFavouriteBodyRequest
    );
  }

  public unmarkAsFavourite(userId: string): Observable<any> {
    return this.http.put(
      `${environment.baseUrl}${PROFILE_API_URL}${userId}/${FAVOURITE_API_PATH}`,
      { favorited: false } as MarkAsFavouriteBodyRequest
    );
  }
}
