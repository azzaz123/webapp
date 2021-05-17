import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { EventService } from '@core/event/event.service';
import { User } from '@core/user/user';
import { UserService } from '@core/user/user.service';
import { environment } from '@environments/environment';
import { UnreadChatMessagesService } from '@core/unread-chat-messages/unread-chat-messages.service';
import { APP_PATHS } from 'app/app-routing-constants';
import { PUBLIC_PATHS } from 'app/public/public-routing-constants';
import { Subscription } from 'rxjs';
import { TabbarService } from '../core/services/tabbar.service';

export const INPUT_TYPE = {
  TEXT: 'text',
  DATE: 'date',
  PASSWORD: 'password',
  NUMBER: 'number',
  radio: 'radio',
};

export const KEYBOARD_INPUT_TYPES = [INPUT_TYPE.TEXT, INPUT_TYPE.DATE, INPUT_TYPE.PASSWORD, INPUT_TYPE.NUMBER];

export const ELEMENT_TYPE = {
  TEXT_AREA: 'TEXTAREA',
  INPUT: 'INPUT',
};

@Component({
  selector: 'tsl-tabbar',
  templateUrl: './tabbar.component.html',
  styleUrls: ['./tabbar.component.scss'],
})
export class TabbarComponent implements OnInit {
  public readonly LOGIN_PATH = `${APP_PATHS.PUBLIC}/${PUBLIC_PATHS.LOGIN}`;
  public user: User;
  public homeUrl: string;
  public hidden = false;
  public hasUnreadMessages = false;
  public isLogged: boolean;

  private componentSubscriptions: Subscription[] = [];

  constructor(
    private userService: UserService,
    private tabBarService: TabbarService,
    private unreadChatMessagesService: UnreadChatMessagesService,
    private eventService: EventService,
    @Inject('SUBDOMAIN') private subdomain: string
  ) {
    this.homeUrl = environment.siteUrl.replace('es', this.subdomain);
  }

  ngOnInit() {
    this.isLogged = this.userService.isLogged;
    this.componentSubscriptions.push(this.userService.me().subscribe((user) => (this.user = user)));
    this.componentSubscriptions.push(this.tabBarService.tabBarHidden$.subscribe((hidden) => (this.hidden = hidden)));
    this.componentSubscriptions.push(
      this.unreadChatMessagesService.totalUnreadMessages$.subscribe((unreadMessages) => (this.hasUnreadMessages = !!unreadMessages))
    );

    this.componentSubscriptions.push(
      this.eventService.subscribe(EventService.USER_LOGIN, () => {
        this.isLogged = this.userService.isLogged;
      })
    );

    this.componentSubscriptions.push(
      this.eventService.subscribe(EventService.USER_LOGOUT, () => {
        this.isLogged = this.userService.isLogged;
      })
    );
  }

  private isTextInputOrTextarea(element: any): boolean {
    const elementTarget = element.target;
    if (elementTarget.nodeName === ELEMENT_TYPE.TEXT_AREA) {
      return true;
    }

    if (elementTarget.nodeName !== ELEMENT_TYPE.INPUT) {
      return false;
    }

    const inputType = elementTarget.attributes?.type?.nodeValue;
    return KEYBOARD_INPUT_TYPES.includes(inputType);
  }

  @HostListener('window:focusin', ['$event'])
  onFocusIn(elementType: any) {
    if (this.isTextInputOrTextarea(elementType)) {
      this.hidden = true;
    }
  }

  @HostListener('window:focusout', ['$event'])
  onFocusOut(elementType: any) {
    if (this.isTextInputOrTextarea(elementType)) {
      this.hidden = false;
    }
  }

  ngOnDestroy(): void {
    this.componentSubscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }
}
