import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable, interval, Subscription, of, ReplaySubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {
  UserStarterResponse,
  SessionProfileData,
  SessionProfileDataLocation,
  SessionProfileDataPlatform
} from './trust-and-safety.interface';
import { UUID } from 'angular2-uuid';
import { THREAT_METRIX_EMBED } from './threat-metrix-embed-script';
import { ThreatMetrixLibrary } from './threat-metrix.interface';

export const USER_STARTER_ENDPOINT = `${environment.baseUrl}api/v3/users/me/starter`;

@Injectable({
  providedIn: 'root'
})
export class TrustAndSafetyService {
  private _threatMetrixRef: ThreatMetrixLibrary;
  private _sessionId: string;
  private _cachedIsStarterResponse: UserStarterResponse = null;
  private _profileSentToThreatMetrix: ReplaySubject<boolean> = new ReplaySubject();

  constructor(private http: HttpClient) {}

  private _initializeLibrary() {
    if (this._threatMetrixRef) {
      throw new Error('Session profiling error');
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

  private _isStarterUser(): Observable<boolean> {
    if (this._cachedIsStarterResponse) {
      return of(this._cachedIsStarterResponse.starter);
    }
    return this.http.get<UserStarterResponse>(USER_STARTER_ENDPOINT).pipe(
      tap(response => {
        if (!response.starter) {
          this._cachedIsStarterResponse = response;
        }
      }),
      map(response => response.starter)
    );
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

  public submitProfileIfNeeded(location: SessionProfileDataLocation): void {
    this._isStarterUser().subscribe(isStarter => {
      if (!isStarter) {
        return;
      }

      this._sessionId = UUID.UUID();
      this._initializeLibrary();

      const profile: SessionProfileData = {
        id: this._sessionId,
        location,
        platform: SessionProfileDataPlatform.WEB
      };

      const subscription = this._profileSentToThreatMetrix.subscribe(profileSent => {
        if (!profileSent) {
          return;
        }
        this.http.post(USER_STARTER_ENDPOINT, profile).subscribe();
        subscription.unsubscribe();
      });
    });
  }
}
