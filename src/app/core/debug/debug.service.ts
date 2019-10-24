import { Injectable } from '@angular/core';
import { PersistencyService } from '../persistency/persistency.service';
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
              private persistencyService: PersistencyService,
              private messageService: MessageService,
              private xmppService: XmppService) {
    if (!environment.production) {
      window['tesla'] = {
        debug: this.debug.bind(this),
        destroyDatabase: this.destroyDatabase.bind(this),
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

  private destroyDatabase() {
    new PouchDB('messages').destroy().then(() => {
      this.persistencyService.messagesDb = new PouchDB('messages');
      console.log('Messages deleted!');
    });
    new PouchDB('conversations').destroy().then(() => {
      this.persistencyService.conversationsDb = new PouchDB('conversations');
      console.log('Conversations deleted!');
    });
  }

  private debugXMPP() {
    this.xmppService.debug();
  }


}
