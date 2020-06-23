import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable, interval, Subscription, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { StarterResponse, SessionProfileData, SessionProfileDataLocation, SessionProfileDataPlatform } from './trust-and-safety.interface';
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
  private _subscription: Subscription;
  private _cachedIsStarterResponse: StarterResponse;

  constructor(private http: HttpClient) {}

  private _initializeLibrary() {
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
    this._subscription = interval(1000).subscribe(() => {
      if (wadgtlft) {
        this._threatMetrixRef = wadgtlft;
        this._subscription.unsubscribe();
        this._startThreatMetrixProfiling();
      }
    });
  }

  private _startThreatMetrixProfiling() {
    if (!this._sessionId || !this._threatMetrixRef) {
      throw new Error('Session profiling error');
    }
    this._threatMetrixRef.asap('h.online-metrix.net', environment.threatMetrixOrgId, this._sessionId);
  }

  public isStarterUser(useCache = true): Observable<boolean> {
    if (useCache && this._cachedIsStarterResponse) {
      return of(this._cachedIsStarterResponse).pipe(map(response => response.starter));
    }
    return this.http.get<StarterResponse>(USER_STARTER_ENDPOINT).pipe(
      tap(firstResponse => this._cachedIsStarterResponse = firstResponse),
      map(response => response.starter)
    );
  }

  public initializeProfiling() {
    this.isStarterUser(false).subscribe(isStarter => {
      if (!isStarter) {
        return;
      }
      this._sessionId = UUID.UUID();
      this._initializeLibrary();
    });
  }

  public submitProfile(location: SessionProfileDataLocation) {
    if (!this._sessionId || !this._threatMetrixRef) {
      throw new Error('Session profiling error');
    }

    const profile: SessionProfileData = {
      id: this._sessionId,
      location,
      platform: SessionProfileDataPlatform.Web
    };

    return this.http.post(USER_STARTER_ENDPOINT, profile);
  }
}
