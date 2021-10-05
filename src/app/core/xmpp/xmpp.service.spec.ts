/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */

import { discardPeriodicTasks, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ChatSignal, ChatSignalType, InboxMessage, MessageStatus, MessageType } from '@private/features/chat/core/model';
import { of } from 'rxjs';
import { environment } from '@environments/environment';
import { MockRemoteConsoleService } from '../../../tests';
import {
  CONVERSATION_ID,
  CREATE_MOCK_INBOX_CONVERSATION,
  CREATE_MOCK_INBOX_CONVERSATION_WITH_EMPTY_MESSAGE,
  MOCK_MESSAGE,
  MOCK_MESSAGE_FROM_OTHER,
  MOCK_PAYLOAD_KO,
  MOCK_PAYLOAD_OK,
} from '@fixtures/chat';
import { MOCK_USER, OTHER_USER_ID, USER_ID } from '@fixtures/user.fixtures.spec';
import { EventService } from '../event/event.service';
import { RemoteConsoleService } from '../remote-console';
import { XmppBodyMessage } from './xmpp.interface';
import { XmppService } from './xmpp.service';
import { StanzaIO } from './xmpp.provider';

const mamFirstIndex = '1899';
const mamCount = 1900;
const queryId = 'abcdef';
const LAST_MESSAGE = 'second';
const FIRST_MESSAGE = 'first';
const MESSAGE_ID = 'messageId';
const MESSAGE_BODY = 'body';
const MOCK_SERVER_DATE: Date = new Date('Fri Oct 28 2016 11:50:29 GMT+0200 (CEST)');

class MockedClient {
  on(event: string, handler: Function): void {}

  connect(options?: any): void {}

  disconnect() {}

  sendPresence(options?: any): void {}

  enableCarbons(): void {}

  use(plugin: Function): void {}

  getTime(userId: string): Promise<any> {
    return new Promise((resolve: Function) => {
      resolve({});
    });
  }

  sendMessage(options?: any): void {}

  nextId(): string {
    return queryId;
  }

  enableKeepAlive(opts: any): void {}

  sendIq(options?: any): Promise<any> {
    return new Promise((resolve: Function) => {
      resolve({
        mam: {
          rsm: {
            count: mamCount,
            first: FIRST_MESSAGE,
            last: LAST_MESSAGE,
            firstIndex: mamFirstIndex,
          },
        },
      });
    });
  }

  getRoster() {}
}

const MOCKED_CLIENT: MockedClient = new MockedClient();
const MOCKED_LOGIN_USER: any = '1';
const MOCKED_LOGIN_PASSWORD: any = 'abc';
const MOCKED_SERVER_MESSAGE: any = {
  thread: 'thread',
  body: 'body',
  requestReceipt: true,
  from: new StanzaIO.JID(OTHER_USER_ID, environment.xmppDomain),
  fromSelf: false,
  id: 'id',
};
const MOCKED_SERVER_RECEIVED_RECEIPT: XmppBodyMessage = {
  body: '',
  thread: 'thread',
  receipt: 'receipt',
  to: new StanzaIO.JID(USER_ID, environment.xmppDomain),
  from: new StanzaIO.JID(OTHER_USER_ID, environment.xmppDomain),
  timestamp: { body: '2017-03-23T12:24:19.844620Z' },
  id: 'id',
};
let service: XmppService;
let eventService: EventService;
let sendIqSpy: jasmine.Spy;
let connectSpy: jasmine.Spy;
let remoteConsoleService: RemoteConsoleService;

function getUserIdsFromJids(jids: string[]) {
  const ids = [];
  jids.map((jid) => ids.push(jid.split('@')[0]));
  return ids;
}

function getJidsFromUserIds(ids: string[]) {
  const jids = [];
  ids.map((id) => jids.push(id + '@' + environment.xmppDomain));
  return jids;
}

const JIDS = getJidsFromUserIds(['1', '2', '3']);

