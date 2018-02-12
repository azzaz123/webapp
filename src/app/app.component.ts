import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import {
  DebugService,
  ErrorsService,
  EventService,
  I18nService,
  Message,
  MessageService,
  NotificationService,
  User,
  UserService,
  WindowRef,
  XmppService
} from 'shield';
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
  private previousUrl: string;
  private currentUrl: string;
  private previousSlug: string;

  constructor(private event: EventService,
              private xmppService: XmppService,
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
              private cookieService: CookieService) {
    this.config();
  }

  ngOnInit() {
    this.subscribeEventUserLogin();
    this.subscribeEventUserLogout();
    this.subscribeUnreadMessages();
    this.subscribeEventNewMessage();
    this.userService.checkUserStatus();
    this.notificationService.init();
    this.setTitle();
    this.setBodyClass();
    this.updateUrlAndSendAnalytics();
    appboy.initialize(environment.appboy);
    appboy.display.automaticallyShowNewInAppMessages();
    appboy.registerAppboyPushMessages();
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
    let uuid: string = UUID.UUID();
    this.setCookie('app_session_id', uuid, 900000);
  }

  private setCookie(name: string, token: string, expiration: number) {
    let expirationDate: Date = new Date();
    expirationDate.setTime(expirationDate.getTime() + expiration);
    const options: CookieOptions = {
      path: '/',
      expires: expirationDate
    };
    this.cookieService.put(name, token, options);
  }

  private trackAppOpen() {
      this.trackingService.track(TrackingService.APP_OPEN, {referer_url: this.previousUrl, current_url: this.currentUrl});
  }

  private subscribeEventUserLogin() {
    this.event.subscribe(EventService.USER_LOGIN, (accessToken: string) => {
      this.userService.me().subscribe(
        (user: User) => {
          this.xmppService.connect(user.id, accessToken);
          this.conversationService.init().subscribe();
          appboy.changeUser(user.id);
          appboy.openSession();
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

  private subscribeEventUserLogout() {
    this.event.subscribe(EventService.USER_LOGOUT, (redirectUrl: string) => {
      this.trackingService.track(TrackingService.MY_PROFILE_LOGGED_OUT);
      this.xmppService.disconnect();
      this.loggingOut = true;
      if (redirectUrl) {
        this.winRef.nativeWindow.location.href = redirectUrl;
      } else {
        this.winRef.nativeWindow.location.reload();
      }
    });
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

  private subscribeEventNewMessage() {
    this.event.subscribe(EventService.NEW_MESSAGE, (message: Message, updateDate: boolean = false) => this.conversationService.handleNewMessages(message, updateDate));
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
      const title = !(event['title']) ? 'Wallapop' : event['title'];
      this.titleService.setTitle(title);
      this.hideSidebar = event['hideSidebar'];
      this.isMyZone = event['isMyZone'];
      this.isProducts = event['isProducts'];
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

