import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MsgArchiveService } from './archive.service';
import { HttpService } from '../http/http.service';
import { Response, ResponseOptions, Headers } from '@angular/http';
import { MockedUserService, OTHER_USER_ID, USER_ID } from '../../../tests/user.fixtures.spec';
import { UserService } from '../user/user.service';
import { Observable } from 'rxjs';
import { createMockMessageEvents, createMockReceivedEvents, createMockReadEvents } from '../../../tests/archive.fixture.spec';
import { MsgArchiveResponse } from './archive.interface';
import { Message } from './message';
import { CONVERSATION_ID } from '../../../tests/conversation.fixtures.spec';
import { TrackingService } from '../tracking/tracking.service';
import { EventService } from '../event/event.service';
import { MockTrackingService } from '../../../tests/tracking.fixtures.spec';
import { MessageStatus } from '../../chat/model';

let service: MsgArchiveService;
let http: HttpService;
let userSerice: UserService;
let trackingService: TrackingService;
let eventService: EventService;

const API_URL = 'api/v3/events/chat';
const pageSize = 100;

const severMessagesFromOther: Array<any> = [{
  event: {
    body: 'msg1',
    conversation_hash: CONVERSATION_ID,
    created_ts: '1535979320.000000',
    from_user_hash: OTHER_USER_ID,
    message_id: '1',
    to_user_hash: USER_ID,
    type: 'message'
  },
  id: '1',
  ts: '1535979320.100000',
  type: 'chat.message.created'
},
{
  event: {
    body: 'msg2',
    conversation_hash: CONVERSATION_ID,
    created_ts: '1535979321.000000',
    from_user_hash: OTHER_USER_ID,
    message_id: '2',
    to_user_hash: USER_ID,
    type: 'message'
  },
  id: '2',
  ts: '1535979321.100000',
  type: 'chat.message.created'
},
{
  event: {
    body: 'msg3',
    conversation_hash: CONVERSATION_ID,
    created_ts: '1535979322.000000',
    from_user_hash: OTHER_USER_ID,
    message_id: '3',
    to_user_hash: USER_ID,
    type: 'message'
  },
  id: '3',
  ts: '1535979322.100000',
  type: 'chat.message.created'
}];

const severMessagesFromSelf: Array<any> = [{
  event: {
    body: 'msg1',
    conversation_hash: CONVERSATION_ID,
    created_ts: '1535979320.000000',
    from_user_hash: USER_ID,
    message_id: '1',
    to_user_hash: OTHER_USER_ID,
    type: 'message'
  },
  id: '1',
  ts: '1535979320.100000',
  type: 'chat.message.created'
},
{
  event: {
    body: 'msg2',
    conversation_hash: CONVERSATION_ID,
    created_ts: '1535979321.000000',
    from_user_hash: USER_ID,
    message_id: '2',
    to_user_hash: OTHER_USER_ID,
    type: 'message'
  },
  id: '2',
  ts: '1535979321.100000',
  type: 'chat.message.created'
},
{
  event: {
    body: 'msg3',
    conversation_hash: CONVERSATION_ID,
    created_ts: '1535979322.000000',
    from_user_hash: USER_ID,
    message_id: '3',
    to_user_hash: OTHER_USER_ID,
    type: 'message'
  },
  id: '3',
  ts: '1535979322.100000',
  type: 'chat.message.created'
}];