describe('Service: Xmpp', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [XmppService, EventService, { provide: RemoteConsoleService, useClass: MockRemoteConsoleService }],
    });
    service = TestBed.inject(XmppService);
    eventService = TestBed.inject(EventService);
    spyOn(StanzaIO, 'createClient').and.returnValue(MOCKED_CLIENT);
    spyOn(MOCKED_CLIENT, 'on').and.callFake((event, callback) => {
      eventService.subscribe(event, callback);
    });
    connectSpy = spyOn(MOCKED_CLIENT, 'connect');
    spyOn(MOCKED_CLIENT, 'sendPresence');
    spyOn(MOCKED_CLIENT, 'sendMessage');
    spyOn(MOCKED_CLIENT, 'enableCarbons');
    spyOn(MOCKED_CLIENT, 'getTime').and.returnValue(
      new Promise((resolve: Function) => {
        resolve({ time: { utc: MOCK_SERVER_DATE } });
      })
    );
    sendIqSpy = spyOn(MOCKED_CLIENT, 'sendIq').and.callThrough();
    service = TestBed.inject(XmppService);
    remoteConsoleService = TestBed.inject(RemoteConsoleService);
    spyOn(console, 'warn');
  });

  it('should create the instance', () => {
    expect(service).toBeTruthy();
  });

  it('should create the client', () => {
    service.connect$(MOCKED_LOGIN_USER, MOCKED_LOGIN_PASSWORD);
    const selfJid = new StanzaIO.JID(MOCKED_LOGIN_USER, environment.xmppDomain, service['resource']);

    expect(StanzaIO.createClient).toHaveBeenCalledWith({
      jid: selfJid,
      resource: service['resource'],
      password: MOCKED_LOGIN_PASSWORD,
      transport: 'websocket',
      wsURL: environment['wsUrl'],
      useStreamManagement: true,
      sendReceipts: false,
    });
  });

  describe('init', () => {
    it('should define connection as false', () => {
      service.isConnected$().subscribe((isConnected) => expect(isConnected).toEqual(false));
    });
  });

  describe('session started', () => {
    beforeEach(() => {
      service.connect$(MOCKED_LOGIN_USER, MOCKED_LOGIN_PASSWORD).subscribe();
      expect(MOCKED_CLIENT.on).toHaveBeenCalled();
    });
    it('should call sendPresence', () => {
      eventService.emit('session:started', null);

      expect(MOCKED_CLIENT.sendPresence).toHaveBeenCalled();
      expect(MOCKED_CLIENT.enableCarbons).toHaveBeenCalled();
    });

    it('should call enableCarbons', () => {
      eventService.emit('session:started', null);

      expect(MOCKED_CLIENT.enableCarbons).toHaveBeenCalled();
    });

    it('should call getBlockedUsers (call sendIq with get & privacy list public', () => {
      const expetedCallParams = {
        type: 'get',
        privacy: {
          list: {
            name: 'public',
          },
        },
      };

      eventService.emit('session:started', null);

      expect(MOCKED_CLIENT.sendIq['calls'].argsFor(1)[0]).toEqual(expetedCallParams);
    });

    it('should set blockedListAvailable and emit an CHAT_RT_CONNECTED event when getBlockedUsers returns', () => {
      spyOn(eventService, 'emit').and.callThrough();
      spyOn<any>(service, 'getBlockedUsers').and.returnValue(of(true));

      eventService.emit('session:started', null);

      expect(service['blockedListAvailable']).toBe(true);
      expect(eventService.emit).toHaveBeenCalledWith(EventService.CHAT_RT_CONNECTED);
    });
  });

  it('should connect the client and set clientConnected to true', () => {
    service.connect$(MOCKED_LOGIN_USER, MOCKED_LOGIN_PASSWORD);

    expect(MOCKED_CLIENT.connect).toHaveBeenCalled();
    expect(service.clientConnected).toBe(true);
  });

  describe('bindEvents', () => {
    beforeEach(() => {
      spyOn(remoteConsoleService, 'sendPresentationMessageTimeout');
      service.connect$(MOCKED_LOGIN_USER, MOCKED_LOGIN_PASSWORD).subscribe();
    });

    describe('setDefaultPrivacyList', () => {
      beforeEach(() => {
        eventService.emit('session:started', null);
      });
      it('should sendIq with default public list', () => {
        expect(MOCKED_CLIENT.sendIq).toHaveBeenCalledWith({
          type: 'set',
          privacy: {
            default: {
              name: 'public',
            },
          },
        });
      });
    });

    describe('onPrivacyListChange', () => {
      const iq: any = {
        type: 'set',
        privacy: {},
      };
      beforeEach(() => {
        service['blockedUsers'] = ['1', '2'];
      });
      it('should emit USER_BLOCKED event if there are new users in list', () => {
        const expectedValue = service['blockedUsers'].concat('3');
        spyOn<any>(service, 'getPrivacyList').and.returnValue(of(expectedValue));
        spyOn(eventService, 'emit').and.callThrough();

        eventService.emit('iq', iq);

        expect(service['getPrivacyList']).toHaveBeenCalled();
        expect(eventService.emit).toHaveBeenCalledWith(EventService.PRIVACY_LIST_UPDATED, expectedValue);
      });
      it('should set blockedUsers with the new list', () => {
        spyOn<any>(service, 'getPrivacyList').and.returnValue(of(['1@wallapop.com']));

        eventService.emit('iq', iq);

        expect(service['blockedUsers']).toEqual(['1@wallapop.com']);
      });
    });

    describe('getPrivacyList', () => {
      beforeEach(fakeAsync(() => {
        sendIqSpy.and.returnValue(
          Promise.resolve({
            privacy: {
              jids: JIDS,
            },
          })
        );
        eventService.emit('session:started', null);
      }));
      it('should sendIq with asking for public list', () => {
        expect(MOCKED_CLIENT.sendIq).toHaveBeenCalledWith({
          type: 'get',
          privacy: {
            list: {
              name: 'public',
            },
          },
        });
      });
      it('should set blockedUsers', () => {
        const blockedUserIds = [];
        JIDS.map((jid) => blockedUserIds.push(jid.split('@')[0]));

        expect(service['blockedUsers']).toEqual(blockedUserIds);
      });
    });

    it('should emit a newMessage event on the message xmpp received', fakeAsync(() => {
      let msg: InboxMessage;
      eventService.emit('session:started', null);
      eventService.emit(EventService.CHAT_CAN_PROCESS_RT, true);
      eventService.subscribe(EventService.NEW_MESSAGE, (message: InboxMessage) => {
        msg = message;
      });

      eventService.emit('message', MOCKED_SERVER_MESSAGE);
      tick();

      expect(msg.thread).toEqual('thread');
      expect(msg.text).toEqual('body');
      expect(msg.from).toBe(MOCKED_SERVER_MESSAGE.from.local);
      expect(remoteConsoleService.sendPresentationMessageTimeout).toHaveBeenCalledWith('id');
    }));

    it('should set the message status to SENT when a new xmpp message is received', fakeAsync(() => {
      let msg: InboxMessage;
      eventService.emit('session:started', null);
      eventService.emit(EventService.CHAT_CAN_PROCESS_RT, true);
      eventService.subscribe(EventService.NEW_MESSAGE, (message: InboxMessage) => {
        msg = message;
      });

      eventService.emit('message', MOCKED_SERVER_MESSAGE);
      tick();

      expect(msg.status).toBe(MessageStatus.SENT);
      expect(remoteConsoleService.sendPresentationMessageTimeout).toHaveBeenCalledWith('id');
    }));

    it(`should emit a newMessage event with withDeliveryReceipt TRUE when the message includes
      a delivery receipt request`, fakeAsync(() => {
      let expectedVal;
      eventService.emit('session:started', null);
      eventService.emit(EventService.CHAT_CAN_PROCESS_RT, true);
      eventService.subscribe(EventService.NEW_MESSAGE, (message: InboxMessage, updateTimestamp: boolean, withDeliveryReceipt: boolean) => {
        expectedVal = withDeliveryReceipt;
      });

      eventService.emit('message', MOCKED_SERVER_MESSAGE);
      tick();

      expect(MOCKED_SERVER_MESSAGE.requestReceipt).toBe(true);
      expect(expectedVal).toBe(true);
      expect(remoteConsoleService.sendPresentationMessageTimeout).toHaveBeenCalledWith('id');
    }));

    it(`should emit a newMessage event with withDeliveryReceipt FALSE when the message does not include
    a delivery receipt request`, fakeAsync(() => {
      let expectedVal;
      const msg = MOCKED_SERVER_MESSAGE;
      msg.requestReceipt = false;
      eventService.emit('session:started', null);
      eventService.emit(EventService.CHAT_CAN_PROCESS_RT, true);
      eventService.subscribe(EventService.NEW_MESSAGE, (message: InboxMessage, updateTimestamp: boolean, withDeliveryReceipt: boolean) => {
        expectedVal = withDeliveryReceipt;
      });

      eventService.emit('message', msg);
      tick();

      expect(msg.requestReceipt).toBe(false);
      expect(expectedVal).toBe(false);
      expect(remoteConsoleService.sendPresentationMessageTimeout).toHaveBeenCalledWith('id');
    }));

    it('should NOT emit a newMessage event if there is no body', () => {
      let msg: InboxMessage;
      (service as any).bindEvents();
      eventService.subscribe(EventService.NEW_MESSAGE, (message) => {
        msg = message;
      });

      eventService.emit('message', {
        thread: 'thread',
        from: new StanzaIO.JID(OTHER_USER_ID, environment.xmppDomain),
        id: 'id',
      });

      expect(msg).toBeUndefined();
    });

    it('should NOT emit a newMessage event if there is a blacklisted payload', () => {
      let msg: InboxMessage;
      (service as any).bindEvents();
      eventService.subscribe(EventService.NEW_MESSAGE, (message) => {
        msg = message;
      });

      eventService.emit('message', {
        thread: 'thread',
        from: new StanzaIO.JID(OTHER_USER_ID, environment.xmppDomain),
        id: 'id',
        payload: MOCK_PAYLOAD_KO,
      });

      expect(msg).toBeUndefined();
    });

    it('should emit a newMessage event if there is a whitelist payload', fakeAsync(() => {
      let inboxMessage: InboxMessage;
      eventService.emit('session:started', null);
      eventService.emit(EventService.CHAT_CAN_PROCESS_RT, true);
      eventService.subscribe(EventService.NEW_MESSAGE, (message: InboxMessage) => {
        inboxMessage = message;
      });

      eventService.emit('message', {
        ...MOCKED_SERVER_MESSAGE,
        payload: MOCK_PAYLOAD_OK,
      });
      tick();

      expect(inboxMessage.thread).toEqual('thread');
      expect(inboxMessage.text).toEqual('body');
      expect(inboxMessage.from).toBe(MOCKED_SERVER_MESSAGE.from.local);
      expect(inboxMessage.payload.type).toEqual('review');
      expect(inboxMessage.payload.text).toEqual('text');
    }));

    it('should set fromSelf to FALSE for a message with a payload', fakeAsync(() => {
      let msg: InboxMessage;
      eventService.emit('session:started', null);
      eventService.emit(EventService.CHAT_CAN_PROCESS_RT, true);
      eventService.subscribe(EventService.NEW_MESSAGE, (message: InboxMessage) => {
        msg = message;
      });

      eventService.emit('message', {
        ...MOCKED_SERVER_MESSAGE,
        payload: MOCK_PAYLOAD_OK,
      });
      tick();

      expect(msg.fromSelf).toBe(false);
    }));

    describe('reconnectClient', () => {
      it('should call client connect if it is disconnected and client exists', fakeAsync(() => {
        service['client'] = MOCKED_CLIENT;
        service.clientConnected = false;
        connectSpy.calls.reset();

        service.reconnectClient();
        tick();

        expect(MOCKED_CLIENT.connect).toHaveBeenCalled();
        discardPeriodicTasks();
      }));

      it('should NOT call client connect if it is disconnected and client does nor exist', fakeAsync(() => {
        service['client'] = null;
        service.clientConnected = false;
        connectSpy.calls.reset();

        service.reconnectClient();
        tick();

        expect(MOCKED_CLIENT.connect).not.toHaveBeenCalled();
        discardPeriodicTasks();
      }));
    });

    it('should emit a CHAT_RT_DISCONNECTED event and set clientConnected to FALSE when the Xmpp client is disconnected', () => {
      spyOn(eventService, 'emit').and.callThrough();
      spyOn(remoteConsoleService, 'sendXmppConnectionClosedWithError').and.callThrough();

      eventService.emit('disconnected');

      expect(eventService.emit).toHaveBeenCalledWith(EventService.CHAT_RT_DISCONNECTED);
      expect(remoteConsoleService.sendXmppConnectionClosedWithError).toHaveBeenCalled();
      expect(service.clientConnected).toBe(false);
    });

    it('should set clientConnected to TRUE when the Xmpp client is connected', () => {
      spyOn(eventService, 'emit').and.callThrough();

      eventService.emit('connected');

      expect(service.clientConnected).toBe(true);
    });

    it('should not reconnect the client if it is already connecetd when a CONNECTION_RESTORED event is triggered', () => {
      service.clientConnected = true;

      eventService.emit(EventService.CONNECTION_RESTORED);

      expect(MOCKED_CLIENT.connect).toHaveBeenCalledTimes(1);
    });

    it('should emit a newMessage event on the message xmpp received if it is a carbon', fakeAsync(() => {
      let msg: InboxMessage;
      eventService.emit('session:started', null);
      eventService.emit(EventService.CHAT_CAN_PROCESS_RT, true);
      eventService.subscribe(EventService.NEW_MESSAGE, (message: InboxMessage) => {
        msg = message;
      });

      eventService.emit('message', {
        carbonSent: {
          forwarded: {
            message: MOCKED_SERVER_MESSAGE,
          },
        },
      });
      tick();

      expect(msg.thread).toEqual('thread');
      expect(msg.text).toEqual('body');
      expect(msg.from).toBe(MOCKED_SERVER_MESSAGE.from.local);
    }));

    it('should call client.connect when a CONNECTION_ERROR event is emitted', () => {
      eventService.emit(EventService.CONNECTION_ERROR);

      expect(MOCKED_CLIENT.connect).toHaveBeenCalled();
    });

    it('should send the read message', () => {
      service.connect$(MOCKED_LOGIN_USER, MOCKED_LOGIN_PASSWORD);
      service.sendConversationStatus(USER_ID, MESSAGE_ID);
      const jid = new StanzaIO.JID(USER_ID, environment.xmppDomain);

      expect(MOCKED_CLIENT.sendMessage).toHaveBeenCalledWith({
        to: jid,
        read: {
          xmlns: 'wallapop:thread:status',
        },
        type: 'chat',
        thread: MESSAGE_ID,
      });
    });

    it('should emit the messageReceivedAck event when a message with received receipt is sent', () => {
      spyOn(eventService, 'emit').and.callThrough();
      const msg = {
        received: {
          xmlns: 'urn:xmpp:receipts',
          id: MESSAGE_ID,
        },
      };

      eventService.emit('message:sent', msg);

      expect(eventService.emit).toHaveBeenCalledWith(EventService.MESSAGE_RECEIVED_ACK);
    });

    it('should emit the messageReadAck event when a message with read receipt is sent', () => {
      spyOn(eventService, 'emit').and.callThrough();
      const msg = {
        read: {
          id: MESSAGE_ID,
        },
      };

      eventService.emit('message:sent', msg);

      expect(eventService.emit).toHaveBeenCalledWith(EventService.MESSAGE_READ_ACK);
    });
  });

  describe('isConnected', () => {
    let clientConnected: boolean;

    beforeEach(() => {
      service.connect$(MOCKED_LOGIN_USER, MOCKED_LOGIN_PASSWORD);
      clientConnected = false;
    });

    it('should say when is clientConnected', fakeAsync(() => {
      service.isConnected$().subscribe((value: boolean) => {
        clientConnected = value;
      });

      service['clientConnected$'].next(true);
      tick();

      expect(clientConnected).toBe(true);
      clientConnected = false;

      service.isConnected$().subscribe((value: boolean) => {
        clientConnected = value;
      });

      expect(clientConnected).toBe(true);
      service['clientConnected'] = true;

      service.isConnected$().subscribe((value: boolean) => {
        clientConnected = value;
      });

      expect(clientConnected).toBe(true);
    }));

    it('should emit a CHAT_RT_CONNECTED event if blockedListAvailable is true', fakeAsync(() => {
      spyOn(eventService, 'emit').and.callThrough();
      service['blockedListAvailable'] = true;

      eventService.emit('connected');

      expect(eventService.emit).toHaveBeenCalledWith(EventService.CHAT_RT_CONNECTED);
    }));

    it('should NOT emit a CHAT_RT_CONNECTED event if blockedListAvailable is false', fakeAsync(() => {
      spyOn(eventService, 'emit').and.callThrough();
      service['blockedListAvailable'] = false;

      eventService.emit('connected');

      expect(eventService.emit).not.toHaveBeenCalledWith(EventService.CHAT_RT_CONNECTED);
    }));

    it('should say when is NOT clientConnected', fakeAsync(() => {
      service.isConnected$().subscribe((value: boolean) => {
        clientConnected = value;
      });

      service['clientConnected$'].next(false);
      tick();

      expect(clientConnected).toBe(false);
      service['clientConnected'] = false;

      service.isConnected$().subscribe((value: boolean) => {
        clientConnected = value;
      });

      expect(clientConnected).toBe(false);
    }));
  });

  describe('disconnectError', () => {
    it('should throw an error if clientConnected is false', fakeAsync(() => {
      // skipping test, it's failing for no reason
      let error: any, response: any;
      service['clientConnected'] = false;

      service.disconnectError().subscribe(
        (r) => (response = r),
        (err) => (error = err)
      );
      tick();

      expect(error).toEqual(service['xmppError']);
      expect(response).toBeFalsy();
    }));

    it('should throw return true clientConnected is true', fakeAsync(() => {
      let error: any, response: any;
      service['clientConnected'] = true;

      service.disconnectError().subscribe(
        (r) => (response = r),
        (err) => (error = err)
      );
      tick();

      expect(error).toBeFalsy();
      expect(response).toBe(true);
    }));
  });

  describe('send Message', () => {
    it('should send a new message', () => {
      spyOn<any>(service, 'onNewMessage');
      spyOn<any>(remoteConsoleService, 'sendMessageTimeout');
      spyOn<any>(remoteConsoleService, 'sendMessageActTimeout');

      service.connect$(MOCKED_LOGIN_USER, MOCKED_LOGIN_PASSWORD);
      service.sendMessage(CREATE_MOCK_INBOX_CONVERSATION_WITH_EMPTY_MESSAGE(CONVERSATION_ID, USER_ID), MESSAGE_BODY);
      const message: any = {
        id: queryId,
        to: new StanzaIO.JID(USER_ID, environment.xmppDomain),
        from: service['self'],
        thread: CONVERSATION_ID,
        type: 'chat',
        request: { xmlns: 'urn:xmpp:receipts' },
        body: MESSAGE_BODY,
      };

      expect(remoteConsoleService.sendMessageTimeout).toHaveBeenCalledWith(queryId);
      expect(remoteConsoleService.sendMessageActTimeout).toHaveBeenCalledWith(queryId);
      expect(MOCKED_CLIENT.sendMessage).toHaveBeenCalledWith(message);
      expect(service['onNewMessage']).toHaveBeenCalledWith(message, true);
    });

    it('should set the message status to PENDING when a new xmpp message is sent', fakeAsync(() => {
      let msg: InboxMessage;
      service.connect$(MOCKED_LOGIN_USER, MOCKED_LOGIN_PASSWORD);
      eventService.subscribe(EventService.NEW_MESSAGE, (message: InboxMessage) => {
        msg = message;
      });

      service.sendMessage(CREATE_MOCK_INBOX_CONVERSATION(), MESSAGE_BODY);
      tick();

      expect(msg.status).toBe(MessageStatus.PENDING);
    }));

    it('should emit a MESSAGE_SENT event when called', () => {
      spyOn(eventService, 'emit');
      spyOn<any>(remoteConsoleService, 'sendMessageTimeout');
      spyOn<any>(remoteConsoleService, 'sendMessageActTimeout');
      spyOn<any>(remoteConsoleService, 'sendPresentationMessageTimeout');

      service.connect$(MOCKED_LOGIN_USER, MOCKED_LOGIN_PASSWORD);
      service.sendMessage(CREATE_MOCK_INBOX_CONVERSATION(), MESSAGE_BODY);

      expect(remoteConsoleService.sendMessageTimeout).toHaveBeenCalledWith(queryId);
      expect(remoteConsoleService.sendMessageActTimeout).toHaveBeenCalledWith(queryId);
      expect(remoteConsoleService.sendPresentationMessageTimeout).not.toHaveBeenCalled();
      expect(eventService.emit).toHaveBeenCalledWith(EventService.MESSAGE_SENT, CREATE_MOCK_INBOX_CONVERSATION(), queryId);
    });

    it('should send a new message with the true updateDate parameter', () => {
      spyOn<any>(service, 'onNewMessage').and.callThrough();

      service.connect$(MOCKED_LOGIN_USER, MOCKED_LOGIN_PASSWORD);
      eventService.emit(EventService.CHAT_CAN_PROCESS_RT, true);
      eventService.emit('message', MOCKED_SERVER_RECEIVED_RECEIPT, true);

      expect(service['onNewMessage']).toHaveBeenCalledWith(MOCKED_SERVER_RECEIVED_RECEIPT);
    });

    it('should not process new incoming messages if the CHAT_CAN_PROCESS_RT event with FASLE has been emmitted', () => {
      spyOn<any>(service, 'onNewMessage').and.callThrough();

      service.connect$(MOCKED_LOGIN_USER, MOCKED_LOGIN_PASSWORD);
      eventService.emit(EventService.CHAT_CAN_PROCESS_RT, false);
      eventService.emit('message', MOCKED_SERVER_RECEIVED_RECEIPT, true);

      expect(service['onNewMessage']).not.toHaveBeenCalled();
    });
  });

  describe('resendMessage', () => {
    it('should call client.sendMessage with an XmppBodyMessage', () => {
      const conversation = CREATE_MOCK_INBOX_CONVERSATION();
      const pendingMessage = new InboxMessage(
        'other-id',
        conversation.id,
        MOCK_MESSAGE_FROM_OTHER.message,
        OTHER_USER_ID,
        true,
        new Date(),
        MessageStatus.PENDING,
        MessageType.TEXT
      );

      spyOn<any>(service, 'createJid').and.returnValues(
        new StanzaIO.JID(OTHER_USER_ID, environment.xmppDomain),
        new StanzaIO.JID(USER_ID, environment.xmppDomain)
      );
      const expectedXmppMsg: XmppBodyMessage = {
        id: MOCK_MESSAGE_FROM_OTHER.id,
        to: new StanzaIO.JID(USER_ID, environment.xmppDomain),
        from: new StanzaIO.JID(OTHER_USER_ID, environment.xmppDomain),
        thread: conversation.id,
        type: 'chat',
        request: {
          xmlns: 'urn:xmpp:receipts',
        },
        body: MOCK_MESSAGE_FROM_OTHER.message,
      };

      service.connect$(MOCKED_LOGIN_USER, MOCKED_LOGIN_PASSWORD);
      service.resendMessage(conversation, pendingMessage);

      expect(MOCKED_CLIENT.sendMessage).toHaveBeenCalledWith(expectedXmppMsg);
    });
  });

  describe('buildMessage', () => {
    it('should set the date of the message using the timestamp if it exists', () => {
      expect((service as any).buildMessage(MOCKED_SERVER_RECEIVED_RECEIPT).date).toEqual(
        new Date(MOCKED_SERVER_RECEIVED_RECEIPT.timestamp.body)
      );
    });
  });

  describe('onNewMessage', () => {
    beforeEach(() => {
      spyOn(remoteConsoleService, 'sendPresentationMessageTimeout');
    });

    it('should emit a CHAT_LAST_RECEIVED_TS event when a new message or chat signal is processed', () => {
      spyOn(eventService, 'emit');
      const expectedTimestamp = new Date(MOCKED_SERVER_RECEIVED_RECEIPT.timestamp.body).getTime();

      service['onNewMessage'](MOCKED_SERVER_RECEIVED_RECEIPT);

      expect(remoteConsoleService.sendPresentationMessageTimeout).not.toHaveBeenCalled();
      expect(eventService.emit).toHaveBeenCalledWith(EventService.CHAT_LAST_RECEIVED_TS, expectedTimestamp);
    });

    it('should emit a CHAT_SIGNAL event if the message has a receipt', () => {
      spyOn(eventService, 'emit');

      const message: XmppBodyMessage = {
        from: new StanzaIO.JID(USER_ID, environment.xmppDomain, service['resource']),
        body: 'bla',
        timestamp: { body: 'timestamp' },
        thread: 'thread',
        to: new StanzaIO.JID(OTHER_USER_ID, environment.xmppDomain),
        id: 'someId',
        receipt: 'receipt',
      };
      const expectedSignal = new ChatSignal(ChatSignalType.RECEIVED, message.thread, new Date(message.date).getTime(), message.receipt);

      service['onNewMessage'](message);

      expect(remoteConsoleService.sendPresentationMessageTimeout).not.toHaveBeenCalled();
      expect(eventService.emit).toHaveBeenCalledWith(EventService.CHAT_SIGNAL, expectedSignal);
    });

    it('should emit a CHAT_SIGNAL event if the message has a sentReceipt', () => {
      spyOn(eventService, 'emit');
      const message: XmppBodyMessage = {
        from: new StanzaIO.JID(USER_ID, environment.xmppDomain, service['resource']),
        body: 'bla',
        timestamp: { body: 'timestamp' },
        thread: 'thread',
        to: new StanzaIO.JID(OTHER_USER_ID, environment.xmppDomain),
        id: 'someId',
        sentReceipt: { id: 'someId' },
      };
      const expectedSignal = new ChatSignal(ChatSignalType.SENT, message.thread, new Date(message.date).getTime(), message.sentReceipt.id);

      service['onNewMessage'](message);

      expect(remoteConsoleService.sendPresentationMessageTimeout).not.toHaveBeenCalled();
      expect(eventService.emit).toHaveBeenCalledWith(EventService.CHAT_SIGNAL, expectedSignal);
    });

    it('should emit a CHAT_SIGNAL event if the message is a readReceipt from the other user to self', () => {
      spyOn(eventService, 'emit');
      const self = new StanzaIO.JID(USER_ID, environment.xmppDomain, service['resource']);
      service['self'] = self;
      const message: XmppBodyMessage = {
        from: new StanzaIO.JID(OTHER_USER_ID, environment.xmppDomain, service['resource']),
        body: 'bla',
        timestamp: { body: 'timestamp' },
        thread: 'thread',
        to: self,
        id: 'someId',
        readReceipt: { id: 'someId' },
      };
      const expectedSignal = new ChatSignal(ChatSignalType.READ, message.thread, new Date(message.date).getTime(), null, false);

      service['onNewMessage'](message);

      expect(remoteConsoleService.sendPresentationMessageTimeout).not.toHaveBeenCalled();
      expect(eventService.emit).toHaveBeenCalledWith(EventService.CHAT_SIGNAL, expectedSignal);
    });

    it('should emit a CHAT_SIGNAL event if the message is a readReceipt from self to the other user', () => {
      spyOn(eventService, 'emit');
      const self = new StanzaIO.JID(USER_ID, environment.xmppDomain, service['resource']);
      service['self'] = self;
      const message: XmppBodyMessage = {
        from: self,
        body: 'bla',
        timestamp: { body: 'timestamp' },
        thread: 'thread',
        to: new StanzaIO.JID(USER_ID, environment.xmppDomain),
        id: 'someId',
        readReceipt: { id: 'someId' },
      };
      const expectedSignal = new ChatSignal(ChatSignalType.READ, message.thread, new Date(message.date).getTime(), null, true);

      service['onNewMessage'](message);

      expect(remoteConsoleService.sendPresentationMessageTimeout).not.toHaveBeenCalled();
      expect(eventService.emit).toHaveBeenCalledWith(EventService.CHAT_SIGNAL, expectedSignal);
    });
  });

  describe('disconnect', () => {
    it('should disconnect', () => {
      spyOn(MOCKED_CLIENT, 'disconnect');
      service.connect$('abc', 'def');
      service['_clientConnected'] = true;

      service.disconnect();

      expect(MOCKED_CLIENT.disconnect).toHaveBeenCalled();
    });
  });

  describe('sendMessageDeliveryReceipt', () => {
    it('should sent a received message when sendMessageDeliveryReceipt method is called', () => {
      service.connect$(MOCKED_LOGIN_USER, MOCKED_LOGIN_PASSWORD);

      service.sendMessageDeliveryReceipt(MOCK_MESSAGE.from, MOCK_MESSAGE.id, MOCK_MESSAGE.thread);

      expect(MOCKED_CLIENT.sendMessage).toHaveBeenCalledWith({
        to: new StanzaIO.JID(MOCK_MESSAGE.from, environment.xmppDomain),
        type: 'chat',
        thread: MOCK_MESSAGE.thread,
        received: {
          xmlns: 'urn:xmpp:receipts',
          id: MOCK_MESSAGE.id,
        },
      });
    });
  });

  describe('blockUser', () => {
    beforeEach(() => {
      service.connect$(MOCKED_LOGIN_USER, MOCKED_LOGIN_PASSWORD);
    });

    it('should add user to blocked list and call sendIq', () => {
      service['blockedUsers'] = getUserIdsFromJids(JIDS);

      service.blockUser(MOCK_USER).subscribe();

      expect(service['blockedUsers'].length).toBe(4);
      expect(service['blockedUsers'][3]).toBe(USER_ID);
      expect(MOCKED_CLIENT.sendIq).toHaveBeenCalledWith({
        type: 'set',
        privacy: {
          list: {
            name: 'public',
            jids: getJidsFromUserIds(service['blockedUsers']),
          },
        },
      });
    });
    it('should set default list if there is just 1 user ', fakeAsync(() => {
      service['blockedUsers'] = [];

      service.blockUser(MOCK_USER).subscribe();
      tick();

      expect(service['blockedUsers'].length).toBe(1);
      expect(service['blockedUsers'][0]).toBe(USER_ID);
      expect(MOCKED_CLIENT.sendIq['calls'].allArgs()).toEqual([
        [
          {
            type: 'set',
            privacy: {
              list: {
                name: 'public',
                jids: getJidsFromUserIds(service['blockedUsers']),
              },
            },
          },
        ],
        [
          {
            type: 'set',
            privacy: {
              default: {
                name: 'public',
              },
            },
          },
        ],
      ]);
    }));
    it('should set user.blocked', fakeAsync(() => {
      service['blockedUsers'] = [];
      MOCK_USER.blocked = false;

      service.blockUser(MOCK_USER).subscribe();
      tick();

      expect(MOCK_USER.blocked).toBe(true);
    }));
  });

  describe('unblockUser', () => {
    beforeEach(() => {
      service.connect$(MOCKED_LOGIN_USER, MOCKED_LOGIN_PASSWORD);
    });
    it('should remove user from blocked list and call sendIq', fakeAsync(() => {
      service['blockedUsers'] = getUserIdsFromJids(JIDS).concat(USER_ID);

      service.unblockUser(MOCK_USER).subscribe();
      tick();

      expect(service['blockedUsers'].length).toBe(3);
      expect(MOCKED_CLIENT.sendIq).toHaveBeenCalledWith({
        type: 'set',
        privacy: {
          list: {
            name: 'public',
            jids: getJidsFromUserIds(service['blockedUsers']),
          },
        },
      });
    }));
    it('should set user.blocked', fakeAsync(() => {
      service['blockedUsers'] = [USER_ID + '@' + environment['xmppDomain']];
      MOCK_USER.blocked = true;

      service.unblockUser(MOCK_USER).subscribe();
      tick();

      expect(MOCK_USER.blocked).toBe(false);
    }));
  });
});
