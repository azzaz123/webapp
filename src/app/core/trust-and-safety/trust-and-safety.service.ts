import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { interval, ReplaySubject } from 'rxjs';
import {
  SessionProfileData,
  SessionProfileDataLocation,
  SessionProfileDataPlatform
} from './trust-and-safety.interface';
import { v4 as UUID } from 'uuid';
import { THREAT_METRIX_EMBED } from './threat-metrix-embed-script';
import { ThreatMetrixLibrary } from './threat-metrix.interface';
import { take } from 'rxjs/operators';

export const USER_STARTER_ENDPOINT = `${environment.baseUrl}api/v3/users/me/starter`;

@Injectable({
  providedIn: 'root'
})
export class TrustAndSafetyService {
  private _threatMetrixRef: ThreatMetrixLibrary;
  private _sessionId: string;
  private _profileSentToThreatMetrix: ReplaySubject<boolean> = new ReplaySubject();

  constructor(private http: HttpClient) {}

  private _initializeSessionId(): void {
    if (this._sessionId) {
      return;
    }
    this._sessionId = UUID();
  }

  private _initializeLibrary() {
    if (this._threatMetrixRef) {
      return;
    }
    this._includeThreatMetrixInDOM();
    this._checkThreatMetrixReady();
  }

  private _includeThreatMetrixInDOM() {
    const coreScript = document.createElement('script');
    coreScript.setAttribute('type', 'text/javascript');
    coreScript.setAttribute('charset', 'utf-8');
    coreScript.text = THREAT_METRIX_EMBED;
    document.head.appendChild(coreScript);
  }

  private _checkThreatMetrixReady() {
    const checkThreatMetrixInterval = interval(1000).subscribe(() => {
      if (wadgtlft) {
        checkThreatMetrixInterval.unsubscribe();
        this._threatMetrixRef = wadgtlft;
        this._startThreatMetrixProfiling();
      }
    });
  }

  private _isThreatMetrixProfilingStarted() {
    return typeof window['tmx_profiling_started'] !== 'undefined' && window['tmx_profiling_started'];
  }

  private _startThreatMetrixProfiling() {
    if (!this._sessionId || !this._threatMetrixRef) {
      throw new Error('Session profiling error');
    }
    this._threatMetrixRef.nfl(environment.threatMetrixProfilingDomain, environment.threatMetrixOrgId, this._sessionId);
    this._checkProfileSentToThreatMetrix();
  }

  private _checkProfileSentToThreatMetrix() {
    const checkProfile = interval(1000).subscribe(() => {
      if (this._canSubmitProfile()) {
        checkProfile.unsubscribe();
        this._profileSentToThreatMetrix.next(true);
      }
    });
  }

  private _canSubmitProfile(): boolean {
    return this._sessionId && this._threatMetrixRef && this._isThreatMetrixProfilingStarted();
  }

  public submitProfile(location: SessionProfileDataLocation): void {
    this._initializeSessionId();
    this._initializeLibrary();

    const profile: SessionProfileData = {
      id: this._sessionId,
      location,
      platform: SessionProfileDataPlatform.WEB
    };

    this._profileSentToThreatMetrix
      .pipe(take(1))
      .subscribe(profileSent => {
        if (!profileSent) {
          return;
        }
        this.http.post(USER_STARTER_ENDPOINT, profile).subscribe();
      });
  }
}
