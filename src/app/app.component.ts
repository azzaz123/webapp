import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { DOCUMENT, DomSanitizer, Title } from '@angular/platform-browser';
import { configMoment } from './config/moment.config';
import { configIcons } from './config/icons.config';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/takeWhile';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/filter';
import { MatIconRegistry } from '@angular/material';
import { ConversationService } from './core/conversation/conversation.service';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { environment } from '../environments/environment';
import { CookieOptions, CookieService } from 'ngx-cookie';
import { UUID } from 'angular2-uuid';
import { TrackingService } from './core/tracking/tracking.service';
import { EventService } from './core/event/event.service';
import { UserService } from './core/user/user.service';
import { ErrorsService } from './core/errors/errors.service';
import { NotificationService } from './core/notification/notification.service';
import { MessageService } from './core/message/message.service';
import { I18nService } from './core/i18n/i18n.service';
import { WindowRef } from './core/window/window.service';
import { User } from './core/user/user';
import { Message } from './core/message/message';
import { DebugService } from './core/debug/debug.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConnectionService } from './core/connection/connection.service';
import { CallsService } from './core/conversation/calls.service';
import { Item } from './core/item/item';
import { PaymentService } from './core/payments/payment.service';
import { RealTimeService } from './core/message/real-time.service';
import { ChatSignal } from './core/message/chat-signal.interface';
import { InboxService } from './core/inbox/inbox.service';
import { Subscription, Observable } from 'rxjs';
import { SplitTestService } from './core/tracking/split-test.service';
import { StripeService } from './core/stripe/stripe.service';

