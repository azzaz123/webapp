import { Component, OnInit } from '@angular/core';
import {
  ConversationService,
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
// Declare ga function as ambient
declare var ga: Function;

@Component({
  selector: 'tsl-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public loggingOut: boolean;

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
              private debugService: DebugService) {
    this.config();
  }

  ngOnInit() {
    this.subscribeEvents();
    this.userService.checkUserStatus();
    this.notificationService.init();
  }

  private config() {
    configMoment(this.i18n.locale);
    configIcons(this.mdIconRegistry, this.sanitizer);
  }

  private getConversation(itemId: number) {
    this.conversationService.getConversation(itemId).subscribe((r) => {
      console.log(r.json().conversationId);
    });
  }

  private subscribeEvents() {
    this.event.subscribe(EventService.USER_LOGIN, (accessToken: string) => {
      this.userService.me().subscribe(
        (user: User) => {
          this.trackingService.track(TrackingService.MY_PROFILE_LOGGED_IN, {user_id: user.id});
          this.xmppService.connect(user.id, accessToken);
          this.conversationService.init().subscribe();
        },
        (error: any) => {
          this.userService.logout();
          this.errorsService.show(error, true);
        });
    });
    this.event.subscribe(EventService.USER_LOGOUT, () => {
      this.trackingService.track(TrackingService.MY_PROFILE_LOGGED_OUT);
      this.xmppService.disconnect();
      this.loggingOut = true;
      this.winRef.nativeWindow.location.reload();
    });
    this.messageService.totalUnreadMessages$.subscribe((unreadMessages: number) => {
      let title: string = 'Wallapop Admin';
      if (unreadMessages > 0) {
        title = '(' + unreadMessages + ') ' + title;
      }
      this.titleService.setTitle(title);
    });
    this.event.subscribe(EventService.NEW_MESSAGE, (message: Message, updateDate: boolean = false) => this.conversationService.handleNewMessages(message, updateDate));
  }

}
