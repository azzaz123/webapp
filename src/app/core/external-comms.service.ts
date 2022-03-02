import { Injectable, isDevMode } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable, ReplaySubject } from 'rxjs';
import { UserService } from '@core/user/user.service';
import { NotificationApiService } from '@api/notification/notification-api.service';

@Injectable({
  providedIn: 'root',
})
export class ExternalCommsService {
  private readonly _brazeReady$: ReplaySubject<void> = new ReplaySubject<void>();

  constructor(private userService: UserService, public notificationApiService: NotificationApiService) {}

  public get brazeReady$(): Observable<void> {
    return this._brazeReady$.asObservable();
  }

  public initializeBraze(): void {
    this.configureBraze();
    this.openBrazeSession();
    this._brazeReady$.next();
  }

  public openBrazeSession(): void {
    if (this.userService.isLogged) {
      appboy.changeUser(this.userService.user.id);
    }
    appboy.openSession();

    this.notificationApiService.refreshUnreadNotifications();

    //TODO listen for changes in notifications and refresh
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
