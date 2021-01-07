import { UserId } from '../../shared/domain/user-id';
import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './user';

export const USER_REPOSITORY_TOKEN: InjectionToken<UserRepository> = new InjectionToken<
  UserRepository
>('USER_REPOSITORY');

export interface UserRepository {
  getById(userId: UserId): Observable<User>;

  getMyProfile(): Observable<User>;

  updateEmail(emailAddress: string): Observable<void>;

  updatePassword(oldPassword: string, newPassword: string): Observable<void>;

  sendUserPresence(): Observable<void>;
}
