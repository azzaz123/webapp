import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { UserPhoneMethod } from './user-phone';

export const USER_PHONE_REPOSITORY_TOKEN: InjectionToken<UserPhoneRepository> = new InjectionToken<
  UserPhoneRepository
>('USER_PHONE_REPOSITORY');

export interface UserPhoneRepository {
  getMethod(): Observable<UserPhoneMethod>;
}