describe('MsgArchiveService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MsgArchiveService,
        EventService,
        { provide: TrackingService, useClass: MockTrackingService },
        { provide: HttpService, useValue: { get() { } } },
        { provide: UserService, useClass: MockedUserService }
      ]
    });

    service = TestBed.get(MsgArchiveService);
    http = TestBed.get(HttpService);
    userSerice = TestBed.get(UserService);
    trackingService = TestBed.get(TrackingService);
    eventService = TestBed.get(EventService);
  });

  describe('getAllEvents', () => {
    it('should make a get request to the chat endpoint with the correct parameters', () => {
      spyOn(http, 'get').and.returnValue(Observable.of({}));
      service.getAllEvents('mockThreadId');

      expect(http.get).toHaveBeenCalledWith(API_URL, new Object({ since: '0', 'page-size': pageSize, 'conversation_hash': 'mockThreadId' }));
    });

    it('should make more http.get requests if the header returns a x-nextpage since value', () => {
      const nextPageTimestamp = '1234567890.000000';
      const res: ResponseOptions = new ResponseOptions({
        body: JSON.stringify(createMockMessageEvents(3)),
        headers: new Headers({ 'x-nextpage': 'since=' + nextPageTimestamp })
      });
      const res2: ResponseOptions = new ResponseOptions({
        body: JSON.stringify({}),
        headers: new Headers({})
      });
      spyOn(http, 'get').and.returnValues(Observable.of(new Response(res)), Observable.of(new Response(res2)));

      service.getAllEvents('mockThreadId').subscribe();

      expect(http.get).toHaveBeenCalledWith(API_URL, new Object({ since: '0', 'page-size': pageSize, 'conversation_hash': 'mockThreadId' }));
      expect(http.get).toHaveBeenCalledWith(API_URL, new Object({ since: nextPageTimestamp, 'page-size': pageSize, 'conversation_hash': 'mockThreadId' }));
    });

    it('should process and add each message returned by the get request into response.messages', fakeAsync(() => {
      const expectedMessages = createMockMessageEvents(12);
      const res: ResponseOptions = new ResponseOptions({ body: JSON.stringify(expectedMessages), headers: new Headers({}) });
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));
      let response: MsgArchiveResponse;

      service.getAllEvents('mockThreadId').subscribe(r => response = r);
      tick();

      expectedMessages.forEach(m => {
        const msgInResponse = response.messages.find(msg => msg.id === m.event.message_id);
        expect(msgInResponse instanceof Message).toBe(true);
      });
      expect(response.messages.length).toBe(expectedMessages.length);
    }));

    it(`should set the status to RECEIVED for all messages that are NOT fromSelf and SENT for messages fromSelf,
    before processig receipts`, fakeAsync(() => {
        const messages = createMockMessageEvents(6);
        const res: ResponseOptions = new ResponseOptions({ body: JSON.stringify(messages), headers: new Headers({}) });
        spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));
        let response: MsgArchiveResponse;

        service.getAllEvents('mockThreadId').subscribe(r => response = r);
        tick();

        response.messages.map(m => {
          m.fromSelf ? expect(m.status).toBe(MessageStatus.SENT) : expect(m.status).toBe(MessageStatus.RECEIVED);
        });
      }));

    it(`should set fromSelf to FALSE and the status to RECEIVED for messages that are from third voice (have a payload)`, fakeAsync(() => {
        const messages = createMockMessageEvents(1);
        messages[0].event.payload = JSON.stringify({
          text: 'someText',
          type: 'someType'
        });
        const res: ResponseOptions = new ResponseOptions({ body: JSON.stringify(messages), headers: new Headers({}) });
        spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));
        let response: MsgArchiveResponse;

        service.getAllEvents('mockThreadId').subscribe(r => response = r);
        tick();

        expect(response.messages[0].fromSelf).toBe(false);
        expect(response.messages[0].status).toBe(MessageStatus.RECEIVED);
      }));

    describe('process receivedReceipts', () => {
      const expectedReceivedReceipts = createMockReceivedEvents(5);
      const duplicatedEvents = expectedReceivedReceipts.concat(expectedReceivedReceipts);
      const res: ResponseOptions = new ResponseOptions({ body: JSON.stringify(duplicatedEvents), headers: new Headers({}) });

      it('should process and add ONLY unique receivedReceipts returned by the get request into response.receivedReceipts', fakeAsync(() => {
        spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));
        let response: MsgArchiveResponse;

        service.getAllEvents('mockThreadId').subscribe(r => response = r);
        tick();

        expectedReceivedReceipts.forEach(m => {
          const receiptCount = response.receivedReceipts.filter(msg => msg.messageId === m.event.message_id).length;
          expect(receiptCount).toBe(1);
        });
        expect(response.receivedReceipts.length).toBe(expectedReceivedReceipts.length);
      }));
    });

    describe('process readReceipts', () => {
      const allReadReceipts = createMockReadEvents(10);
      const res: ResponseOptions = new ResponseOptions({ body: JSON.stringify(allReadReceipts), headers: new Headers({}) });
      let response: MsgArchiveResponse;
      let readReceiptFromSelf;
      let readReceiptFromOther;

      beforeEach(fakeAsync(() => {
        spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));

        service.getAllEvents('mockThreadId').subscribe(r => response = r);
        tick();

        readReceiptFromSelf = response.readReceipts.filter(r => r.to === OTHER_USER_ID);
        readReceiptFromOther = response.readReceipts.filter(r => r.to === USER_ID);
      }));

      it('should add only the latest readReceipt from self to the response', () => {
        allReadReceipts.filter(m => m.event.to_user_hash === OTHER_USER_ID).map(ev => {
          expect(readReceiptFromSelf[0].timestamp).toBeGreaterThanOrEqual(Number(ev.event.created_ts));
        });
        expect(readReceiptFromSelf.length).toBe(1);
      });

      it('should add only the latest readReceipt from other to the response', () => {
        allReadReceipts.filter(m => m.event.to_user_hash === USER_ID).map(ev => {
          expect(readReceiptFromOther[0].timestamp).toBeGreaterThanOrEqual(Number(ev.event.created_ts));
        });
        expect(readReceiptFromOther.length).toBe(1);
      });
    });
  });

  describe('getEventsSince', () => {
    const timestamp = (new Date('2018-10-01')).toISOString();
    const nanoTimestamp = (new Date(timestamp).getTime() / 1000) + '000';

    it('should make a get request to the chat endpoint with the correct parameters', () => {
      spyOn(http, 'get').and.returnValue(Observable.of({}));
      service.getEventsSince(timestamp);

      expect(http.get).toHaveBeenCalledWith(API_URL, new Object({ since: nanoTimestamp, 'page-size': pageSize }));
    });

    it('should make more http.get requests if the header returns a x-nextpage since value', () => {
      const nextPageTimestamp = '1234567890.000000';
      const res: ResponseOptions = new ResponseOptions({
        body: JSON.stringify(createMockMessageEvents(3)),
        headers: new Headers({ 'x-nextpage': 'since=' + nextPageTimestamp })
      });
      const res2: ResponseOptions = new ResponseOptions({
        body: JSON.stringify({}),
        headers: new Headers({})
      });
      spyOn(http, 'get').and.returnValues(Observable.of(new Response(res)), Observable.of(new Response(res2)));

      service.getEventsSince(timestamp).subscribe();

      expect(http.get).toHaveBeenCalledWith(API_URL, new Object({ since: nanoTimestamp, 'page-size': pageSize }));
      expect(http.get).toHaveBeenCalledWith(API_URL, new Object({ since: nextPageTimestamp, 'page-size': pageSize }));
    });

    it('should process and add each message returned by the get request into response.messages', fakeAsync(() => {
      const expectedMessages = createMockMessageEvents(12);
      const res: ResponseOptions = new ResponseOptions({ body: JSON.stringify(expectedMessages), headers: new Headers({}) });
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));
      let response: MsgArchiveResponse;

      service.getEventsSince(timestamp).subscribe(r => response = r);
      tick();

      expectedMessages.forEach(m => {
        const msgInResponse = response.messages.find(msg => msg.id === m.event.message_id);
        expect(msgInResponse instanceof Message).toBe(true);
      });
      expect(response.messages.length).toBe(expectedMessages.length);
    }));

    it(`should set the status to RECEIVED for all messages that are NOT fromSelf nd SENT for messages fromSelf,
    before processig receipts`, fakeAsync(() => {
      const messages = createMockMessageEvents(6);
      const res: ResponseOptions = new ResponseOptions({ body: JSON.stringify(messages), headers: new Headers({}) });
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));
      let response: MsgArchiveResponse;

      service.getEventsSince(timestamp).subscribe(r => response = r);
      tick();

      response.messages.map(m => {
        m.fromSelf ? expect(m.status).toBe(MessageStatus.SENT) : expect(m.status).toBe(MessageStatus.RECEIVED);
      });
    }));

    describe('process receivedReceipts', () => {
      const expectedReceivedReceipts = createMockReceivedEvents(5);
      const duplicatedEvents = expectedReceivedReceipts.concat(expectedReceivedReceipts);
      const res: ResponseOptions = new ResponseOptions({ body: JSON.stringify(duplicatedEvents), headers: new Headers({}) });

      it('should process and add ONLY unique receivedReceipts returned by the get request into response.receivedReceipts', fakeAsync(() => {
        spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));
        let response: MsgArchiveResponse;

        service.getEventsSince('0').subscribe(r => response = r);
        tick();

        expectedReceivedReceipts.forEach(m => {
          const receiptCount = response.receivedReceipts.filter(msg => msg.messageId === m.event.message_id).length;
          expect(receiptCount).toBe(1);
        });
        expect(response.receivedReceipts.length).toBe(expectedReceivedReceipts.length);
      }));
    });

    describe('process readReceipts', () => {
      const allReadReceipts = createMockReadEvents(10);
      const res: ResponseOptions = new ResponseOptions({ body: JSON.stringify(allReadReceipts), headers: new Headers({}) });
      let response: MsgArchiveResponse;
      let readReceiptFromSelf;
      let readReceiptFromOther;

      beforeEach(fakeAsync(() => {
        spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));

        service.getEventsSince('0').subscribe(r => response = r);
        tick();

        readReceiptFromSelf = response.readReceipts.filter(r => r.to === OTHER_USER_ID);
        readReceiptFromOther = response.readReceipts.filter(r => r.to === USER_ID);
      }));

      it('should add only the latest readReceipt from self to the response', () => {
        allReadReceipts.filter(m => m.event.to_user_hash === OTHER_USER_ID).map(ev => {
          expect(readReceiptFromSelf[0].timestamp).toBeGreaterThanOrEqual(Number(ev.event.created_ts));
        });
        expect(readReceiptFromSelf.length).toBe(1);
      });

      it('should add only the latest readReceipt from other to the response', () => {
        allReadReceipts.filter(m => m.event.to_user_hash === USER_ID).map(ev => {
          expect(readReceiptFromOther[0].timestamp).toBeGreaterThanOrEqual(Number(ev.event.created_ts));
        });
        expect(readReceiptFromOther.length).toBe(1);
      });
    });
  });

  describe('updateStatuses', () => {
    it(`should update the status of messages fromSelf to RECEIVED, when the server response includes a
    corresponding receipt`, fakeAsync(() => {
      const receivedEvent = [{
        event: {
          conversation_hash: CONVERSATION_ID,
          created_ts: severMessagesFromSelf[0].event.created_ts,
          from_user_hash: OTHER_USER_ID,
          message_id: severMessagesFromSelf[0].event.message_id,
          to_user_hash: USER_ID
        },
        id: severMessagesFromSelf[0].event.message_id,
        ts: severMessagesFromSelf[0].ts,
        type: 'chat.message.received'
      }];
      const serverResponse = severMessagesFromSelf.concat(receivedEvent);
      const res: ResponseOptions = new ResponseOptions({ body: JSON.stringify(serverResponse), headers: new Headers({}) });
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));
      let response: MsgArchiveResponse;

      service.getEventsSince('0').subscribe(r => response = r);
      tick();

      expect(response.messages[0].status).toBe(MessageStatus.RECEIVED);
      expect(response.messages[1].status).toBe(MessageStatus.SENT);
      expect(response.messages[2].status).toBe(MessageStatus.SENT);
    }));

    it(`should update the status of messages fromSelf to READ, for messages with a timestamp prior or equal to
    the read receipt timestamp`, fakeAsync(() => {
      const readReceipt = [{
        event: {
          conversation_hash: CONVERSATION_ID,
          created_ts: severMessagesFromSelf[1].event.created_ts,
          to_user_hash: USER_ID
        },
        id: '1',
        ts: severMessagesFromSelf[1].event.created_ts,
        type: 'chat.conversation.read'
      }];
      const serverResponse = severMessagesFromSelf.concat(readReceipt);
      const res: ResponseOptions = new ResponseOptions({ body: JSON.stringify(serverResponse), headers: new Headers({}) });
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));
      let response: MsgArchiveResponse;

      service.getEventsSince('0').subscribe(r => response = r);
      tick();

      expect(response.messages[0].status).toBe(MessageStatus.READ);
      expect(response.messages[1].status).toBe(MessageStatus.READ);
      expect(response.messages[2].status).toBe(MessageStatus.SENT);
    }));

    it(`should update the status of messages NOT fromSelf to READ, for messages with a timestamp prior or equal to
    the read receipt timestamp`, fakeAsync(() => {
      const readReceipt = [{
        event: {
          conversation_hash: CONVERSATION_ID,
          created_ts: severMessagesFromOther[0].event.created_ts,
          to_user_hash: OTHER_USER_ID
        },
        id: '1',
        ts: severMessagesFromOther[1].event.created_ts,
        type: 'chat.conversation.read'
      }];
      const serverResponse = severMessagesFromOther.concat(readReceipt);
      const res: ResponseOptions = new ResponseOptions({ body: JSON.stringify(serverResponse), headers: new Headers({}) });
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));
      let response: MsgArchiveResponse;

      service.getEventsSince('0').subscribe(r => response = r);
      tick();

      expect(response.messages[0].status).toBe(MessageStatus.READ);
      expect(response.messages[1].status).toBe(MessageStatus.RECEIVED);
      expect(response.messages[2].status).toBe(MessageStatus.RECEIVED);
    }));

    it(`should update the status of messages from third voice (with payload) to READ, for messages with a timestamp prior or equal to
    the read receipt timestamp`, fakeAsync(() => {
      const readReceipt = [{
        event: {
          conversation_hash: CONVERSATION_ID,
          created_ts: severMessagesFromOther[0].event.created_ts,
          to_user_hash: OTHER_USER_ID,
          payload: {
            text: 'someText',
            type: 'someType'
          }
        },
        id: '1',
        ts: severMessagesFromOther[1].event.created_ts,
        type: 'chat.conversation.read'
      }];
      const serverResponse = severMessagesFromOther.concat(readReceipt);
      const res: ResponseOptions = new ResponseOptions({ body: JSON.stringify(serverResponse), headers: new Headers({}) });
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));
      let response: MsgArchiveResponse;

      service.getEventsSince('0').subscribe(r => response = r);
      tick();

      expect(response.messages[0].status).toBe(MessageStatus.READ);
      expect(response.messages[1].status).toBe(MessageStatus.RECEIVED);
      expect(response.messages[2].status).toBe(MessageStatus.RECEIVED);
    }));
  });

});
