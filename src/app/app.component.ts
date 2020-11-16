import {
  mergeMap,
  map,
  filter,
  distinctUntilChanged,
  finalize,
} from 'rxjs/operators';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { configMoment } from './config/moment.config';
import {
  ActivatedRoute,
  NavigationEnd,
  NavigationStart,
  RouteConfigLoadEnd,
  RouteConfigLoadStart,
  Router,
} from '@angular/router';
import { environment } from '../environments/environment';
import { CookieOptions, CookieService } from 'ngx-cookie';
import { TrackingService } from './core/tracking/tracking.service';
import { EventService } from './core/event/event.service';
import { UserService } from './core/user/user.service';
import { DesktopNotificationsService } from './core/desktop-notifications/desktop-notifications.service';
import { MessageService } from './chat/service/message.service';
import { I18nService } from './core/i18n/i18n.service';
import { User } from './core/user/user';
import { ConnectionService } from './core/connection/connection.service';
import { CallsService } from './core/conversation/calls.service';
import { Item } from './core/item/item';
import { PaymentService } from './core/payments/payment.service';
import { RealTimeService } from './core/message/real-time.service';
import { InboxService } from './chat/service';
import { StripeService } from './core/stripe/stripe.service';
import { AnalyticsService } from './core/analytics/analytics.service';
import { DidomiService } from './core/didomi/didomi.service';
import { UuidService } from './core/uuid/uuid.service';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'tsl-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public hideSidebar: boolean;
  public isMyZone: boolean;
  public isProducts: boolean;
  public isProfile: boolean;
  private previousUrl: string;
  private currentUrl: string;
  private previousSlug: string;
  private sendPresenceInterval = 240000;

  constructor(
    private event: EventService,
    private realTime: RealTimeService,
    private inboxService: InboxService,
    public userService: UserService,
    private desktopNotificationsService: DesktopNotificationsService,
    private messageService: MessageService,
    private titleService: Title,
    private sanitizer: DomSanitizer,
    private trackingService: TrackingService,
    private i18n: I18nService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private renderer: Renderer2,
    private cookieService: CookieService,
    private connectionService: ConnectionService,
    private paymentService: PaymentService,
    private callService: CallsService,
    private stripeService: StripeService,
    private analyticsService: AnalyticsService,
    private uuidService: UuidService,
    private serviceWorker: SwUpdate,
    private didomiService: DidomiService
  ) {}

  ngOnInit() {
    this.initializeConfigs();
    this.initializeEventListeners();
    this.initializeServices();
    this.initializeRouterEventListeners();
    this.subscribeSWChanges();
  }

  private subscribeSWChanges() {
    console.log('changes!');
    this.serviceWorker.available.subscribe((event) => {
      console.warn('current version is', event.current);
      console.warn('available version is', event.available);
    });
    this.serviceWorker.activated.subscribe((event) => {
      console.warn('old version was', event.previous);
      console.warn('new version is', event.current);
    });
  }

  private initializeConfigs(): void {
    configMoment(this.i18n.locale);
  }

  private initializeServices(): void {
    this.didomiService.initialize();
    this.stripeService.init();
    this.analyticsService.initialize();
    this.initializeBraze();
    this.userService.checkUserStatus();
    this.desktopNotificationsService.init();
    this.connectionService.checkConnection();
  }

  // TODO: This should be encapsualted in a service (e.g.: BrazeService)
  private initializeBraze(): void {
    appboy.initialize(environment.appboy, { enableHtmlInAppMessages: true });
    // In app messages have been disabled until CLM fixes a problem with web communications
    // appboy.display.automaticallyShowNewInAppMessages();
    // appboy.registerAppboyPushMessages();
  }

  private initializeEventListeners(): void {
    this.subscribeEventUserLogin();
    this.subscribeEventUserLogout();
    this.subscribeChatEvents();
    this.subscribeEventItemUpdated();
  }

  private initializeRouterEventListeners(): void {
    this.updateUrlAndSendAnalytics();
    this.setTitle();
    this.setBodyClass();
  }

  private handleUserLoggedIn(user: User, accessToken: string): void {
    this.userService.sendUserPresenceInterval(this.sendPresenceInterval);
    this.initRealTimeChat(user, accessToken);
    appboy.changeUser(user.id);
    appboy.openSession();
    if (!this.cookieService.get('app_session_id')) {
      this.trackAppOpen();
      this.updateSessionCookie();
    }
  }

  private handleUserLoggedOut(redirectUrl: string): string | void {
    this.trackingService.track(TrackingService.MY_PROFILE_LOGGED_OUT);
    this.paymentService.deleteCache();

    try {
      this.realTime.disconnect();
    } catch (err) {}

    if (redirectUrl) {
      return (window.location.href = redirectUrl);
    }

    return window.location.reload();
  }

  public onViewIsBlocked(): void {
    this.renderer.addClass(document.body, 'blocked-page');
    this.renderer.addClass(document.body.parentElement, 'blocked-page');
  }

  private updateUrlAndSendAnalytics(): void {
    this.router.events
      .pipe(
        distinctUntilChanged((previous: any, current: any) => {
          if (current instanceof NavigationEnd) {
            this.previousUrl = previous.url;
            this.currentUrl = current.url;
            return previous.url === current.url;
          }
          return true;
        })
      )
      .subscribe((x: any) => {
        ga('set', 'page', x.url);
        ga('send', 'pageview');
      });
  }

  private updateSessionCookie(): void {
    const name = 'app_session_id';
    const token = this.uuidService.getUUID();
    const expiration = 900000;
    const expirationDate: Date = new Date();
    expirationDate.setTime(expirationDate.getTime() + expiration);
    const options: CookieOptions = {
      path: '/',
      expires: expirationDate,
    };
    this.cookieService.put(name, token, options);
  }

  private trackAppOpen(): void {
    this.trackingService.track(TrackingService.APP_OPEN, {
      referer_url: this.previousUrl,
      current_url: this.currentUrl,
    });
  }

  private subscribeEventUserLogin(): void {
    this.event.subscribe(EventService.USER_LOGIN, (accessToken: string) => {
      this.setLoading(true);
      this.userService
        .me()
        .pipe(finalize(() => this.setLoading(false)))
        .subscribe((user) => this.handleUserLoggedIn(user, accessToken));
    });
  }

  private initRealTimeChat(user: User, accessToken: string): void {
    this.event.subscribe(EventService.CHAT_RT_CONNECTED, () => {
      this.initCalls();
      this.inboxService.init();
    });
    this.realTime.connect(user.id, accessToken);
  }

  private initCalls(): void {
    this.userService.isProfessional().subscribe((isProfessional: boolean) => {
      if (isProfessional) {
        this.callService
          .init()
          .subscribe(() => this.callService.init(true).subscribe());
      }
    });
  }

  private subscribeEventUserLogout(): void {
    this.event.subscribe(EventService.USER_LOGOUT, (redirectUrl: string) =>
      this.handleUserLoggedOut(redirectUrl)
    );
  }

  private subscribeChatEvents(): void {
    this.event.subscribe(EventService.CHAT_RT_DISCONNECTED, () => {
      if (this.userService.isLogged && this.connectionService.isConnected) {
        this.realTime.reconnect();
      }
    });

    this.subscribeUnreadMessages();
  }

  private subscribeUnreadMessages(): void {
    this.messageService.totalUnreadMessages$.subscribe(
      (unreadMessages: number) => {
        let title: string = this.titleService.getTitle().split(') ')[1];
        title = title ? title : this.titleService.getTitle();
        if (unreadMessages > 0) {
          title = '(' + unreadMessages + ') ' + title;
        }
        this.titleService.setTitle(title);
      }
    );
  }

  private subscribeEventItemUpdated(): void {
    const syncItem = (item: Item) => {
      this.callService.syncItem(item);
    };
    this.event.subscribe(EventService.ITEM_UPDATED, syncItem);
    this.event.subscribe(EventService.ITEM_SOLD, syncItem);
    this.event.subscribe(EventService.ITEM_RESERVED, syncItem);
  }

  private setTitle(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter((route) => route.outlet === 'primary'),
        mergeMap((route) => route.data)
      )
      .subscribe((event) => {
        let notifications = '';
        const split: string[] = this.titleService.getTitle().split(' ');
        if (split.length > 1) {
          notifications = split[0].trim() + ' ';
        }
        const title = !event['title'] ? 'Wallapop' : event['title'];
        this.titleService.setTitle(notifications + title);
        this.hideSidebar = event['hideSidebar'];
        this.isMyZone = event['isMyZone'];
        this.isProducts = event['isProducts'];
        this.isProfile = event['isProfile'];
      });
  }

  private setBodyClass(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (this.previousSlug) {
          this.renderer.removeClass(document.body, this.previousSlug);
        }
        const currentUrlSlug = 'page-' + event.url.slice(1).replace(/\//g, '-');
        if (currentUrlSlug) {
          this.renderer.addClass(document.body, currentUrlSlug);
        }
        this.previousSlug = currentUrlSlug;
      }

      if (event instanceof RouteConfigLoadStart) {
        this.setLoading(true);
      } else if (event instanceof RouteConfigLoadEnd) {
        this.setLoading(false);
      }
    });
  }

  private setLoading(loading: boolean): void {
    loading
      ? this.renderer.addClass(document.body, 'route-loading')
      : this.renderer.removeClass(document.body, 'route-loading');
  }
}
