import { Injectable, isDevMode } from '@angular/core';
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

  public initializeBraze(): void {
    this.loadBraze()
      .then(() => {
        this.configureBraze();
      })
      .finally(() => {
        this._brazeReady$.next();
      });
  }

  private loadBraze(): Promise<void> {
    return import('@mparticle/web-appboy-kit');
  }

  private configureBraze(): void {
    appboy.initialize(environment.appboy, { enableHtmlInAppMessages: true, manageServiceWorkerExternally: true });
    if (isDevMode()) {
      appboy.toggleAppboyLogging();
    }
    appboy.display.automaticallyShowNewInAppMessages();
  }
}
