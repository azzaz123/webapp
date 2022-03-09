import { Injectable } from '@angular/core';
import { User } from '@core/user/user';
import { DEFAULT_PERMISSIONS, PERMISSIONS } from '@core/user/user-constants';
import { USER_TYPE } from '@core/user/user.service';
import { NgxPermissionsService } from 'ngx-permissions';

@Injectable({ providedIn: 'root' })
export class PermissionsInitializerService {
  constructor(private permissionService: NgxPermissionsService) {}

  public setDefaultPermissions(): void {
    this.permissionService.addPermission(DEFAULT_PERMISSIONS);
  }

  public setUserPermissions(user: User): void {
    user.featured && user.type !== USER_TYPE.PROFESSIONAL
      ? this.permissionService.addPermission(PERMISSIONS[USER_TYPE.FEATURED])
      : this.permissionService.addPermission(PERMISSIONS[user.type]);
  }
}
