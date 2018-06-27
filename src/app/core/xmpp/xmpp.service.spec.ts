/* tslint:disable:no-unused-variable */

import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { XmppService } from './xmpp.service';
import { EventService } from '../event/event.service';
import { Message, messageStatus } from '../message/message';
import { MOCK_USER, USER_ID, MockedUserService } from '../../../tests/user.fixtures.spec';
import { PersistencyService } from '../persistency/persistency.service';
import { CONVERSATION_ID,
  MOCKED_CONVERSATIONS,
  MOCK_CONVERSATION,
  createConversationsArray } from '../../../tests/conversation.fixtures.spec';
import { MockedPersistencyService } from '../../../tests/persistency.fixtures.spec';
import { XmppTimestampMessage, XmppBodyMessage } from './xmpp.interface';
import { TrackingService } from '../tracking/tracking.service';
import { MockTrackingService } from '../../../tests/tracking.fixtures.spec';
import { Observable } from 'rxjs/Observable';
import { MessagePayload } from '../message/messages.interface';
import { MOCK_PAYLOAD_KO,
  MOCK_PAYLOAD_OK,
  MOCK_MESSAGE,
  createMessagesArray,
  createReceiptsArray } from '../../../tests/message.fixtures.spec';
import { environment } from '../../../environments/environment';
import { UserService } from '../user/user.service';

