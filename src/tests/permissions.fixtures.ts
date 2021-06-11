import { PERMISSIONS } from '@core/user/user-constants';
import { NgxPermissionsObject } from 'ngx-permissions';
import { Observable } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';

export class MockPermissionsService {
  addPermission() {}
  removePermission() {}
  flushPermissions() {}
  hasPermission() {}
  get permissions$(): Observable<NgxPermissionsObject> {
    return of({});
  }
}

export const MOCK_PERMISSIONS: NgxPermissionsObject = { [PERMISSIONS.bumps]: { name: PERMISSIONS.bumps } };