@Component({
  selector: 'tsl-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public loggingOut: boolean;
  public hideSidebar: boolean;
  public isMyZone: boolean;
  public isProducts: boolean;
  public isProfile: boolean;
  private previousUrl: string;
  private currentUrl: string;
  private previousSlug: string;
  private sendPresenceInterval = 240000;
  private RTConnectedSubscription: Subscription;

  constructor(private event: EventService,
              private realTime: RealTimeService,
              private inboxService: InboxService,
              public userService: UserService,
              private errorsService: ErrorsService,
              private notificationService: NotificationService,
              private messageService: MessageService,
              private titleService: Title,
              private sanitizer: DomSanitizer,
              private matIconRegistry: MatIconRegistry,
              private trackingService: TrackingService,
              private i18n: I18nService,
              private conversationService: ConversationService,
              private winRef: WindowRef,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private debugService: DebugService,
              private renderer: Renderer2,
              @Inject(DOCUMENT) private document: Document,
              private cookieService: CookieService,
              private modalService: NgbModal,
              private connectionService: ConnectionService,
              private paymentService: PaymentService,
              private callService: CallsService,
              private splitTestService: SplitTestService,
              private stripeService: StripeService ) {
    this.config();
  }

  ngOnInit() {
    this.stripeService.init();
    appboy.initialize(environment.appboy, {enableHtmlInAppMessages: true});
    appboy.display.automaticallyShowNewInAppMessages();
    appboy.registerAppboyPushMessages();
    this.splitTestService.init();
    this.subscribeEventUserLogin();
    this.subscribeEventUserLogout();
    this.subscribeChatEvents();
    this.subscribeEventItemUpdated();
    this.userService.checkUserStatus();
    this.notificationService.init();
    this.setTitle();
    this.setBodyClass();
    this.updateUrlAndSendAnalytics();
    this.connectionService.checkConnection();
    this.conversationService.firstLoad = true;
    this.trackingService.trackAccumulatedEvents();

    __cmp('init', quancastOptions[this.i18n.locale]);
  }

  private updateUrlAndSendAnalytics() {
    this.router.events.distinctUntilChanged((previous: any, current: any) => {
      if (current instanceof NavigationEnd) {
        this.previousUrl = previous.url;
        this.currentUrl = current.url;
        return previous.url === current.url;
      }
      return true;
    }).subscribe((x: any) => {
      ga('set', 'page', x.url);
      ga('send', 'pageview');
    });
  }

  private config() {
    configMoment(this.i18n.locale);
    configIcons(this.matIconRegistry, this.sanitizer);
  }

  private updateSessionCookie() {
    const uuid: string = UUID.UUID();
    this.setCookie('app_session_id', uuid, 900000);
  }

  private setCookie(name: string, token: string, expiration: number) {
    const expirationDate: Date = new Date();
    expirationDate.setTime(expirationDate.getTime() + expiration);
    const options: CookieOptions = {
      path: '/',
      expires: expirationDate
    };
    this.cookieService.put(name, token, options);
  }

  private trackAppOpen() {
    this.trackingService.track(TrackingService.APP_OPEN, { referer_url: this.previousUrl, current_url: this.currentUrl });
  }

  private subscribeEventUserLogin() {
    this.event.subscribe(EventService.USER_LOGIN, (accessToken: string) => {
      this.userService.me().subscribe(
        (user: User) => {
          this.userService.sendUserPresenceInterval(this.sendPresenceInterval);
          this.initRealTimeChat(user, accessToken);
          appboy.changeUser(user.id);
          appboy.openSession();
          this.splitTestService.identify({
            user_id: user.id || null,
            email: user.email || null,
            gender: user.gender || null
          });
          if (!this.cookieService.get('app_session_id')) {
            this.trackAppOpen();
            this.updateSessionCookie();
          }
        },
        (error: any) => {
          this.userService.logout();
          this.errorsService.show(error, true);
        });
    });
  }

  private initRealTimeChat(user: User, accessToken: string) {
    this.event.subscribe(EventService.DB_READY, (dbName) => {
      if (!dbName) {
        this.RTConnectedSubscription = this.event.subscribe(EventService.CHAT_RT_CONNECTED, () => {
          this.inboxService.getInboxFeatureFlag$()
          .catch(() => Observable.of(false))
          .subscribe((active) => {
            if (active) {
              this.initCalls();
            }
            active ? this.inboxService.init() : this.initOldChat();
          });
        });
        this.realTime.connect(user.id, accessToken);
      }
    });
  }

  private initCalls() {
    this.userService.isProfessional().subscribe((isProfessional: boolean) => {
      if (isProfessional) {
        this.callService.init().subscribe(() => this.callService.init(true).subscribe());
      }
    });
  }

  private initOldChat() {
    this.conversationService.init().subscribe(() => {
      this.userService.isProfessional().subscribe((isProfessional: boolean) => {
        if (isProfessional) {
          this.callService.init().subscribe(() => {
            this.conversationService.init(true).subscribe(() => {
              this.callService.init(true).subscribe();
            });
          });
        }
      });
    });
    this.RTConnectedSubscription.unsubscribe();
  }

  private subscribeEventUserLogout() {
    this.event.subscribe(EventService.USER_LOGOUT, (redirectUrl: string) => {
      this.trackingService.track(TrackingService.MY_PROFILE_LOGGED_OUT);
      this.paymentService.deleteCache();
      try {
        this.realTime.disconnect();
      } catch (err) {}
      this.loggingOut = true;
      if (redirectUrl) {
        this.winRef.nativeWindow.location.href = redirectUrl;
      } else {
        this.winRef.nativeWindow.location.reload();
      }
    });
  }

  private subscribeChatEvents() {
    this.event.subscribe(EventService.NEW_MESSAGE,
      (message: Message, updateDate: boolean = false) => this.conversationService.handleNewMessages(message, updateDate));

    this.event.subscribe(EventService.CHAT_SIGNAL,
      (signal: ChatSignal) => this.conversationService.processChatSignal(signal));

      this.event.subscribe(EventService.CHAT_RT_DISCONNECTED, () => {
        if (this.userService.isLogged && this.connectionService.isConnected) {
          this.realTime.reconnect();
        }
      });

    this.subscribeUnreadMessages();
  }

  private subscribeUnreadMessages() {
    this.messageService.totalUnreadMessages$.subscribe((unreadMessages: number) => {
      let title: string = this.titleService.getTitle().split(') ')[1];
      title = title ? title : this.titleService.getTitle();
      if (unreadMessages > 0) {
        title = '(' + unreadMessages + ') ' + title;
      }
      this.titleService.setTitle(title);
    });
  }

  private subscribeEventItemUpdated() {
    const syncItem = (item: Item) => {
      this.conversationService.syncItem(item);
      this.callService.syncItem(item);
    };
    this.event.subscribe(EventService.ITEM_UPDATED, syncItem);
    this.event.subscribe(EventService.ITEM_SOLD, syncItem);
    this.event.subscribe(EventService.ITEM_RESERVED, syncItem);
  }

  private setTitle() {
    this.router.events
    .filter(event => event instanceof NavigationEnd)
    .map(() => this.activatedRoute)
    .map(route => {
      while (route.firstChild) {
        route = route.firstChild;
      }
      return route;
    })
    .filter(route => route.outlet === 'primary')
    .mergeMap(route => route.data)
    .subscribe((event) => {
      let notifications = '';
      const split: string[] = this.titleService.getTitle().split(' ');
      if (split.length > 1) {
        notifications = split[0].trim() + ' ';
      }
      const title = !(event['title']) ? 'Wallapop' : event['title'];
      this.titleService.setTitle(notifications + title);
      this.hideSidebar = event['hideSidebar'];
      this.isMyZone = event['isMyZone'];
      this.isProducts = event['isProducts'];
      this.isProfile = event['isProfile'];
    });
  }

  private setBodyClass() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (this.previousSlug) {
          this.renderer.removeClass(this.document.body, this.previousSlug);
        }
        const currentUrlSlug = 'page-' + event.url.slice(1).replace(/\//g, '-');
        if (currentUrlSlug) {
          this.renderer.addClass(document.body, currentUrlSlug);
        }
        this.previousSlug = currentUrlSlug;
      }
    });
  }
}

