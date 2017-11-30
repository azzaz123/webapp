import { Component, OnInit } from '@angular/core';
import {
  DebugService,
  ErrorsService,
  EventService,
  I18nService,
  Message,
  MessageService,
  NotificationService,
  TrackingService,
  User,
  UserService,
  WindowRef,
  XmppService
} from 'shield';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { configMoment } from './config/moment.config';
import { configIcons } from './config/icons.config';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/takeWhile';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromPromise';
import { MdIconRegistry } from '@angular/material';
import { ConversationService } from './core/conversation/conversation.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { environment } from '../environments/environment';
import { CookieOptions, CookieService } from "ngx-cookie/index";
import { UUID } from 'angular2-uuid';

@Component({
  selector: 'tsl-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public loggingOut: boolean;
  public hideSidebar: boolean;
  private previousUrl: string;
  private currentUrl: string;

  constructor(private event: EventService,
              private xmppService: XmppService,
              public userService: UserService,
              private errorsService: ErrorsService,
              private notificationService: NotificationService,
              private messageService: MessageService,
              private titleService: Title,
              private sanitizer: DomSanitizer,
              private mdIconRegistry: MdIconRegistry,
              private trackingService: TrackingService,
              private i18n: I18nService,
              private conversationService: ConversationService,
              private winRef: WindowRef,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private debugService: DebugService,
              private cookieService: CookieService) {
    this.config();
  }

  ngOnInit() {
    this.subscribeEvents();
    this.userService.checkUserStatus();
    this.notificationService.init();
    this.setTitle();
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
    appboy.initialize(environment.appboy);
    appboy.display.automaticallyShowNewInAppMessages();
  }

  private updateSessionCookie() {
      let uuid: string = UUID.UUID();
      this.setCookie('app_session_id', uuid, 900000);
  }

  private config() {
    configMoment(this.i18n.locale);
    configIcons(this.mdIconRegistry, this.sanitizer);
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

  private subscribeEvents() {
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
    this.messageService.totalUnreadMessages$.subscribe((unreadMessages: number) => {
      let title: string = this.titleService.getTitle().split(') ')[1];
      title = title ? title : this.titleService.getTitle();
      if (unreadMessages > 0) {
        title = '(' + unreadMessages + ') ' + title;
      }
      this.titleService.setTitle(title);
    });
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
    });
  }

}
