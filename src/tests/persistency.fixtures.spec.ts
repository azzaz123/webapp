import { MESSAGE_MAIN } from './message.fixtures.spec';
import { Message, phoneRequestState } from '../app/core/message/message';
import { InboxMessage, messageStatus } from '../app/chat/chat-with-inbox/message/inbox-message';
import { Observable } from 'rxjs';
import { createInboxConversationsArray } from './inbox.fixtures.spec';

const currentDate = new Date();

export const MOCK_DB_FILTERED_RESPONSE: any = [
  {
    doc: {
      '_id': MESSAGE_MAIN.id,
      'conversationId': MESSAGE_MAIN.thread,
      'message': MESSAGE_MAIN.body,
      'from': MESSAGE_MAIN.from,
      'date': MESSAGE_MAIN.date,
      'status': messageStatus.READ
    }
  },
  {
    doc: {
      '_id': 'message2',
      'conversationId': MESSAGE_MAIN.thread,
      'message': 'Message 2',
      'from': MESSAGE_MAIN.from,
      'date': MESSAGE_MAIN.date + 1,
      'status': messageStatus.READ
    }
  }
];

export const MOCK_DB_MSG_WITH_PHONEREQUEST: any = [
  {
    doc: {
      '_id': MESSAGE_MAIN.id,
      'conversationId': MESSAGE_MAIN.thread,
      'message': MESSAGE_MAIN.body,
      'from': MESSAGE_MAIN.from,
      'date': MESSAGE_MAIN.date,
      'status': messageStatus.READ,
      'phoneRequest': phoneRequestState.pending
    }
  }
];

export const MOCK_DB_RESPONSE_WITH_PENDING: any = [
  {
    doc: {
      '_id': MESSAGE_MAIN.id,
      'conversationId': MESSAGE_MAIN.thread,
      'message': MESSAGE_MAIN.body,
      'from': MESSAGE_MAIN.from,
      'date': new Date(currentDate.setDate(currentDate.getDate() - 3)),
      'status': messageStatus.PENDING
    }
  },
  {
    doc: {
      '_id': 'message2',
      'conversationId': MESSAGE_MAIN.thread,
      'message': 'Message 2',
      'from': MESSAGE_MAIN.from,
      'date': MESSAGE_MAIN.date + 1,
      'status': messageStatus.READ
    }
  }
];

export const MOCK_DB_RESPONSE_WITH_OLD_PENDING: any = [
  {
    doc: {
      '_id': MESSAGE_MAIN.id,
      'conversationId': MESSAGE_MAIN.thread,
      'message': MESSAGE_MAIN.body,
      'from': MESSAGE_MAIN.from,
      'date': new Date(currentDate.setDate(currentDate.getDate() - 8)),
      'status': messageStatus.PENDING
    }
  },
  {
    doc: {
      '_id': 'message2',
      'conversationId': MESSAGE_MAIN.thread,
      'message': 'Message 2',
      'from': MESSAGE_MAIN.from,
      'date': MESSAGE_MAIN.date + 1,
      'status': messageStatus.READ
    }
  }
];

export const MOCK_DB_RESPONSE: any = {
  offset: 1,
  total_rows: 3,
  rows: [
    {
      doc: {
        '_id': MESSAGE_MAIN.id,
        'conversationId': MESSAGE_MAIN.thread,
        'message': MESSAGE_MAIN.body,
        'from': MESSAGE_MAIN.from,
        'date': MESSAGE_MAIN.date,
        'status': messageStatus.READ
      }
    },
    {
      doc: {
        '_id': 'message2',
        'conversationId': MESSAGE_MAIN.thread,
        'message': 'Message 2',
        'from': MESSAGE_MAIN.from,
        'date': MESSAGE_MAIN.date + 1,
        'status': messageStatus.READ
      }
    },
    {
      doc: {
        '_id': 'xv-123871',
        'conversationId': 'random',
        'message': 'Hola',
        'from': 'pj9ylwknvv6e@dock9.wallapop.com/1.15.0-d1610071212_ONE-E1001_22_XZAmN_RT_DEBUG',
        'date': '2016-10-10T15:30:27.000Z',
        'status': messageStatus.READ
      }
    }
  ]
};

const mockedInboxConvs = createInboxConversationsArray(3);

export const MOCK_INBOX_DB_RESPONSE: any = {
  offset: 1,
  total_rows: 3,
  rows: [
    {
      doc: {
        '_id': mockedInboxConvs[0].id,
        'modifiedDate': mockedInboxConvs[0].modifiedDate,
        'user': mockedInboxConvs[0].user,
        'item': mockedInboxConvs[0].item,
        'phoneShared': true,
        'unreadCounter': 2,
        'lastMessage': mockedInboxConvs[0].lastMessage
      }
    },
    {
      doc: {
        '_id': mockedInboxConvs[1].id,
        'modifiedDate': mockedInboxConvs[1].modifiedDate,
        'user': mockedInboxConvs[1].user,
        'item': mockedInboxConvs[1].item,
        'phoneShared': true,
        'unreadCounter': 0,
        'lastMessage': mockedInboxConvs[1].lastMessage

      }
    },
    {
      doc: {
        '_id': mockedInboxConvs[2].id,
        'modifiedDate': mockedInboxConvs[2].modifiedDate,
        'user': mockedInboxConvs[2].user,
        'item': mockedInboxConvs[2].item,
        'phoneShared': false,
        'unreadCounter': 1,
        'lastMessage': mockedInboxConvs[2].lastMessage
      }
    }
  ]
};

export const MOCK_DB_META: any = {
  data: {
    last: 'last',
    start: '2016-10-10T15:30:27.000Z',
    end: true
  }
};

/* istanbul ignore next */
export class MockedPersistencyService {
  get messagesDb(): any {
    return new MockedMessagesDb();
  }

  get conversationsDb(): any {
    return new MockedConversationsDb();
  }

  public getMessages(conversationId: string) {
  }

  public saveMessages(messages: Array<Message> | Message) {
  }

  public saveInboxMessages(messages: Array<InboxMessage> | InboxMessage) {
  }

  public saveMetaInformation(data: any) {
  }

  public getStoredInbox() {}

  public getArchivedStoredInbox() {}

  public getMetaInformation() {
  }

  public resetCache() {
  }

  public updateMessageDate() {
  }

  public localDbVersionUpdate(newVersion: number, callback: Function) {
    callback();
  }

  public updateMessageStatus(messageId: string, newStatus: string) {
  }

  public updateInboxMessageStatus(messageId: string, newStatus: string) {
  }

  public findMessage(messageId: string) {
    return Observable.of({});
  }

  public markPhoneRequestAnswered(message: Message) {}

  public setPhoneNumber(phone: string) {}
}

/* istanbul ignore next */
export class MockedMessagesDb {

  get(): any {
  }

  bulkDocs(): any {
  }

  put(): any {
  }

  allDocs(): any {
  }

}
/* istanbul ignore next */
export class MockedConversationsDb {

  get(): any {
  }

  bulkDocs(): any {
  }

  put(): any {
  }

  allDocs(): any {
  }

}

export class MockedInboxDb {
  get(): any {}
  bulkDocs(): any {}
  put(): any {}
  allDocs(): any {}
  destroy(): any {}
}
