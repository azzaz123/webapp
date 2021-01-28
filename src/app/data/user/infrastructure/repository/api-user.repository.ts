import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Profile, UserLocation, UserRepository, UserUpdate } from '../../domain';
import { USER_BASE_ENDPOINT } from './api-user.constant';
import { ApiUserLocationMapper, ApiUserMapper } from './api-user.mapper';
import { ApiUserResponse } from './api-user.response';

@Injectable()
export class ApiUserRepository implements UserRepository {

  static USER_PROFILE_URL = `${USER_BASE_ENDPOINT}me`;
  static UPDATE_EMAIL_URL = `${USER_BASE_ENDPOINT}email`;
  static UPDATE_PASSWORD_URL = `${USER_BASE_ENDPOINT}password`;
  static PRESENCE_ONLINE_URL = `${USER_BASE_ENDPOINT}online`;

  constructor(private http: HttpClient) { }

  getById(userId: string): Observable<[Profile, UserLocation]> {
    return this.http.get<ApiUserResponse>(`${USER_BASE_ENDPOINT}/${userId}`)
      .pipe(
        map((apiUser: ApiUserResponse) => ([ApiUserMapper.toDomain(apiUser), ApiUserLocationMapper.toDomain(apiUser)]))
      );
  }

  getMyProfile(): Observable<[Profile, UserLocation]> {
    return this.http.get<ApiUserResponse>(ApiUserRepository.USER_PROFILE_URL).pipe(
      map((apiUser: ApiUserResponse) => ([ApiUserMapper.toDomain(apiUser), ApiUserLocationMapper.toDomain(apiUser)]))
    );
  }

  updateEmail(email_address: string): Observable<void> {
    return this.http.post<void>(ApiUserRepository.UPDATE_EMAIL_URL, { email_address });
  }

  updatePassword(old_password: string, new_password: string): Observable<void> {
    return this.http.post<void>(ApiUserRepository.UPDATE_PASSWORD_URL, { old_password, new_password });
  }

  updateProfile(userEdit: Partial<UserUpdate>): Observable<Profile> {
    return this.http.post<Profile>(ApiUserRepository.USER_PROFILE_URL, userEdit);
  }

  sendUserPresence(): Observable<void> {
    return this.http.post<void>(ApiUserRepository.PRESENCE_ONLINE_URL, null);
  }
}
