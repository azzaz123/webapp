import { Component, Inject, Input, OnInit } from '@angular/core';
import { Message } from 'shield';

@Component({
  selector: 'tsl-message',
  templateUrl: 'message.component.html',
  styleUrls: ['message.component.scss']
})
export class MessageComponent implements OnInit {

  @Input() message: Message;
  @Input() showUserInfo: boolean;
  @Input() callsPanel: boolean;
  public userWebSlug: string;

  constructor(@Inject('SUBDOMAIN') private subdomain: string) {
  }

  ngOnInit() {
    this.userWebSlug = this.message.user ? this.message.user.getUrl(this.subdomain) : null;
  }



}
