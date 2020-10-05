
import { of } from 'rxjs';

import {catchError} from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { InboxService, InboxConversationService } from './service';
import { InboxConversation, PhoneMethod } from './model';
import { UserService } from '../core/user/user.service';
import { EventService } from '../core/event/event.service';
import { ActivatedRoute, Params } from '@angular/router';
import { isNil } from 'lodash-es';
import { TrustAndSafetyService } from 'app/core/trust-and-safety/trust-and-safety.service';
import { SessionProfileDataLocation } from 'app/core/trust-and-safety/trust-and-safety.interface';
import { SEARCHID_STORAGE_NAME } from '../core/message/real-time.service';
import { NgbModalOptions, NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SendPhoneComponent } from './modals';

@Component({
  selector: 'tsl-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  public conversationsLoading: boolean;
  public conversationsTotal: number;
  public loadingError: boolean;
  public connectionError: boolean;
  public firstLoad: boolean;
  public isProfessional: boolean;

  constructor(public userService: UserService,
              private eventService: EventService,
              private route: ActivatedRoute,
              private inboxService: InboxService,
              public inboxConversationService: InboxConversationService,
              private modalService: NgbModal,
              private trustAndSafetyService: TrustAndSafetyService) {
    this.userService.isProfessional().subscribe((value: boolean) => {
      this.isProfessional = value;
    });
  }

  ngOnInit() {
    this.connectionError = false;
    this.conversationsLoading = false;
    if (this.inboxService.isInboxReady()) {
      this.openConversationIfNeeded();
    }
    this.eventService.subscribe(EventService.CONNECTION_ERROR, () => {
      this.connectionError = true;
      this.conversationsLoading = false;
    });
    this.eventService.subscribe(EventService.CONNECTION_RESTORED, () => {
      this.connectionError = false;
    });

    this.eventService.subscribe(EventService.CHAT_RT_CONNECTED, () => this.inboxConversationService.conversations
    .forEach((conversation: InboxConversation) => this.inboxConversationService.resendPendingMessages(conversation)));

    this.eventService.subscribe(EventService.CURRENT_CONVERSATION_SET, (conversation: InboxConversation) => {
      this.inboxConversationService.currentConversation = conversation;
      this.conversationsLoading = false;
    });
    this.eventService.subscribe(EventService.INBOX_READY, (ready) => {
      this.openConversationIfNeeded();
    });
  }

  public onLoad(event: any) {
    this.conversationsLoading = event.loading;
    this.conversationsTotal = event.total;
  }

  public onChangeInboxOrArchivedDropdown(event: boolean) {
    if (event) {
      this.inboxConversationService.currentConversation = null;
    }
    this.loadingError = event;
  }

  private openConversationIfNeeded() {
    if (this.inboxConversationService.currentConversation || !this.inboxService.isInboxReady()) {
      return;
    }


    this.route.queryParams.subscribe((params: Params) => {
      const searchId = params.searchId;
      const itemId = params.itemId;
      const conversationId = params.conversationId;

      if (conversationId) {
        this.openConversationByConversationId(conversationId);
      } else if (itemId) {
        this.openConversationByItmId(itemId);
      }

      if (conversationId || itemId) {
        this.trustAndSafetyService.submitProfileIfNeeded(SessionProfileDataLocation.OPEN_CHAT);
      }

      if (searchId) {
        sessionStorage.setItem(SEARCHID_STORAGE_NAME, searchId);
      }
    });
  }

  private openConversationByConversationId(conversationId: string) {
    if (isNil(conversationId)) {
      return;
    }

    this.conversationsLoading = true;
    this.inboxConversationService.openConversationByConversationId$(conversationId).subscribe((inboxConversation: InboxConversation) => {
      if (inboxConversation) {
        this.inboxConversationService.currentConversation = inboxConversation;
        return;
      }
      this.conversationsLoading = false;
    });
  }

  private openConversationByItmId(itemId: string) {
    if (isNil(itemId)) {
      return;
    }


    // Try to find the conversation within the downloaded ones
    this.conversationsLoading = true;
    this.inboxConversationService.openConversationByItemId$(itemId).pipe(
    catchError(() => of(null)))
    .subscribe((conversation: InboxConversation) => {
      if (conversation) {
        this.inboxConversationService.currentConversation = conversation;
      } else {
        this.conversationsLoading = false;
      }
      if (conversation && conversation.hasNoMessages) {
        this.openSendPhoneModalIfNeeded(conversation);
      }
    });
  }

  private openSendPhoneModalIfNeeded(conversation: InboxConversation): void {
    this.userService.getPhoneInfo(conversation.user.id).subscribe(phoneInfo => {
      if (!isNil(phoneInfo) && phoneInfo.phone_method === PhoneMethod.POP_UP) {
        this.openSendPhoneModal(conversation);
      }
    });
  }

  private openSendPhoneModal(conversation: InboxConversation) {
    const modalOptions: NgbModalOptions = { windowClass: 'phone-request', backdrop: 'static', keyboard: false };
    const modalRef: NgbModalRef = this.modalService.open(SendPhoneComponent, modalOptions);
    modalRef.componentInstance.conversation = conversation;
  }
}
