import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExternalCommsService {
  private readonly _brazeReady$: ReplaySubject<void> = new ReplaySubject<void>();

  public get brazeReady$(): Observable<void> {
    return this._brazeReady$.asObservable();
  }

  public initializeBrazeCommunications(): void {
    this.loadBrazeLibraryDynamically()
      .then(() => {
        this.initializeBrazeConfiguration();
        this.showBrazeInappMessages();
      })
      .finally(() => {
        this._brazeReady$.next();
      });
  }

  private loadBrazeLibraryDynamically(): Promise<void> {
    return import('@mparticle/web-appboy-kit');
  }

  private initializeBrazeConfiguration(): void {
    appboy.initialize(environment.appboy, { enableHtmlInAppMessages: true });
  }

  private showBrazeInappMessages(): void {
    appboy.display.automaticallyShowNewInAppMessages();
  }
}
