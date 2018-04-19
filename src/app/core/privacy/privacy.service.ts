import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpService } from '../http/http.service';
import {
  PrivacyPermissionRequestData,
  PrivacyPermissions,
  PRIVACY_PERMISSION_STATUS,
  PrivacyPermission
} from './privacy-permission.interface';

@Injectable()
export class PrivacyService {

  protected API_URL = 'api/v3/privacy';
  private _privacyPermissions: PrivacyPermissions;

  constructor(
    private http: HttpService
  ) { }

  public updatePrivacyPermission(data: PrivacyPermissionRequestData) {
    return this.http.post(this.API_URL, data)
      .map((r: Response) => r.json());
  }

  public getPrivacyPermissions() {
    return this.http.get(this.API_URL)
      .map((r: Response) => r.json());
  }

  getPrivacyPermissionState(permissionName: string, version: string) {
    if (!this._privacyPermissions ||
      !this._privacyPermissions[permissionName] ||
      !this._privacyPermissions[permissionName].length) {
      return PRIVACY_PERMISSION_STATUS.unknown;
    } else {
      for (const key in this._privacyPermissions[permissionName]) {
        if (this._privacyPermissions[permissionName].hasOwnProperty(key)) {
          const permission: PrivacyPermission = this._privacyPermissions[permissionName][key][version]
          if (!permission) {
            return PRIVACY_PERMISSION_STATUS.unknown;
          }
          return permission.allow ? PRIVACY_PERMISSION_STATUS.allow : PRIVACY_PERMISSION_STATUS.disallow;
        }
      }
    }
  }

}
