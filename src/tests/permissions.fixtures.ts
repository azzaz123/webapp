import { PERMISSIONS } from '@core/user/user-constants';
import { NgxPermissionsObject } from 'ngx-permissions';
import { Observable } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';

export class MockPermissionsService {
  addPermission() {}
  removePermission() {}
  flushPermissions() {}
  hasPermission() {}
  getPermission() {}
  get permissions$(): Observable<NgxPermissionsObject> {
    return of(MOCK_PERMISSIONS);
  }
}

export const MOCK_PERMISSIONS: NgxPermissionsObject = {
  [PERMISSIONS.bumps]: { name: PERMISSIONS.bumps },
  [PERMISSIONS.subscriptions]: { name: PERMISSIONS.subscriptions },
};
