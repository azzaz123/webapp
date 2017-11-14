import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import {
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
  XmppService,
  DebugService
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
import { MdIconRegistry } from '@angular/material';
import { ConversationService } from './core/conversation/conversation.service';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { environment } from '../environments/environment';

@Component({
  selector: 'tsl-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public loggingOut: boolean;
  public hideSidebar: boolean;
  private previousUrl: string;

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
              private renderer: Renderer2,
              @Inject(DOCUMENT) private document: Document,
              private debugService: DebugService) {
    this.config();
  }

  ngOnInit() {
    this.subscribeEvents();
    this.userService.checkUserStatus();
    this.notificationService.init();
    this.setTitle();
    this.setBodyClass();
    this.router.events.distinctUntilChanged((previous: any, current: any) => {
      if (current instanceof NavigationEnd) {
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

  private config() {
    configMoment(this.i18n.locale);
    configIcons(this.mdIconRegistry, this.sanitizer);
  }

  private subscribeEvents() {
    this.event.subscribe(EventService.USER_LOGIN, (accessToken: string) => {
      this.userService.me().subscribe(
        (user: User) => {
          this.trackingService.track(TrackingService.MY_PROFILE_LOGGED_IN, {user_id: user.id});
          this.xmppService.connect(user.id, accessToken);
          this.conversationService.init().subscribe();
          appboy.changeUser(user.id);
          appboy.openSession();
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

  private setBodyClass() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (this.previousUrl) {
          this.renderer.removeClass(this.document.body, this.previousUrl);
        }
        const currentUrlSlug = 'page-' + event.url.slice(1).replace(/\//g, '-');
        if (currentUrlSlug) {
          this.renderer.addClass(document.body, currentUrlSlug);
        }
        this.previousUrl = currentUrlSlug;
      }
    });
  }

}
