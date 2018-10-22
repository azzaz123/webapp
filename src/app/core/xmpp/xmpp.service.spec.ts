/* tslint:disable:no-unused-variable */

import { fakeAsync, TestBed, tick, discardPeriodicTasks } from '@angular/core/testing';
import { XmppService } from './xmpp.service';
import { EventService } from '../event/event.service';
import { Message, messageStatus } from '../message/message';
import { MOCK_USER, USER_ID, MockedUserService } from '../../../tests/user.fixtures.spec';
import { PersistencyService } from '../persistency/persistency.service';
import { CONVERSATION_ID,
  MOCKED_CONVERSATIONS,
  MOCK_CONVERSATION } from '../../../tests/conversation.fixtures.spec';
import { MockedPersistencyService } from '../../../tests/persistency.fixtures.spec';
import { XmppTimestampMessage, XmppBodyMessage } from './xmpp.interface';
import { TrackingService } from '../tracking/tracking.service';
import { MockTrackingService } from '../../../tests/tracking.fixtures.spec';
import { Observable } from 'rxjs/Observable';
import { MOCK_PAYLOAD_KO,
  MOCK_PAYLOAD_OK,
  MOCK_MESSAGE } from '../../../tests/message.fixtures.spec';
import { environment } from '../../../environments/environment';
import { UserService } from '../user/user.service';
import { TrackingEventData } from '../tracking/tracking-event-base.interface';

const mamFirstIndex = '1899';
const mamCount = 1900;
const queryId = 'abcdef';
let userService: UserService;
const LAST_MESSAGE = 'second';
const FIRST_MESSAGE = 'first';
const MESSAGE_ID = 'messageId';
const MESSAGE_BODY = 'body';
const MOCK_SERVER_DATE: Date = new Date('Fri Oct 28 2016 11:50:29 GMT+0200 (CEST)');

class MockedClient {

  on(event: string, handler: Function): void {
  }

  connect(options?: any): void {
  }

  disconnect() {
  }

  sendPresence(options?: any): void {
  }

  enableCarbons(): void {
  }

  use(plugin: Function): void {
  }

  getTime(userId: string): void {
  }

  sendMessage(options?: any): void {
  }

  nextId(): string {
    return queryId;
  }

  enableKeepAlive(opts: any): void {
  }

  sendIq(options?: any): Promise<any> {
    return new Promise((resolve: Function) => {
      resolve({
        mam: {
          rsm: {
            count: mamCount,
            first: FIRST_MESSAGE,
            last: LAST_MESSAGE,
            firstIndex: mamFirstIndex
          }
        }
      });
    });
  }
}

const MOCKED_CLIENT: MockedClient = new MockedClient();
const MOCKED_LOGIN_USER: any = '1';
const MOCKED_LOGIN_PASSWORD: any = 'abc';
const MOCKED_SERVER_MESSAGE: any = {
  thread: 'thread',
  body: 'body',
  requestReceipt: true,
  from: {
    full: 'from',
    bare: 'from-bare'
  },
  fromSelf: false,
  id: 'id'
};
const MOCKED_SERVER_TIMESTAMP_MESSAGE: XmppTimestampMessage = {
  receipt: 'thread',
  to: 'random',
  timestamp: {body: '2017-03-23T12:24:19.844620Z'},
  from: {
    full: 'from'
  },
  id: 'id'
};
const JIDS = ['1@wallapop.com', '2@wallapop.com', '3@wallapop.com'];
let service: XmppService;
let eventService: EventService;
let trackingService: TrackingService;
let persistencyService: PersistencyService;
let sendIqSpy: jasmine.Spy;
let connectSpy: jasmine.Spy;

