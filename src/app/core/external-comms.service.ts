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
    this.configureBraze();
    this.openBrazeSession();
    this._brazeReady$.next();
    this._brazeReady$.complete();
  }

  public openBrazeSession(): void {
    if (this.userService.isLogged) {
      appboy.changeUser(this.userService.user.id);
    }
    appboy.openSession();
  }

  private configureBraze(): void {
    if (isDevMode()) {
      appboy.toggleAppboyLogging();
    }
    appboy.initialize(environment.appboy, {
      manageServiceWorkerExternally: true,
    });
  }
}