let mamFirstIndex = '1899';
let mamCount = 1900;
let queryId = 'abcdef';
let userService: UserService;
const LAST_MESSAGE = 'second';
const FIRST_MESSAGE = 'first';
const MESSAGE_ID = 'messageId';
const MESSAGE_BODY = 'body';
const MOCK_SERVER_DATE: Date = new Date('Fri Oct 28 2016 11:50:29 GMT+0200 (CEST)');
const MESSAGE_DATE = '2016-10-17T09:04:49Z';

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
    full: 'from'
  },
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
      it('should reconnect the client if it is disconnected', () => {
        connectSpy.calls.reset();
        service.clientConnected = false;

        service.reconnectClient();

        expect(MOCKED_CLIENT.connect).toHaveBeenCalledTimes(1);
        expect(service.clientConnected).toBe(true);
      });
    });

    it('should emit a CLIENT_DISCONNECTED event when the Xmpp client is disconnected', () => {
      spyOn(eventService, 'emit').and.callThrough();

      eventService.emit('disconnected');

      expect(eventService.emit).toHaveBeenCalledWith(EventService.CLIENT_DISCONNECTED);
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

      eventService.emit('message', MOCKED_SERVER_MESSAGE);

      expect(service['sendMessageDeliveryReceipt']).toHaveBeenCalledWith(
        MOCKED_SERVER_MESSAGE.from,
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

  describe('searchHistory', () => {

    const THREAD = '12345';
    const getXmlMessage: any = (id: string, ref: string, receipt?: string, read?: any, payload?: MessagePayload) => {
      const data: any = {
        xml: {
          name: 'message',
          children: [{
            attrs: {
              queryid: queryId,
              id: ref
            },
            children: [{
              children: [{
                name: 'delay',
                attrs: {
                  stamp: MESSAGE_DATE
                }
              }, {
                name: 'message',
                attrs: {
                  id: id,
                  from: 'from',
                  to: 'to'
                },
                children: [{
                  name: 'thread',
                  children: [THREAD]
                }]
              }]
            }]
          }]
        }
      };
      if (!receipt) {
        data.xml.children[0].children[0].children[1].children.push({
          name: 'body',
          children: [MESSAGE_BODY]
        });
      } else {
        data.xml.children[0].children[0].children[1].children.push({
          name: 'received',
          attrs: {
            id: receipt
          }
        });
      }
      if (payload) {
        data.xml.children[0].children[0].children[1].children.push({
          name: 'payload',
          children: [payload]
        });
      }
      if (read) {
        data.xml.children[0].children[0].children[1].children.push({
          name: 'read',
          attrs: {
            xmlns: 'wallapop:thread:status'
          },
          parent: {
            children: [{
              children: [new Date()]
            }]
          }
        });
      }
      return data;
    };
    const MESSAGE_ID2 = 'message2';
    const MOCKED_MESSAGE_ID1 = {
      to: 'from',
      type: 'chat',
      thread: THREAD,
      received: {
        xmlns: 'urn:xmpp:receipts',
        id: MESSAGE_ID
      }
    };
    const MOCKED_MESSAGE_ID2 = {
      to: 'from',
      type: 'chat',
      thread: THREAD,
      received: {
        xmlns: 'urn:xmpp:receipts',
        id: MESSAGE_ID2
      }
    };

    beforeEach(() => {
      service.connect('1', 'abc');
      spyOn<any>(service, 'xmlToMessage').and.callThrough();
      mamCount = 1900;
      mamFirstIndex = '1899';
    });

    it('should call the sendIq with no thread and last message', fakeAsync(() => {
      service.searchHistory().subscribe();

      tick(2000);

      expect(MOCKED_CLIENT.sendIq).toHaveBeenCalledWith({
        type: 'get',
        from: MOCKED_LOGIN_USER + '@' + environment['xmppDomain'],
        mam: {
          thread: undefined,
          queryid: queryId,
          start: undefined,
          rsm: {
            max: 50,
            before: true
          }
        }
      });
    }));

    it('should call the sendIq with thread', fakeAsync(() => {
      service.searchHistory(THREAD).subscribe();

      tick(2000);

      expect(MOCKED_CLIENT.sendIq).toHaveBeenCalledWith({
        type: 'get',
        from: MOCKED_LOGIN_USER + '@' + environment['xmppDomain'],
        mam: {
          thread: THREAD,
          queryid: queryId,
          start: undefined,
          rsm: {
            max: 50,
            before: true
          }
        }
      });
    }));

    it('should call the sendIq with thread and before', fakeAsync(() => {
      service.searchHistory(THREAD, LAST_MESSAGE).subscribe();

      tick(2000);

      expect(MOCKED_CLIENT.sendIq).toHaveBeenCalledWith({
        type: 'get',
        from: MOCKED_LOGIN_USER + '@' + environment['xmppDomain'],
        mam: {
          thread: THREAD,
          queryid: queryId,
          start: undefined,
          rsm: {
            max: 50,
            before: LAST_MESSAGE
          }
        }
      });
    }));

    it('should call the sendIq with thread and after', fakeAsync(() => {
      service.searchHistory(THREAD, LAST_MESSAGE, MESSAGE_DATE).subscribe();

      tick(2000);

      expect(MOCKED_CLIENT.sendIq).toHaveBeenCalledWith({
        type: 'get',
        from: MOCKED_LOGIN_USER + '@' + environment['xmppDomain'],
        mam: {
          thread: THREAD,
          queryid: queryId,
          start: MESSAGE_DATE,
          rsm: {
            max: 50,
            after: LAST_MESSAGE
          }
        }
      });
    }));

    it('should call the sendIq with thread and after equal true', fakeAsync(() => {
      service.searchHistory(THREAD, null, MESSAGE_DATE).subscribe();

      tick(2000);

      expect(MOCKED_CLIENT.sendIq).toHaveBeenCalledWith({
        type: 'get',
        from: MOCKED_LOGIN_USER + '@' + environment['xmppDomain'],
        mam: {
          thread: THREAD,
          queryid: queryId,
          start: MESSAGE_DATE,
          rsm: {
            max: 50,
            after: true
          }
        }
      });
    }));

    it('should listen to stream:data event', () => {
      service.searchHistory().subscribe();
      const XML_MESSAGE: any = getXmlMessage(MESSAGE_ID, LAST_MESSAGE);

      eventService.emit('stream:data', XML_MESSAGE);

      expect(service['xmlToMessage']).toHaveBeenCalledWith(XML_MESSAGE.xml);
    });

    it('should return the response with data and meta', fakeAsync(() => {
      let response: any;
      const XML_MESSAGE: any = getXmlMessage(MESSAGE_ID, LAST_MESSAGE);
      service.searchHistory().subscribe((res: any) => {
        response = res;
      });

      eventService.emit('stream:data', XML_MESSAGE);
      tick(2000);

      expect(response.data).toBeDefined();
      expect(response.meta).toBeDefined();
    }));

    it('should return the response with one message in the array', fakeAsync(() => {
      let response: any;
      const XML_MESSAGE: any = getXmlMessage(MESSAGE_ID, LAST_MESSAGE);
      service.searchHistory().subscribe((res: any) => {
        response = res;
      });

      eventService.emit('stream:data', XML_MESSAGE);
      tick(2000);

      const message: Message = response.data[0];
      expect(response.data.length).toBe(1);
      expect(message instanceof Message).toBe(true);
      expect(message.id).toBe(MESSAGE_ID);
      expect(message.conversationId).toBe(THREAD);
      expect(message.message).toBe(MESSAGE_BODY);
      expect(message.date).toEqual(new Date(MESSAGE_DATE));
    }));

    it('should emit a NEW_MESSAGE event when stream:data is triggered with a message containing a body', fakeAsync(() => {
      spyOn<any>(service, 'onNewMessage');
      const XML_MESSAGE: any = getXmlMessage(MESSAGE_ID, LAST_MESSAGE);
      service.searchHistory().subscribe();

      eventService.emit('stream:data', XML_MESSAGE);
      tick(2000);

      expect(service['onNewMessage']).toHaveBeenCalled();
    }));

    it('should return the response with two messages in the array', fakeAsync(() => {
      let response: any;
      const XML_MESSAGE: any = getXmlMessage(MESSAGE_ID2, 'random');
      const XML_MESSAGE2: any = getXmlMessage(MESSAGE_ID, LAST_MESSAGE);
      service.searchHistory().subscribe((res: any) => {
        response = res;
      });

      eventService.emit('stream:data', XML_MESSAGE);
      eventService.emit('stream:data', XML_MESSAGE2);
      tick(2000);

      const message: Message = response.data[0];
      const message2: Message = response.data[1];
      expect(response.data.length).toBe(2);
      expect(message instanceof Message).toBe(true);
      expect(message.id).toBe(MESSAGE_ID2);
      expect(message2 instanceof Message).toBe(true);
      expect(message2.id).toBe(MESSAGE_ID);
    }));

    it('should return the response with empty array and default meta', fakeAsync(() => {
      let response: any;
      mamCount = 0;
      service.searchHistory().subscribe((res: any) => {
        response = res;
      });
      tick(2000);
      expect(response.data.length).toBe(0);
      expect(response.meta.first).toBe(null);
      expect(response.meta.last).toBe(null);
      expect(response.meta.end).toBe(true);
    }));

    it('should return the meta with end equal false when going backward', fakeAsync(() => {
      let response: any;
      const XML_MESSAGE: any = getXmlMessage(MESSAGE_ID, LAST_MESSAGE);
      service.searchHistory().subscribe((res: any) => {
        response = res;
      });

      eventService.emit('stream:data', XML_MESSAGE);
      tick(2000);

      expect(response.meta.end).toBe(false);
    }));

    it('should save the message in the database', fakeAsync(() => {
      let response: any;
      const XML_MESSAGE: any = getXmlMessage(MESSAGE_ID, 'Random');
      service.searchHistory().subscribe((res: any) => {
        response = res;
      });

      eventService.emit('stream:data', XML_MESSAGE);
      tick(2000);
    }));

    it('should return the meta with end equal true when going backward', fakeAsync(() => {
      let response: any;
      mamFirstIndex = '0';
      const XML_MESSAGE: any = getXmlMessage(MESSAGE_ID, LAST_MESSAGE);
      service.searchHistory().subscribe((res: any) => {
        response = res;
      });

      eventService.emit('stream:data', XML_MESSAGE);
      tick(2000);

      expect(response.meta.end).toBe(true);
    }));

    it('should return the meta with end equal false when going forward', fakeAsync(() => {
      let response: any;
      mamCount = 50;
      mamFirstIndex = '10';
      const XML_MESSAGE: any = getXmlMessage(MESSAGE_ID, LAST_MESSAGE);
      service.searchHistory(null, null, MESSAGE_DATE).subscribe((res: any) => {
        response = res;
      });

      eventService.emit('stream:data', XML_MESSAGE);
      eventService.emit('stream:data', XML_MESSAGE);
      eventService.emit('stream:data', XML_MESSAGE);
      tick(2000);

      expect(response.meta.end).toBe(false);
    }));

    it('should return the meta with end equal true when going forward with many messages', fakeAsync(() => {
      let response: any;
      mamCount = 50;
      mamFirstIndex = '47';
      const XML_MESSAGE: any = getXmlMessage(MESSAGE_ID, LAST_MESSAGE);
      service.searchHistory(null, null, MESSAGE_DATE).subscribe((res: any) => {
        response = res;
      });

      eventService.emit('stream:data', XML_MESSAGE);
      eventService.emit('stream:data', XML_MESSAGE);
      eventService.emit('stream:data', XML_MESSAGE);
      tick(2000);

      expect(response.meta.end).toBe(true);
    }));

    it('should return the meta with end equal true when going forward with one message', fakeAsync(() => {
      let response: any;
      mamCount = 1;
      mamFirstIndex = '0';
      const XML_MESSAGE: any = getXmlMessage(MESSAGE_ID, LAST_MESSAGE);
      service.searchHistory(null, null, MESSAGE_DATE).subscribe((res: any) => {
        response = res;
      });

      eventService.emit('stream:data', XML_MESSAGE);
      tick(2000);

      expect(response.meta.end).toBe(true);
    }));

    it('should return the meta.first and meta.last', fakeAsync(() => {
      let response: any;
      const XML_MESSAGE: any = getXmlMessage(MESSAGE_ID, LAST_MESSAGE);
      service.searchHistory().subscribe((res: any) => {
        response = res;
      });

      eventService.emit('stream:data', XML_MESSAGE);
      tick(2000);

      expect(response.meta.first).toBe(FIRST_MESSAGE);
      expect(response.meta.last).toBe(LAST_MESSAGE);
    }));

    it('should not parse data stream which is not a message', fakeAsync(() => {
      let response: any;
      mamCount = 0;
      service.searchHistory().subscribe((res: any) => {
        response = res;
      });

      eventService.emit('stream:data', {xml: 'test'});
      tick(2000);

      expect(response.data.length).toBe(0);
    }));

    it('should not parse data stream which is not a message with body', fakeAsync(() => {
      let response: any;
      service.searchHistory().subscribe((res: any) => {
        response = res;
      });

      eventService.emit('stream:data', {
        xml: {
          name: 'message',
          children: [{
            attrs: {
              queryid: queryId,
              id: LAST_MESSAGE
            },
            children: [{
              children: [{
                name: 'delay',
                attrs: {
                  stamp: MESSAGE_DATE
                }
              }, {
                name: 'message',
                attrs: {
                  id: '456',
                  from: 'from',
                  to: 'to'
                }
              }]
            }]
          }]
        }
      });
      tick(2000);

      expect(response.data.length).toBe(0);
    }));

    it('should add the message to receivedReceipts is if it is a message with receivedId', fakeAsync(() => {
      let response: any;
      const XML_MESSAGE: any = getXmlMessage(MESSAGE_ID, 'Random', 'receipt');
      service.searchHistory().subscribe((res: any) => {
        response = res;
      });

      eventService.emit('stream:data', XML_MESSAGE);
      tick(2000);

      expect(service.receivedReceipts.length).toBe(1);
    }));

    it('should add the message to readReceipts is if it is a message with read timestamp', fakeAsync(() => {
      let response: any;
      const XML_MESSAGE: any = getXmlMessage(MESSAGE_ID, 'Random', false, 'read');
      service.searchHistory().subscribe((res: any) => {
        response = res;
      });

      eventService.emit('stream:data', XML_MESSAGE);
      tick(2000);

      expect(service.readReceipts.length).toBe(1);
    }));

    it('should return the response with one message in the array if payload is in whitelist', fakeAsync(() => {
      let response: any;
      const XML_MESSAGE: any = getXmlMessage(MESSAGE_ID, LAST_MESSAGE, false, false, JSON.stringify(MOCK_PAYLOAD_OK));
      service.searchHistory().subscribe((res: any) => {
        response = res;
      });

      eventService.emit('stream:data', XML_MESSAGE);
      tick(2000);

      const message: Message = response.data[0];
      expect(response.data.length).toBe(1);
      expect(message instanceof Message).toBe(true);
      expect(message.id).toBe(MESSAGE_ID);
      expect(message.conversationId).toBe(THREAD);
      expect(message.message).toBe(MESSAGE_BODY);
      expect(message.date).toEqual(new Date(MESSAGE_DATE));
      expect(message.payload.type).toBe('review');
      expect(message.payload.text).toBe('text');
    }));

    it('should not parse data stream if payload is NOT in whitelist', fakeAsync(() => {
      let response: any;
      const XML_MESSAGE: any = getXmlMessage(MESSAGE_ID, LAST_MESSAGE, false, false,  JSON.stringify(MOCK_PAYLOAD_KO));
      service.searchHistory().subscribe((res: any) => {
        response = res;
      });

      eventService.emit('stream:data', XML_MESSAGE);
      tick(2000);

      expect(response.data.length).toBe(0);
    }));

    it('should set message status to received if the received signals have been received', fakeAsync(() => {
      spyOn<any>(service, 'messageFromSelf').and.returnValue(true);
      let response: any;
      const XML_MESSAGE: any = getXmlMessage(MESSAGE_ID2, 'random');
      const XML_MESSAGE_RECEIPT: any = getXmlMessage('receipt_id', 'random', MESSAGE_ID2);
      const XML_MESSAGE2: any = getXmlMessage(MESSAGE_ID, LAST_MESSAGE);
      const XML_MESSAGE2_RECEIPT: any = getXmlMessage('receipt_id2', 'random', MESSAGE_ID);
      service.searchHistory().subscribe((res: any) => {
        response = res;
      });

      eventService.emit('stream:data', XML_MESSAGE);
      eventService.emit('stream:data', XML_MESSAGE_RECEIPT);
      eventService.emit('stream:data', XML_MESSAGE2);
      eventService.emit('stream:data', XML_MESSAGE2_RECEIPT);
      tick(2000);

      expect(response.data.length).toBe(2);
      expect(response.data[0].status).toBe(messageStatus.RECEIVED);
      expect(response.data[1].status).toBe(messageStatus.RECEIVED);
      expect(service['confirmedMessages'].length).toBe(0);
    }));

    describe('when messages do not already exist in the locaDb', () => {
      beforeEach(() => {
        spyOn<any>(persistencyService, 'findMessage').and.returnValue(Observable.throw({reason: 'missing'}));
      });

      it('should send received confirmation for messages without receipt', fakeAsync(() => {
        let response: any;
        const XML_MESSAGE: any = getXmlMessage(MESSAGE_ID2, 'random');
        const XML_MESSAGE_RECEIPT: any = getXmlMessage('receipt_id', 'random', MESSAGE_ID2);
        const XML_MESSAGE2: any = getXmlMessage(MESSAGE_ID, LAST_MESSAGE);
        service.searchHistory().subscribe((res: any) => {
          response = res;
        });

        eventService.emit('stream:data', XML_MESSAGE);
        eventService.emit('stream:data', XML_MESSAGE_RECEIPT);
        eventService.emit('stream:data', XML_MESSAGE2);
        tick(2000);

        expect(MOCKED_CLIENT.sendMessage).toHaveBeenCalledTimes(2);
        expect(MOCKED_CLIENT.sendMessage).toHaveBeenCalledWith(MOCKED_MESSAGE_ID1);
        expect(response.data.length).toBe(2);
        expect(service['confirmedMessages'].length).toBe(0);
      }));

      it('should keep the not matched receipts in an array for further use', fakeAsync(() => {
        let response: any;
        const XML_MESSAGE: any = getXmlMessage(MESSAGE_ID2, 'random');
        const XML_MESSAGE_RECEIPT: any = getXmlMessage('receipt_id', 'random', MESSAGE_ID2);
        const XML_MESSAGE2_RECEIPT: any = getXmlMessage('receipt_id2', LAST_MESSAGE, MESSAGE_ID);
        service.searchHistory().subscribe((res: any) => {
          response = res;
        });

        eventService.emit('stream:data', XML_MESSAGE);
        eventService.emit('stream:data', XML_MESSAGE_RECEIPT);
        eventService.emit('stream:data', XML_MESSAGE2_RECEIPT);
        tick(2000);

        expect(MOCKED_CLIENT.sendMessage).toHaveBeenCalledWith(MOCKED_MESSAGE_ID2);
        expect(MOCKED_CLIENT.sendMessage).not.toHaveBeenCalledWith(MOCKED_MESSAGE_ID1);
        expect(response.data.length).toBe(1);
        expect(service['confirmedMessages'].length).toBe(1);
        expect(service['confirmedMessages'][0]).toBe(MESSAGE_ID);
      }));

      it('should match the receipt even if it is in another batch', fakeAsync(() => {
        let response: any;
        const XML_MESSAGE: any = getXmlMessage(MESSAGE_ID2, 'random');
        const XML_MESSAGE_RECEIPT: any = getXmlMessage('receipt_id', 'random', MESSAGE_ID2);
        const XML_MESSAGE2_RECEIPT: any = getXmlMessage('receipt_id2', LAST_MESSAGE, MESSAGE_ID);
        service.searchHistory().subscribe();

        eventService.emit('stream:data', XML_MESSAGE);
        eventService.emit('stream:data', XML_MESSAGE_RECEIPT);
        eventService.emit('stream:data', XML_MESSAGE2_RECEIPT);
        tick();

        expect(service['confirmedMessages'].length).toBe(1);
        expect(service['confirmedMessages'][0]).toBe(MESSAGE_ID);
        queryId = 'newqi';
        const XML_MESSAGE2: any = getXmlMessage(MESSAGE_ID, LAST_MESSAGE);
        service.searchHistory().subscribe((res: any) => {
          response = res;
        });

        eventService.emit('stream:data', XML_MESSAGE2);
        tick(2000);

        expect(MOCKED_CLIENT.sendMessage).toHaveBeenCalledTimes(2);
        expect(response.data.length).toBe(1);
        expect(service['confirmedMessages'].length).toBe(0);
      }));
    });

    it('should NOT send received confirmation for messages that already exists in the localDb', fakeAsync(() => {
      spyOn<any>(persistencyService, 'findMessage').and.returnValue(Observable.of({notAnError: 'true'}));
      let response: any;
      const XML_MESSAGE: any = getXmlMessage(MESSAGE_ID2, 'random');
      service.searchHistory().subscribe((res: any) => {
        response = res;
      });

      eventService.emit('stream:data', XML_MESSAGE);
      tick(2000);

      expect(MOCKED_CLIENT.sendMessage).not.toHaveBeenCalled();
    }));

  });

  describe('addUnreadMessagesCounter', () => {
    const thread = 'someThreadId';
    let conversations = [];

    beforeEach(() => {
      spyOn<any>(service, 'xmlToMessage').and.callThrough();
      conversations = createConversationsArray(5, false, thread);
      conversations.forEach((c, index) => {
        c.messages = createMessagesArray(5);
        c.messages.forEach(receipt => {
          receipt.thread = index + 1 + thread;
        });
      });
      service.connect('1', 'abc');
      service['unreadMessages'] = [
        conversations[0].messages[3], conversations[0].messages[4],
        conversations[1].messages[1],
        conversations[2].messages[2], conversations[2].messages[4], conversations[2].messages[3]
      ];
    });

    it('should update the counter of unreadMessages for receipts received', () => {
      const expectedResult = service.addUnreadMessagesCounter(conversations);

      expect(expectedResult[0].unreadMessages).toBe(2);
      expect(expectedResult[1].unreadMessages).toBe(1);
      expect(expectedResult[2].unreadMessages).toBe(3);
      expect(expectedResult[3].unreadMessages).toBe(0);
      expect(expectedResult[4].unreadMessages).toBe(0);
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
      expect(service['onNewMessage']).toHaveBeenCalledWith(message);
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
          to_user_id: MOCKED_CONVERSATIONS[0].user.id,
          item_id: MOCKED_CONVERSATIONS[0].item.id });
    });

    it('should track the MessageSent event', () => {
      spyOn(trackingService, 'track');

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

      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.MESSAGE_SENT,
        { thread_id: message.thread,
          message_id: message.id,
          to_user_id: MOCKED_CONVERSATIONS[0].user.id,
          item_id: MOCKED_CONVERSATIONS[0].item.id });
    });

    it('should send a new message with the true updateDate parameter', () => {
      spyOn<any>(service, 'onNewMessage').and.callThrough();

      service.connect(MOCKED_LOGIN_USER, MOCKED_LOGIN_PASSWORD);
      eventService.emit('message', MOCKED_SERVER_TIMESTAMP_MESSAGE, true);

      expect(service['onNewMessage']).toHaveBeenCalledWith(MOCKED_SERVER_TIMESTAMP_MESSAGE);
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

      expect(builtMessage.status).toBe(messageStatus.READ);
      expect(eventService.emit).toHaveBeenCalledWith(EventService.MESSAGE_READ, message.thread);
      expect(eventService.emit).toHaveBeenCalledTimes(1);
    });
  });

  describe('getLastReadTimestamps', () => {
    it('should add the receipt to the ownReadTimestamps when it received a receipt for a message fromSelf', () => {
      spyOn<any>(service, 'messageFromSelf').and.returnValue(true);
      const message1: any = MOCK_MESSAGE;
      const message2: any = MOCK_MESSAGE;
      message1.readTimestamp = message1.date;
      message1.thread = message1.conversationId;
      message2.readTimestamp = message2.date;
      message2.thread = message2.conversationId;
      service.readReceipts = [message1, message2];

      service.getLastReadTimestamps();

      expect(service['ownReadTimestamps'][message1.thread]).toEqual({
        thread: message1.thread,
        timestamp: new Date(message1.readTimestamp)
      });
    });

    it('should replace the existing receipt when a newer receipt is received for a message fromSelf', () => {
      spyOn<any>(service, 'messageFromSelf').and.returnValue(true);
      const messages = createReceiptsArray(2, 'someRandomThread');
      const olderDate = new Date('2015-12-12 13:00');
      const newerDate = new Date('2016-12-12 13:00');

      messages[0].readTimestamp = olderDate;
      messages[1].readTimestamp = newerDate;
      service.readReceipts = [messages[0], messages[1]];

      service.getLastReadTimestamps();

      expect(service['ownReadTimestamps'][messages[0].thread]).toEqual({
        thread: messages[0].thread,
        timestamp: newerDate
      });
    });

    it('should add the receipt to the readTimestamps when it receives a receipt for a message not fromSelf', () => {
      spyOn<any>(service, 'messageFromSelf').and.returnValue(false);
      const message1: any = MOCK_MESSAGE;
      const message2: any = MOCK_MESSAGE;
      message1.readTimestamp = message1.date;
      message1.thread = message1.conversationId;
      message2.readTimestamp = message2.date;
      message2.thread = message2.conversationId;
      service.readReceipts = [message1, message2];

      service.getLastReadTimestamps();

      expect(service['readTimestamps'][message1.thread]).toEqual({
        thread: message1.thread,
        timestamp: new Date(message1.readTimestamp)
      });
    });

    it('should replace the existing receipt when a newer receipt is received for a message NOT fromSelf', () => {
      spyOn<any>(service, 'messageFromSelf').and.returnValue(false);
      const messages = createReceiptsArray(2, 'someRandomThread');
      const olderDate = new Date('2015-12-12 13:00');
      const newerDate = new Date('2016-12-12 13:00');

      messages[0].readTimestamp = olderDate;
      messages[1].readTimestamp = newerDate;
      service.readReceipts = [messages[0], messages[1]];

      service.getLastReadTimestamps();

      expect(service['readTimestamps'][messages[0].thread]).toEqual({
        thread: messages[0].thread,
        timestamp: newerDate
      });
    });
  });

  describe('disconnect', () => {
    it('should disconnect', () => {
      spyOn(MOCKED_CLIENT, 'disconnect');
      service.connect('abc', 'def');
      service['_clientConnected'] = true;

      service.disconnect();

      expect(MOCKED_CLIENT.disconnect).toHaveBeenCalled();
      expect(service['_clientConnected']).toBe(false);
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
