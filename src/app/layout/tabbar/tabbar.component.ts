import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { EventService } from '@core/event/event.service';
import { User } from '@core/user/user';
import { UserService } from '@core/user/user.service';
import { environment } from '@environments/environment';
import { MessageService } from '@features/chat/core/message/message.service';
import { APP_PATHS } from 'app/app-routing-constants';
import { PUBLIC_PATHS } from 'app/public/public-routing-constants';
import { Subscription } from 'rxjs';
import { TabbarService } from './tabbar.service';

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
    private messageService: MessageService,
    private eventService: EventService,
    @Inject('SUBDOMAIN') private subdomain: string
  ) {
    this.homeUrl = environment.siteUrl.replace('es', this.subdomain);
  }

  ngOnInit() {
    this.isLogged = this.userService.isLogged;
    this.componentSubscriptions.push(
      this.userService.me().subscribe((user) => (this.user = user))
    );
    this.componentSubscriptions.push(
      this.tabBarService.tabBarHidden$.subscribe(
        (hidden) => (this.hidden = hidden)
      )
    );
    this.componentSubscriptions.push(
      this.messageService.totalUnreadMessages$.subscribe(
        (unreadMessages) => (this.hasUnreadMessages = !!unreadMessages)
      )
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

  private isTextInputOrTextarea(elementType: string) {
    return elementType === 'INPUT' || elementType === 'TEXTAREA';
  }

  @HostListener('window:focusin', ['$event.target.nodeName'])
  onFocusIn(elementType: string) {
    if (this.isTextInputOrTextarea(elementType)) {
      this.hidden = true;
    }
  }

  @HostListener('window:focusout', ['$event.target.nodeName'])
  onFocusOut(elementType: string) {
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
