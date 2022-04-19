import { InjectionToken } from '@angular/core';

export const LOCAL_STORAGE_TOKEN: InjectionToken<Storage> = new InjectionToken<Storage>('LOCAL_STORAGE_TOKEN', {
  providedIn: 'root',
  factory: () => window.localStorage,
});
