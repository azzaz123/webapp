import { Injectable } from '@angular/core';
import { UserService } from '../user/user.service';
import { find } from 'lodash-es';
import PouchDB from 'pouchdb';
import { MessageService } from '../message/message.service';
import { XmppService } from '../xmpp/xmpp.service';
import { ConversationService } from '../conversation/conversation.service';
import { environment } from '../../../environments/environment';

/* istanbul ignore next */
@Injectable()
export class DebugService {

  constructor(private userService: UserService,
              private conversationService: ConversationService,
              private messageService: MessageService,
              private xmppService: XmppService) {
    if (!environment.production) {
      window['tesla'] = {
        debug: this.debug.bind(this),
        debugXMPP: this.debugXMPP.bind(this)
      };
    }
  }

  private debug() {
    return {
      environment: environment,
      currentUser: this.userService.user,
      conversations: this.conversationService.leads,
      currentConversation: find(this.conversationService.leads, {active: true}),
      totalUnreadMessages: this.messageService['_totalUnreadMessages']
    };
  }

  private debugXMPP() {
    this.xmppService.debug();
  }
}
