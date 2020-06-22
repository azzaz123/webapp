import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable, interval, Subscription, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { StarterResponse, GenerateSessionIdResponse, SessionProfileData, SessionProfileDataLocation } from './trust-and-safety.interface';

export const USER_STARTER_ENDPOINT = `${environment.baseUrl}api/v3/users/me/starter`;
export const GENERATE_SESSION_ID_ENDPOINT = `${environment.baseUrl}/api/v3/users/me/id`;

@Injectable({
  providedIn: 'root'
})
export class TrustAndSafetyService {
  private _sessionId: string;
  private _subscription: Subscription;
  private _cachedIsStarterResponse: StarterResponse;

  constructor(private http: HttpClient) {}

  private _initializeLibrary(session_id: string) {
    this._includeThreatMetrixInDOM(session_id);
    this._checkThreatMetrixReady();
  }

  private _includeThreatMetrixInDOM(session_id: string) {
    // TODO
  }

  private _checkThreatMetrixReady() {
    this._subscription = interval(1000).subscribe(() => {
      if (threadMetrixLibrary) {
        this._subscription.unsubscribe();
        this._startThreatMetrixProfiling();
      }
    });
  }

  private _startThreatMetrixProfiling() {
    // TODO
    // threadMetrixLibrary.profile();
  }

  private _getSessionId(): Observable<string> {
    return this.http.post<GenerateSessionIdResponse>(GENERATE_SESSION_ID_ENDPOINT, {}).pipe(map(response => response.id));
  }

  public initializeProfiling() {
    this.isUserStarter().subscribe(isStarter => {
      if (!isStarter) {
        return;
      }
      this._getSessionId().subscribe(sessionId => {
        this._sessionId = sessionId;
        this._initializeLibrary(sessionId);
      });
    });
  }

  public isUserStarter(useCache = true): Observable<boolean> {
    if (useCache && this._cachedIsStarterResponse) {
      return of(this._cachedIsStarterResponse).pipe(map(response => response.starter));
    }
    return this.http.get<StarterResponse>(USER_STARTER_ENDPOINT).pipe(
      tap(firstResponse => this._cachedIsStarterResponse = firstResponse),
      map(response => response.starter)
    );
  }

  public submitProfile(location: SessionProfileDataLocation) {
    if (!this._sessionId || !threadMetrixLibrary) {
      throw new Error('Session profiling error');
    }

    const profile: SessionProfileData = {
      id: this._sessionId,
      location,
      platform: 'Web'
    };

    return this.http.post(USER_STARTER_ENDPOINT, profile);
  }
}
