import { Injectable, isDevMode } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable, ReplaySubject } from 'rxjs';
import { UserService } from '@core/user/user.service';

@Injectable({
  providedIn: 'root',
})
export class ExternalCommsService {
  private readonly _brazeReady$: ReplaySubject<void> = new ReplaySubject<void>();

  constructor(private userService: UserService) {}

  public get brazeReady$(): Observable<void> {
    return this._brazeReady$.asObservable();
  }

  public initializeBraze(): void {
    if (appboy) {
      this.configureBraze();
      this.openBrazeSession();
      this._brazeReady$.next();
    }
  }

  public openBrazeSession(): void {
    if (this.userService.isLogged) {
      appboy.changeUser(this.userService.user.id);
    } else {
      appboy.openSession();
    }
  }

  private configureBraze(): void {
    appboy.initialize(environment.appboy, {
      enableHtmlInAppMessages: true,
      manageServiceWorkerExternally: true,
      enableLogging: isDevMode(),
    });
    appboy.display.automaticallyShowNewInAppMessages();
  }
}
