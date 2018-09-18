import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MsgArchiveResponse, ReceivedReceipt, ReadReceipt } from './archive.interface';
import { HttpService } from '../http/http.service';
import { Message, messageStatus } from './message';
import { User } from '../user/user';
import { UserService } from '../user/user.service';


@Injectable()
export class MsgArchiveService {

  protected API_URL = 'api/v3/events/chat';
  private pageSize = 100;
  private eventTypes = {
    message: 'chat.message.created',
    received: 'chat.message.received',
    read: 'chat.conversation.read'
  };

  constructor(private http: HttpService,
              private userService: UserService) { }

  public getEventsSince(start: string): Observable<MsgArchiveResponse> {
    return this.getSince(start).first().map((r: any) => {
      const events = r.events;
      let messages = this.processMessages(events);
      const readReceipts = this.processReadReceipts(events);
      const receivedReceipts = this.processReceivedReceipts(events);
      messages = this.updateStatuses(messages, readReceipts, receivedReceipts);

      const response = {
        messages: messages,
        receivedReceipts: receivedReceipts,
        readReceipts: readReceipts
      };
      return response;
    });
  }

  private getSince(since: string, events?: Array<any>): Observable<any> {
    const nanoTimestamp = since.indexOf('.') === 10 || since === '0' ? since : (new Date(since).getTime() / 1000) + '000';
    return this.http.get(this.API_URL, {
      since: nanoTimestamp,
      'page-size': this.pageSize
    }).flatMap((r: any) => {
      const data = r.json();
      const nextPage = r.headers.get('x-nextpage');
      events = events && events.length ? events.concat(data) : data;

      if (nextPage) {
        if (nextPage.indexOf('since=') > -1) {
        const newSince = nextPage.split('since=')[1].split('&')[0];
        return this.getSince(newSince, events);
      }
      }

      r.events = events;
      return Observable.of(r);
    });
  }

  public getAllEvents(thread: string, since?: string): Observable<MsgArchiveResponse> {
    return this.getAll(thread, since).first().map((r: any) => {
      const events = r.events;
      let messages = this.processMessages(events);
      const readReceipts = this.processReadReceipts(events);
      const receivedReceipts = this.processReceivedReceipts(events);
      messages = this.updateStatuses(messages, readReceipts, receivedReceipts);

      const response: MsgArchiveResponse = {
        messages: messages,
        receivedReceipts: receivedReceipts,
        readReceipts: readReceipts
      };

      return response;
    });
  }

  private getAll(thread: string, since: string, events?: Array<any>): Observable<any> {
    const nanoTimestamp = since.indexOf('.') === 10 || since === '0' ? since : (new Date(since).getTime() / 1000) + '000';
    return this.http.get(this.API_URL, {
      since: nanoTimestamp,
      'page-size': this.pageSize,
      conversation_hash: thread
    }).flatMap((r: any) => {
      const data = r.json();
      const nextPage = r.headers.get('x-nextpage');
      events = events && events.length ? events.concat(data) : data;

      if (nextPage) {
        const newSince = nextPage.split('since=')[1].split('&')[0];
        return this.getAll(thread, newSince, events);
      }

      r.events = events;
      return Observable.of(r);
    });
  }

  private updateStatuses(messages: Message[], readReceipts: ReadReceipt[], receivedReceipts: ReceivedReceipt[]) {
    readReceipts.forEach(r => {
      messages.filter(m => {
        const threadMatches = m.conversationId === r.thread;
        const senderMatches = m.from === r.to;
        const olderThanReadTs = (m.date.getTime() / 1000 <= r.timestamp);
        return threadMatches && olderThanReadTs && senderMatches;
      })
      .map(m => {
        m.status = messageStatus.READ;
        return m;
      });
    });

    receivedReceipts.forEach(r => {
      const msg = messages.find(m => m.id === r.messageId);
      if (msg && msg.status !== messageStatus.READ) {
        msg.status = messageStatus.RECEIVED;
      }
    });

    return messages;
  }

  private processMessages(archiveData: Array<any>) {
    const self: User = this.userService.user;
    let messages = archiveData.filter((d) => d.type === this.eventTypes.message)
    .map(m => {
      const fromSelf = m.event.from_user_hash === self.id;
      const msg = new Message(m.event.message_id,
        m.event.conversation_hash,
        m.event.body,
        m.event.from_user_hash,
        new Date(m.event.created_ts * 1000),
        fromSelf ? messageStatus.SENT : messageStatus.RECEIVED);
        msg.fromSelf = fromSelf;

      return msg;
    });

    messages = _.sortBy(messages, 'date');
    return messages;
  }

  private processReceivedReceipts(archiveData: any): Array<ReceivedReceipt> {
    const self: User = this.userService.user;
    let receipts = archiveData.filter((d) => d.type === this.eventTypes.received)
    .map(m => {
      const fromSelf = m.event.from_user_hash === self.id;
      const receipt: ReceivedReceipt = {
        thread: m.event.conversation_hash,
        messageId: m.event.message_id,
        from: m.event.from_user_hash,
        to: m.event.to_user_hash,
        fromSelf: fromSelf,
        timestamp: m.event.created_ts
      };
      return receipt;
    });
    receipts = this.returnLatestBy(receipts, 'messageId');
    return receipts;
  }

  private returnLatestBy(dataSet: any, uniqueBy: string) {
    const result = [];
    const obj = _.groupBy(dataSet, uniqueBy);
    Object.keys(obj).map((thread) => {
      result.push(_.last(obj[thread]));
    });

    return result;
  }

  private processReadReceipts(archiveData: any): Array<ReadReceipt> {
    const self: User = this.userService.user;
    const receipts = [];
    const sentByMe = _.findLast(archiveData, (r) => r.type === this.eventTypes.read && r.event.to_user_hash !== self.id);
    const sentToMe = _.findLast(archiveData, (r) => r.type === this.eventTypes.read && r.event.to_user_hash === self.id);

    sentByMe ? receipts.push(sentByMe) : receipts.push();
    sentToMe ? receipts.push(sentToMe) : receipts.push();

    return receipts.map(m => {
      const receipt: ReadReceipt = {
        thread: m.event.conversation_hash,
        to: m.event.to_user_hash,
        timestamp: m.event.created_ts
      };
      return receipt;
    });
  }
}
