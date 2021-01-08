import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../domain/user';
import { UserUpdate } from '../../domain/user-update';
import { UserRepository } from '../../domain/user.repository';

@Injectable()
export class ApiUserRepository implements UserRepository {
  static USER_BASE_ENDPOINT = 'api/v3/users';
  static USER_PROFILE_URL = `${ApiUserRepository.USER_BASE_ENDPOINT}/me`;
  static UPDATE_EMAIL_URL =  `${ApiUserRepository.USER_BASE_ENDPOINT}/email`;
  static UPDATE_PASSWORD_URL = `${ApiUserRepository.USER_BASE_ENDPOINT}/password`;
  static PRESENCE_ONLINE_URL = `${ApiUserRepository.USER_BASE_ENDPOINT}/online`



  constructor(private http: HttpClient) {}

  getById(userId: string): Observable<User> {
    return this.http.get<User>(
      `${ApiUserRepository.USER_BASE_ENDPOINT}/${userId}`
    );
  }

  getMyProfile(): Observable<User> {
    return this.http.get<User>(ApiUserRepository.USER_PROFILE_URL);
  }

  updateEmail(email_address: string): Observable<void> {
    return this.http.post<void>(    ApiUserRepository.UPDATE_EMAIL_URL,{ email_address });
  }

  updatePassword(old_password: string, new_password: string): Observable<void> {
    return this.http.post<void>(ApiUserRepository.UPDATE_PASSWORD_URL,{ old_password, new_password });
  }

  updateProfile(userEdit: Partial<UserUpdate>): Observable<User> {
    return this.http.post<User>(ApiUserRepository.USER_PROFILE_URL,userEdit);
  }

  sendUserPresence(): Observable<void> {
    return this.http.post<void>(ApiUserRepository.PRESENCE_ONLINE_URL,null);
  }
}
