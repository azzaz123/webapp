import { Component, Inject, Input, OnInit } from '@angular/core';
import { Message, phoneRequestState } from '../../core/message/message';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SendPhoneComponent } from '../../chat/modals/send-phone/send-phone.component';
import { Conversation } from '../../core/conversation/conversation';

@Component({
  selector: 'tsl-message',
  templateUrl: 'message.component.html',
  styleUrls: ['message.component.scss']
})
export class MessageComponent implements OnInit {

  @Input() message: Message;
  @Input() showUserInfo: boolean;
  @Input() callsPanel: boolean;
  @Input() currentConversation: Conversation;
  public userWebSlug: string;
  public phoneRequestState = phoneRequestState;

  constructor(@Inject('SUBDOMAIN')
    private subdomain: string,
    private modalService: NgbModal) {
  }

  ngOnInit() {
    this.userWebSlug = this.message.user ? this.message.user.getUrl(this.subdomain) : null;
  }

  openDialog() {
    const modalRef: NgbModalRef = this.modalService.open(SendPhoneComponent, {windowClass: 'phone-request'});
    modalRef.componentInstance.conversation = this.currentConversation;
  }
}
