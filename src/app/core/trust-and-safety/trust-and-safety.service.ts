import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { interval, ReplaySubject } from 'rxjs';
import { SessionProfileData, SessionProfileDataLocation, SessionProfileDataPlatform, TMXStatusCode } from './trust-and-safety.interface';
import { THREAT_METRIX_EMBED } from './threat-metrix-embed-script';
import { ThreatMetrixLibrary } from './threat-metrix.interface';
import { take } from 'rxjs/operators';
import { UuidService } from '../uuid/uuid.service';

export const USER_STARTER_ENDPOINT = `${environment.baseUrl}api/v3/users/me/starter`;

@Injectable()
export class TrustAndSafetyService {
  public readonly SCRIPT_MAX_LOAD_TIME_SEC = 10;

  private threatMetrixRef: ThreatMetrixLibrary;
  private sessionId: string;
  private profileSentToThreatMetrix: ReplaySubject<boolean> = new ReplaySubject();

  constructor(private http: HttpClient, private uuidService: UuidService) {}

  private initializeSessionId(): void {
    if (this.sessionId) {
      return;
    }
    this.sessionId = this.uuidService.getUUID();
  }

  private initializeLibrary() {
    if (this.threatMetrixRef) {
      return;
    }
    this.includeThreatMetrixInDOM();
    this.checkThreatMetrixReady();
  }

  private includeThreatMetrixInDOM() {
    const coreScript = document.createElement('script');
    coreScript.setAttribute('type', 'text/javascript');
    coreScript.setAttribute('charset', 'utf-8');
    coreScript.text = THREAT_METRIX_EMBED;
    document.head.appendChild(coreScript);
  }

  private checkThreatMetrixReady() {
    const checkThreatMetrixInterval = interval(1000).subscribe(() => {
      if (wadgtlft) {
        checkThreatMetrixInterval.unsubscribe();
        this.threatMetrixRef = wadgtlft;
        this.startThreatMetrixProfiling();
      }
    });
  }

  private isThreatMetrixProfilingStarted() {
    return typeof window['tmx_profiling_started'] !== 'undefined' && window['tmx_profiling_started'];
  }

  private startThreatMetrixProfiling() {
    if (!this.sessionId || !this.threatMetrixRef) {
      throw new Error('Session profiling error');
    }
    this.threatMetrixRef.nfl(environment.threatMetrixProfilingDomain, environment.threatMetrixOrgId, this.sessionId);
    this.checkProfileSentToThreatMetrix();
  }

  private checkProfileSentToThreatMetrix() {
    const checkProfile = interval(1000).subscribe((seconds) => {
      if (seconds === this.SCRIPT_MAX_LOAD_TIME_SEC) {
        checkProfile.unsubscribe();
        this.profileSentToThreatMetrix.next(false);
      }

      if (this.canSubmitProfile()) {
        checkProfile.unsubscribe();
        this.profileSentToThreatMetrix.next(true);
      }
    });
  }

  private canSubmitProfile(): boolean {
    return this.sessionId && this.threatMetrixRef && this.isThreatMetrixProfilingStarted();
  }

  public submitProfile(location: SessionProfileDataLocation): void {
    this.initializeSessionId();
    this.initializeLibrary();

    const profile: SessionProfileData = {
      id: this.sessionId,
      location,
      platform: SessionProfileDataPlatform.WEB,
    };

    this.profileSentToThreatMetrix.pipe(take(1)).subscribe((profileSent) => {
      if (!profileSent) {
        profile.status = TMXStatusCode.TMX_INTERNAL_ERROR;
      }
      this.http.post(USER_STARTER_ENDPOINT, profile).subscribe();
    });
  }
}
