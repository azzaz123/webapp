import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './user';
import { UserId } from './user-id';
import { UserUpdate } from './user-update';

export const USER_REPOSITORY_TOKEN: InjectionToken<UserRepository> = new InjectionToken<
  UserRepository
>('USER_REPOSITORY');

export interface UserRepository {
  getById(userId: UserId): Observable<User>;

  getMyProfile(): Observable<User>;

  updateEmail(emailAddress: string): Observable<void>;

  updatePassword(oldPassword: string, newPassword: string): Observable<void>;

  updateProfile(userEdit: Partial<UserUpdate>): Observable<User>;

  sendUserPresence(): Observable<void>;
}
