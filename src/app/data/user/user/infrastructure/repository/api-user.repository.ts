
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../domain/user';
import { UserUpdate } from '../../domain/user-update';
import { UserRepository } from '../../domain/user.repository';

@Injectable()
export class ApiUserRepository implements UserRepository {

  private static USER_BASE_ENDPOINT = 'api/v3/users';

  constructor(private http: HttpClient) {}

  getById(userId: string): Observable<User> {
    return this.http.get<User>(`${ApiUserRepository.USER_BASE_ENDPOINT}/${userId}`);
  }

  getMyProfile(): Observable<User> {
    return this.http.get<User>(`${ApiUserRepository.USER_BASE_ENDPOINT}/me`);
  }

  updateEmail(email_address: string): Observable<void> {
    return this.http.post<void>(`${ApiUserRepository.USER_BASE_ENDPOINT}/email`, {email_address});
  }

  updatePassword(old_password: string, new_password: string): Observable<void> {
    return this.http.post<void>(`${ApiUserRepository.USER_BASE_ENDPOINT}/password`, {old_password, new_password});
  }

  updateProfile(userEdit: Partial<UserUpdate>): Observable<User> {
    return this.http.post<User>(`${ApiUserRepository.USER_BASE_ENDPOINT}/me`, userEdit);
  }

  sendUserPresence(): Observable<void> {
    return this.http.post<void>(`${ApiUserRepository.USER_BASE_ENDPOINT}/online`, null);
  }

}
