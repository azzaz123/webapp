import { Component, Input } from '@angular/core';
import { Message } from 'shield';
import { USER_BASE_PATH } from 'shield';
import { environment } from "../../../environments/environment";

@Component({
  selector: 'tsl-message',
  templateUrl: 'message.component.html',
  styleUrls: ['message.component.scss']
})
export class MessageComponent {

  @Input() message: Message;
  @Input() showUserInfo: boolean;
  @Input() callsPanel: boolean;
  public userWebSlug: string;

  ngOnInit() {
    this.userWebSlug = this.message.user ? this.message.user.webLink.replace(USER_BASE_PATH, environment.siteUrl + 'user/') : null;
  }

  constructor() {
  }

}
