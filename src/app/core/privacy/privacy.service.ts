import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpService } from '../http/http.service';
import {
  PrivacyRequestData,
  PrivacyList,
  PrivacyVersionItem
} from './privacy.interface';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

export const PRIVACY_STATUS = {
  allow: 'allow',
  disallow: 'disallow',
  unknown: 'unknown'
};

@Injectable()
export class PrivacyService {

  private API_URL = 'api/v3/privacy';
  private _privacyList: PrivacyList;
  public allowSegmentation$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  constructor(
    private http: HttpService
  ) { }

  public updatePrivacy(data: PrivacyRequestData) {
    return this.http.post(this.API_URL, data)
      .map((r: Response) => r.json())
      .map((privacyList: PrivacyList) => this._mapPrivacyList(privacyList));
  }

  public getPrivacyList() {
    return this.http.get(this.API_URL)
      .map((r: Response) => r.json())
      .map((privacyList: PrivacyList) => this._mapPrivacyList(privacyList));
  }

  private _mapPrivacyList(privacyList: PrivacyList): PrivacyList {
    this._privacyList = privacyList;

    const segmentationStatus = this.getPrivacyState('gdpr_display', '0');
    this.allowSegmentation$.next(segmentationStatus === PRIVACY_STATUS.allow ? true : false);

    return privacyList;
  }

  public getPrivacyState(permissionName: string, version: string): string {
    if (!this._privacyList ||
      !this._privacyList[permissionName] ||
      !this._privacyList[permissionName].length) {
      return PRIVACY_STATUS.unknown;
    } else {
      for (const key in this._privacyList[permissionName]) {
        if (this._privacyList[permissionName].hasOwnProperty(key)) {
          const permission: PrivacyVersionItem = this._privacyList[permissionName][key];
          if (permission && permission.version === version && permission.modified_date) {
            return permission.allow ? PRIVACY_STATUS.allow : PRIVACY_STATUS.disallow;
          }
        }
      }
    }
    return PRIVACY_STATUS.unknown;
  }

}