describe('Service: Xmpp', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        XmppService,
        EventService,
        {provide: TrackingService, useClass: MockTrackingService},
        {provide: PersistencyService, useClass: MockedPersistencyService},
        {provide: UserService, useClass: MockedUserService}]
    });
    service = TestBed.get(XmppService);
    eventService = TestBed.get(EventService);
    trackingService = TestBed.get(TrackingService);
    userService = TestBed.get(UserService);
    persistencyService = TestBed.get(PersistencyService);
    spyOn(XMPP, 'createClient').and.returnValue(MOCKED_CLIENT);
    spyOn(MOCKED_CLIENT, 'on').and.callFake((event, callback) => {
      eventService.subscribe(event, callback);
    });
    connectSpy = spyOn(MOCKED_CLIENT, 'connect');
    spyOn(MOCKED_CLIENT, 'sendPresence');
    spyOn(MOCKED_CLIENT, 'sendMessage');
    spyOn(MOCKED_CLIENT, 'enableCarbons');
    spyOn(MOCKED_CLIENT, 'getTime').and.returnValue(new Promise((resolve: Function) => {
      resolve({time: {utc: MOCK_SERVER_DATE}});
    }));
    sendIqSpy = spyOn(MOCKED_CLIENT, 'sendIq').and.callThrough();
    service = TestBed.get(XmppService);
    appboy.initialize(environment.appboy);
  });

  it('should create the instance', () => {
    expect(service).toBeTruthy();
  });
  it('should create the client', () => {
    service.connect(MOCKED_LOGIN_USER, MOCKED_LOGIN_PASSWORD);

    expect(XMPP.createClient).toHaveBeenCalledWith({
      jid: MOCKED_LOGIN_USER + '@' + environment['xmppDomain'],
      resource: service['resource'],
      password: MOCKED_LOGIN_PASSWORD,
      transport: 'websocket',
      wsURL: environment['wsUrl'],
      useStreamManagement: true,
      sendReceipts: false
    });
  });

  it('should call bindEvents', () => {
    service.connect(MOCKED_LOGIN_USER, MOCKED_LOGIN_PASSWORD);
    expect(MOCKED_CLIENT.on).toHaveBeenCalled();

    eventService.emit('session:started', null);

    expect(MOCKED_CLIENT.sendPresence).toHaveBeenCalled();
    expect(MOCKED_CLIENT.enableCarbons).toHaveBeenCalled();
  });

  it('should connect the client and set clientConnected to true', () => {
    service.connect(MOCKED_LOGIN_USER, MOCKED_LOGIN_PASSWORD);

    expect(MOCKED_CLIENT.connect).toHaveBeenCalled();
    expect(service.clientConnected).toBe(true);
  });

  describe('bindEvents', () => {

    beforeEach(() => {
      service.connect(MOCKED_LOGIN_USER, MOCKED_LOGIN_PASSWORD);
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
              name: 'public'
            }
          }
        });
      });
    });

    describe('onPrivacyListChange', () => {
      const iq: any = {
        type: 'set',
        privacy: {}
      };
      let blockedUser: string;
      let unblockedUser: string;
      beforeEach(() => {
        service['blockedUsers'] = ['1@wallapop.com', '2@wallapop.com'];
        eventService.subscribe(EventService.USER_BLOCKED, (userId: string) => {
          blockedUser = userId;
        });
        eventService.subscribe(EventService.USER_UNBLOCKED, (userId: string) => {
          unblockedUser = userId;
        });
      });
      it('should emit USER_BLOCKED event if there are new users in list', () => {
        spyOn<any>(service, 'getPrivacyList').and.returnValue(Observable.of([...service['blockedUsers'], '3@wallapop.com']));

        eventService.emit('iq', iq);

        expect(service['getPrivacyList']).toHaveBeenCalled();
        expect(blockedUser).toBe('3');
      });
      it('should emit USER_UNBLOCKED event if there are new users in list', () => {
        spyOn<any>(service, 'getPrivacyList').and.returnValue(Observable.of(['1@wallapop.com']));

        eventService.emit('iq', iq);

        expect(service['getPrivacyList']).toHaveBeenCalled();
        expect(unblockedUser).toBe('2');
      });
      it('should set blockedUsers with the new list', () => {
        spyOn<any>(service, 'getPrivacyList').and.returnValue(Observable.of(['1@wallapop.com']));

        eventService.emit('iq', iq);

        expect(service['blockedUsers']).toEqual(['1@wallapop.com']);
      });
    });

    describe('getPrivacyList', () => {
      beforeEach(fakeAsync(() => {
        sendIqSpy.and.returnValue(Promise.resolve({
          privacy: {
            jids: JIDS
          }
        }));
        eventService.emit('session:started', null);
      }));
      it('should sendIq with asking for public list', () => {
        expect(MOCKED_CLIENT.sendIq).toHaveBeenCalledWith({
          type: 'get',
          privacy: {
            list: {
              name: 'public'
            }
          }
        });
      });
      it('should set blockedUsers', () => {
        expect(service['blockedUsers']).toEqual(JIDS);
      });
    });

    it('should emit a newMessage event on the message xmpp received', fakeAsync(() => {
      let msg: Message;
      eventService.emit('session:started', null);
      eventService.emit(EventService.MSG_ARCHIVE_LOADED);
      eventService.subscribe(EventService.NEW_MESSAGE, (message: Message) => {
        msg = message;
      });

      eventService.emit('message', MOCKED_SERVER_MESSAGE);
      tick();

      expect(msg.conversationId).toEqual('thread');
      expect(msg.message).toEqual('body');
      expect(msg.from).toBe(MOCKED_SERVER_MESSAGE.from.full);
    }));

    it('should NOT emit a newMessage event if there is no body', () => {
      let msg: Message;
      (service as any).bindEvents();
      eventService.subscribe(EventService.NEW_MESSAGE, (message) => {
        msg = message;
      });

      eventService.emit('message', {
        thread: 'thread',
        from: 'from',
        id: 'id'
      });

      expect(msg).toBeUndefined();
    });

    it('should NOT emit a newMessage event if there is a blacklisted payload', () => {
      let msg: Message;
      (service as any).bindEvents();
      eventService.subscribe(EventService.NEW_MESSAGE, (message) => {
        msg = message;
      });

      eventService.emit('message', {
        thread: 'thread',
        from: 'from',
        id: 'id',
        payload: MOCK_PAYLOAD_KO
      });

      expect(msg).toBeUndefined();
    });

    it('should emit a newMessage event if there is a whitelist payload', fakeAsync(() => {
      let msg: Message;
      eventService.emit('session:started', null);
      eventService.emit(EventService.MSG_ARCHIVE_LOADED);
      eventService.subscribe(EventService.NEW_MESSAGE, (message: Message) => {
        msg = message;
      });

      eventService.emit('message', {
        ...MOCKED_SERVER_MESSAGE,
        payload: MOCK_PAYLOAD_OK
      });
      tick();

      expect(msg.conversationId).toEqual('thread');
      expect(msg.message).toEqual('body');
      expect(msg.from).toBe(MOCKED_SERVER_MESSAGE.from.full);
      expect(msg.payload.type).toEqual('review');
      expect(msg.payload.text).toEqual('text');
    }));

    describe('reconnectClient', () => {
      it('should call client connect if it is disconnected', fakeAsync(() => {
        connectSpy.calls.reset();
        service.clientConnected = false;

        service.reconnectClient();
        tick(5000);

        expect(MOCKED_CLIENT.connect).toHaveBeenCalledTimes(1);
        discardPeriodicTasks();
      }));
    });

    it('should emit a CLIENT_DISCONNECTED event and set clientConnected to FALSE when the Xmpp client is disconnected', () => {
      spyOn(eventService, 'emit').and.callThrough();

      eventService.emit('disconnected');

      expect(eventService.emit).toHaveBeenCalledWith(EventService.CLIENT_DISCONNECTED);
      expect(service.clientConnected).toBe(false);
    });

    it('should set clientConnected to TRUE when the Xmpp client is connected', () => {
      spyOn(eventService, 'emit').and.callThrough();

      eventService.emit('connected');

      expect(service.clientConnected).toBe(true);
    });

    it('should call reconnectClient if it is disconnected when a CONNECTION_RESTORED event is triggered', () => {
      spyOn(service, 'reconnectClient');
      service.clientConnected = false;

      eventService.emit(EventService.CONNECTION_RESTORED);

      expect(service.reconnectClient).toHaveBeenCalled();
    });

    it('should not reconnect the client if it is already connecetd when a CONNECTION_RESTORED event is triggered', () => {
      service.clientConnected = true;

      eventService.emit(EventService.CONNECTION_RESTORED);

      expect(MOCKED_CLIENT.connect).toHaveBeenCalledTimes(1);
    });

    it('should send the message receipt when there is a new message', () => {
      spyOn<any>(service, 'sendMessageDeliveryReceipt');
      spyOn(persistencyService, 'findMessage').and.returnValue(Observable.throw({
        reason: 'missing'
      }));

      eventService.emit('message', MOCKED_SERVER_MESSAGE);
      eventService.emit(EventService.MSG_ARCHIVE_LOADED);

      expect(service['sendMessageDeliveryReceipt']).toHaveBeenCalledWith(
        MOCKED_SERVER_MESSAGE.from.bare,
        MOCKED_SERVER_MESSAGE.id,
        MOCKED_SERVER_MESSAGE.thread);
    });

    it('should not call the message receipt if the new message is from the current user', () => {
      spyOn<any>(service, 'sendMessageDeliveryReceipt');
      service['currentJid'] = MOCKED_SERVER_MESSAGE.from;

      eventService.emit('message', MOCKED_SERVER_MESSAGE);

      expect(service['sendMessageDeliveryReceipt']).not.toHaveBeenCalled();
    });

    it('should emit a newMessage event on the message xmpp received if it is a carbon', fakeAsync(() => {
      let msg: Message;
      eventService.emit('session:started', null);
      eventService.emit(EventService.MSG_ARCHIVE_LOADED);
      eventService.subscribe(EventService.NEW_MESSAGE, (message: Message) => {
        msg = message;
      });

      eventService.emit('message', {
        carbonSent: {
          forwarded: {
            message: MOCKED_SERVER_MESSAGE
          }
        }
      });
      tick();

      expect(msg.conversationId).toEqual('thread');
      expect(msg.message).toEqual('body');
      expect(msg.from).toBe(MOCKED_SERVER_MESSAGE.from.full);
    }));

    it('should call client.connect when a CONNECTION_ERROR event is emitted', () => {
      eventService.emit(EventService.CONNECTION_ERROR);

      expect(MOCKED_CLIENT.connect).toHaveBeenCalled();
    });

    it('should send the read message', () => {
      service.connect(MOCKED_LOGIN_USER, MOCKED_LOGIN_PASSWORD);
      service.sendConversationStatus(USER_ID, MESSAGE_ID);
      expect(MOCKED_CLIENT.sendMessage).toHaveBeenCalledWith({
        to: USER_ID + '@' + environment['xmppDomain'],
        read: {
          xmlns: 'wallapop:thread:status'
        },
        type: 'chat',
        thread: MESSAGE_ID
      });
    });

    it('should emit the messageReceivedAck event when a message with received receipt is sent', () => {
      spyOn(eventService, 'emit').and.callThrough();
      const msg = {
        received: {
          xmlns: 'urn:xmpp:receipts',
          id: MESSAGE_ID
        }
      };

      eventService.emit('message:sent', msg);

      expect(eventService.emit).toHaveBeenCalledWith(EventService.MESSAGE_RECEIVED_ACK);
    });

    it('should emit the messageReadAck event when a message with read receipt is sent', () => {
      spyOn(eventService, 'emit').and.callThrough();
      const msg = {
        read: {
          id: MESSAGE_ID
        }
      };

      eventService.emit('message:sent', msg);

      expect(eventService.emit).toHaveBeenCalledWith(EventService.MESSAGE_READ_ACK);
    });
  });

  describe('isConnected', () => {

    let clientConnected: boolean;

    beforeEach(() => {
      service.connect(MOCKED_LOGIN_USER, MOCKED_LOGIN_PASSWORD);
      clientConnected = false;
    });

    it('should say when is clientConnected', fakeAsync(() => {
      service.isConnected().subscribe((value: boolean) => {
        clientConnected = value;
      });

      service['clientConnected$'].next(true);
      tick();

      expect(clientConnected).toBe(true);
      clientConnected = false;

      service.isConnected().subscribe((value: boolean) => {
        clientConnected = value;
      });

      expect(clientConnected).toBe(true);
      service['clientConnected'] = true;

      service.isConnected().subscribe((value: boolean) => {
        clientConnected = value;
      });

      expect(clientConnected).toBe(true);
    }));

    it('should say when is NOT clientConnected', fakeAsync(() => {
      service.isConnected().subscribe((value: boolean) => {
        clientConnected = value;
      });

      service['clientConnected$'].next(false);
      tick();

      expect(clientConnected).toBe(false);
      service['clientConnected'] = false;

      service.isConnected().subscribe((value: boolean) => {
        clientConnected = value;
      });

      expect(clientConnected).toBe(false);
    }));

  });

  describe('send Message', () => {

    it('should send a new message', () => {
      spyOn<any>(service, 'onNewMessage');

      service.connect(MOCKED_LOGIN_USER, MOCKED_LOGIN_PASSWORD);
      service.sendMessage(MOCKED_CONVERSATIONS[0], MESSAGE_BODY);
      const message: any = {
        id: queryId,
        to: service['createJid'](USER_ID),
        from: service['currentJid'],
        thread: CONVERSATION_ID,
        type: 'chat',
        request: {xmlns: 'urn:xmpp:receipts'},
        body: MESSAGE_BODY
      };

      expect(MOCKED_CLIENT.sendMessage).toHaveBeenCalledWith(message);
      expect(service['onNewMessage']).toHaveBeenCalledWith(message, true);
    });

    it('should track the conversationCreateNew event', () => {
      spyOn(trackingService, 'track');
      const newConversation = MOCK_CONVERSATION('newId');

      service.connect(MOCKED_LOGIN_USER, MOCKED_LOGIN_PASSWORD);

      service.sendMessage(newConversation, MESSAGE_BODY);
      const message: any = {
        id: queryId,
        to: service['createJid'](USER_ID),
        from: service['currentJid'],
        thread: newConversation.id,
        type: 'chat',
        request: {xmlns: 'urn:xmpp:receipts'},
        body: MESSAGE_BODY
      };

      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.CONVERSATION_CREATE_NEW,
        { thread_id: message.thread,
          message_id: message.id,
          item_id: MOCKED_CONVERSATIONS[0].item.id });
    });

    it('should add MessageSent event in the pendingTrackingEvents queue', () => {
      spyOn(trackingService, 'addTrackingEvent');
      service.connect(MOCKED_LOGIN_USER, MOCKED_LOGIN_PASSWORD);

      service.sendMessage(MOCKED_CONVERSATIONS[0], MESSAGE_BODY);
      const message: any = {
        id: queryId,
        to: service['createJid'](USER_ID),
        from: service['currentJid'],
        thread: CONVERSATION_ID,
        type: 'chat',
        request: {xmlns: 'urn:xmpp:receipts'},
        body: MESSAGE_BODY
      };

      const expectedEvent: TrackingEventData = {
        eventData: TrackingService.MESSAGE_SENT,
        attributes: {
          thread_id: message.thread,
          message_id: message.id,
          item_id: MOCKED_CONVERSATIONS[0].item.id
        }
      };

      expect(trackingService.addTrackingEvent).toHaveBeenCalledWith(expectedEvent, false);
    });

    it('should send a new message with the true updateDate parameter', () => {
      spyOn<any>(service, 'onNewMessage').and.callThrough();

      service.connect(MOCKED_LOGIN_USER, MOCKED_LOGIN_PASSWORD);
      eventService.emit(EventService.MSG_ARCHIVE_LOADED);
      eventService.emit('message', MOCKED_SERVER_TIMESTAMP_MESSAGE, true);

      expect(service['onNewMessage']).toHaveBeenCalledWith(MOCKED_SERVER_TIMESTAMP_MESSAGE);
    });

    it('should not process new incoming messages if the message archive is loading', () => {
      spyOn<any>(service, 'onNewMessage').and.callThrough();

      service.connect(MOCKED_LOGIN_USER, MOCKED_LOGIN_PASSWORD);
      eventService.emit(EventService.MSG_ARCHIVE_LOADING);
      eventService.emit('message', MOCKED_SERVER_TIMESTAMP_MESSAGE, true);

      expect(service['onNewMessage']).not.toHaveBeenCalled();
    });
  });

  describe('buildMessage', () => {
    it('should set the date of the message using the timestamp if it exists', () => {
      expect((service as any).buildMessage(MOCKED_SERVER_TIMESTAMP_MESSAGE).date).toEqual(new Date(MOCKED_SERVER_TIMESTAMP_MESSAGE.timestamp.body));
    });

    it('should emit a messageReceived event if the message has a receipt', () => {
      spyOn(eventService, 'emit');
      const message: XmppBodyMessage = {
        from: {local: 'from'},
        body: 'bla',
        timestamp: {body: 'timestamp'},
        thread: 'thread',
        to: {local: 'to'},
        id: 'someId',
        receipt: 'received'
      };

      const builtMessage = service['buildMessage'](message);

      expect(builtMessage.status).toBe(messageStatus.RECEIVED);
      expect(eventService.emit).toHaveBeenCalledWith(EventService.MESSAGE_RECEIVED, message.thread, message.receipt);
    });

    it('should emit a messageSentAck event if the message has a sentReceipt', () => {
      spyOn(eventService, 'emit');
      const message: XmppBodyMessage = {
        from: {local: 'from'},
        body: 'bla',
        timestamp: {body: 'timestamp'},
        thread: 'thread',
        to: {local: 'to'},
        id: 'someId',
        sentReceipt: {id: 'someId'}
      };

      const builtMessage = service['buildMessage'](message);

      expect(builtMessage.status).toBe(messageStatus.SENT);
      expect(eventService.emit).toHaveBeenCalledWith(EventService.MESSAGE_SENT_ACK, message.thread, message.sentReceipt.id);
      expect(eventService.emit).toHaveBeenCalledTimes(1);
    });

    it('should emit a messageRead event if the message has a readReceipt', () => {
      spyOn(eventService, 'emit');
      const message: XmppBodyMessage = {
        from: {local: 'from'},
        body: 'bla',
        timestamp: {body: 'timestamp'},
        thread: 'thread',
        to: {local: 'to'},
        id: 'someId',
        readReceipt: {id: 'someId'}
      };

      const builtMessage = service['buildMessage'](message);
      const timestamp = new Date(message.date).getTime();

      expect(builtMessage.status).toBe(messageStatus.READ);
      expect(eventService.emit).toHaveBeenCalledWith(EventService.MESSAGE_READ, message.thread, timestamp);
      expect(eventService.emit).toHaveBeenCalledTimes(1);
    });
  });

  describe('disconnect', () => {
    it('should disconnect', () => {
      spyOn(MOCKED_CLIENT, 'disconnect');
      service.connect('abc', 'def');
      service['_clientConnected'] = true;

      service.disconnect();

      expect(MOCKED_CLIENT.disconnect).toHaveBeenCalled();
    });

  });

  describe('sendMessageDeliveryReceipt', () => {
    it('should sent a received message when sendMessageDeliveryReceipt method is called', () => {
      service.connect(MOCKED_LOGIN_USER, MOCKED_LOGIN_PASSWORD);

      service.sendMessageDeliveryReceipt(MOCK_MESSAGE.from, MOCK_MESSAGE.id, MOCK_MESSAGE.conversationId);

      expect(MOCKED_CLIENT.sendMessage).toHaveBeenCalledWith({
        to: MOCK_MESSAGE.from,
        type: 'chat',
        thread: MOCK_MESSAGE.conversationId,
        received: {
          xmlns: 'urn:xmpp:receipts',
          id: MOCK_MESSAGE.id
        }
      });
    });
  });

  describe('blockUser', () => {
    beforeEach(() => {
      service.connect(MOCKED_LOGIN_USER, MOCKED_LOGIN_PASSWORD);
    });

    it('should add user to blocked list and call sendIq', () => {
      service['blockedUsers'] = [...JIDS];

      service.blockUser(MOCK_USER).subscribe();

      expect(service['blockedUsers'].length).toBe(4);
      expect(service['blockedUsers'][3]).toBe(USER_ID + '@wallapop.com');
      expect(MOCKED_CLIENT.sendIq).toHaveBeenCalledWith({
        type: 'set',
        privacy: {
          list: {
            name: 'public',
            jids: service['blockedUsers']
          }
        }
      });
    });
    it('should set default list if there is just 1 user ', fakeAsync(() => {
      service['blockedUsers'] = [];

      service.blockUser(MOCK_USER).subscribe();
      tick();

      expect(service['blockedUsers'].length).toBe(1);
      expect(service['blockedUsers'][0]).toBe(USER_ID + '@wallapop.com');
      expect(MOCKED_CLIENT.sendIq['calls'].allArgs()).toEqual([[{
        type: 'set',
        privacy: {
          list: {
            name: 'public',
            jids: service['blockedUsers']
          }
        }
      }], [{
        type: 'set',
        privacy: {
          default: {
            name: 'public'
          }
        }
      }]]);
    }));
    it('should set user.blocked', fakeAsync(() => {
      service['blockedUsers'] = [];
      MOCK_USER.blocked = false;

      service.blockUser(MOCK_USER).subscribe();
      tick();

      expect(MOCK_USER.blocked).toBe(true);
    }));
    it('should emit USER_BLOCKED event', fakeAsync(() => {
      let eventEmitted: boolean;
      service['blockedUsers'] = [];
      eventService.subscribe(EventService.USER_BLOCKED, () => {
        eventEmitted = true;
      });

      service.blockUser(MOCK_USER).subscribe();
      tick();

      expect(eventEmitted).toBe(true);
    }));
  });

  describe('unblockUser', () => {
    beforeEach(() => {
      service.connect(MOCKED_LOGIN_USER, MOCKED_LOGIN_PASSWORD);
    });
    it('should remove user from blocked list and call sendIq', () => {
      service['blockedUsers'] = [...JIDS, USER_ID + '@wallapop.com'];

      service.unblockUser(MOCK_USER).subscribe();

      expect(service['blockedUsers'].length).toBe(3);
      expect(MOCKED_CLIENT.sendIq).toHaveBeenCalledWith({
        type: 'set',
        privacy: {
          list: {
            name: 'public',
            jids: service['blockedUsers']
          }
        }
      });
    });
    it('should set user.blocked', fakeAsync(() => {
      service['blockedUsers'] = [USER_ID + '@wallapop.com'];
      MOCK_USER.blocked = true;

      service.unblockUser(MOCK_USER).subscribe();
      tick();

      expect(MOCK_USER.blocked).toBe(false);
    }));
    it('should emit USER_UNBLOCKED event', fakeAsync(() => {
      let eventEmitted: boolean;
      service['blockedUsers'] = [];
      eventService.subscribe(EventService.USER_UNBLOCKED, () => {
        eventEmitted = true;
      });

      service.unblockUser(MOCK_USER).subscribe();
      tick();

      expect(eventEmitted).toBe(true);
    }));
  });

  describe('isBlocked', () => {
    it('should return true if user is in the blockedList', () => {
      service['blockedUsers'] = JIDS;

      expect(service.isBlocked('2')).toBe(true);
    });
    it('should return false if user is NOT in the blockedList', () => {
      service['blockedUsers'] = JIDS;

      expect(service.isBlocked('5')).toBe(false);
    });
  });

  describe('sendMessage', () => {

    describe('Appboy FirstMessage event', () => {
      beforeEach(() => {
        service.connect(MOCKED_LOGIN_USER, MOCKED_LOGIN_PASSWORD);
        MOCKED_CONVERSATIONS[0].messages = [];
        spyOn(appboy, 'logCustomEvent');
      });

      it('should send event if is the first message', () => {
        service.sendMessage(MOCKED_CONVERSATIONS[0], MESSAGE_BODY);

        expect(appboy.logCustomEvent).toHaveBeenCalledWith('FirstMessage', {platform: 'web'});
      });

      it('should not send event if the conversation is already created', () => {
        MOCKED_CONVERSATIONS[0].messages = [MOCK_MESSAGE];
        service.sendMessage(MOCKED_CONVERSATIONS[0], MESSAGE_BODY);

        expect(appboy.logCustomEvent).not.toHaveBeenCalled();
      });

      it('should send event once if more than one message is sended', () => {
        service.sendMessage(MOCKED_CONVERSATIONS[0], MESSAGE_BODY);
        MOCKED_CONVERSATIONS[0].messages = [MOCK_MESSAGE];
        service.sendMessage(MOCKED_CONVERSATIONS[0], MESSAGE_BODY);

        expect(appboy.logCustomEvent).toHaveBeenCalledTimes(1);
      });
    });
  });

});
