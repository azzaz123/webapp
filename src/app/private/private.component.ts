import { Component, Inject, LOCALE_ID, OnInit, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, NavigationStart, RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router';
import { InboxService } from '@private/features/chat/core/inbox/inbox.service';
import * as moment from 'moment';
import { CookieOptions, CookieService } from 'ngx-cookie';
import { distinctUntilChanged, filter, map, mergeMap } from 'rxjs/operators';
import { ConnectionService } from '@core/connection/connection.service';
import { CallsService } from '@core/conversation/calls.service';
import { DesktopNotificationsService } from '@core/desktop-notifications/desktop-notifications.service';
import { EventService } from '@core/event/event.service';
import { Item } from '@core/item/item';
import { RealTimeService } from '@core/message/real-time.service';
import { PaymentService } from '@core/payments/payment.service';
import { StripeService } from '@core/stripe/stripe.service';
import { User } from '@core/user/user';
import { UserService } from '@core/user/user.service';
import { UuidService } from '@core/uuid/uuid.service';
import { APP_LOCALE } from '@configs/subdomains.config';

@Component({
  selector: 'tsl-private',
  templateUrl: './private.component.html',
  styleUrls: ['./private.component.scss'],
})
export class PrivateComponent implements OnInit {
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
    private titleService: Title,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private renderer: Renderer2,
    private cookieService: CookieService,
    private connectionService: ConnectionService,
    private paymentService: PaymentService,
    private callService: CallsService,
    private stripeService: StripeService,
    private uuidService: UuidService,
    @Inject(LOCALE_ID) private locale: APP_LOCALE
  ) {}

  ngOnInit() {
    this.initializeConfigs();
    this.initializeEventListeners();
    this.initializeServices();
    this.initializeRouterEventListeners();
  }

  public onViewIsBlocked(): void {
    this.renderer.addClass(document.body, 'blocked-page');
    this.renderer.addClass(document.body.parentElement, 'blocked-page');
  }

  private initializeConfigs(): void {
    this.setMomentLocale();
  }

  private setMomentLocale(): void {
    moment.locale(this.locale);
  }

  private initializeServices(): void {
    this.stripeService.init();
    this.userService.checkUserStatus();
    this.desktopNotificationsService.init();
    this.connectionService.checkConnection();
  }

  private initializeEventListeners(): void {
    this.subscribeEventUserLogin();
    this.subscribeEventUserLogout();
    this.subscribeChatEvents();
    this.subscribeEventItemUpdated();
  }

  private initializeRouterEventListeners(): void {
    this.setTitle();
    this.setBodyClass();
  }

  private handleUserLoggedIn(user: User, accessToken: string): void {
    this.userService.sendUserPresenceInterval(this.sendPresenceInterval);
    this.initRealTimeChat(user, accessToken);
    if (!this.cookieService.get('app_session_id')) {
      this.updateSessionCookie();
    }
  }

  private handleUserLoggedOut(redirectUrl: string): string | void {
    this.paymentService.deleteCache();

    try {
      this.realTime.disconnect();
    } catch (err) {}

    if (redirectUrl) {
      return (window.location.href = redirectUrl);
    }

    return window.location.reload();
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

  private subscribeEventUserLogin(): void {
    this.event.subscribe(EventService.USER_LOGIN, (accessToken: string) => {
      const user = this.userService.user;

      this.handleUserLoggedIn(user, accessToken);
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
        this.callService.init().subscribe(() => this.callService.init(true).subscribe());
      }
    });
  }

  private subscribeEventUserLogout(): void {
    this.event.subscribe(EventService.USER_LOGOUT, (redirectUrl: string) => this.handleUserLoggedOut(redirectUrl));
  }

  private subscribeChatEvents(): void {
    this.event.subscribe(EventService.CHAT_RT_DISCONNECTED, () => {
      if (this.userService.isLogged && this.connectionService.isConnected) {
        this.realTime.reconnect();
      }
    });
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
    loading ? this.renderer.addClass(document.body, 'route-loading') : this.renderer.removeClass(document.body, 'route-loading');
  }
}
