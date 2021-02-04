import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { UserLocation } from './location';
import { Profile } from './profile/profile';
import { UserId } from './profile/user-id';
import { UserUpdate } from './profile/user-update';

export const USER_REPOSITORY_TOKEN: InjectionToken<UserRepository> = new InjectionToken<UserRepository>('USER_REPOSITORY');

export interface UserRepository {
  getById(userId: UserId): Observable<[Profile, UserLocation]>;

  getMyProfile(): Observable<[Profile, UserLocation]>;

  updateEmail(emailAddress: string): Observable<void>;

  updatePassword(oldPassword: string, newPassword: string): Observable<void>;

  updateProfile(userEdit: Partial<UserUpdate>): Observable<Profile>;

  sendUserPresence(): Observable<void>;
}
