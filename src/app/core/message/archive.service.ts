import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MsgArchiveResponse } from './messages.interface';
import { HttpService } from '../http/http.service';
import { Message, messageStatus } from './message';
import { User } from '../user/user';
import { UserService } from '../user/user.service';


@Injectable()
export class MsgArchiveService {

  protected API_URL = 'api/v3/events/chat';
  private eventTypes = {
    message: 'chat.message.created',
    received: 'chat.message.received',
    read: 'chat.conversation.read'
  };

  constructor(private http: HttpService,
              private userService: UserService) { }

  public getEventsSince(start: string): Observable<MsgArchiveResponse> {
    return this.getSince(start, []).first().map((r: any) => {
      const events = r.events;
      console.log(r.events.length);
      let messages = this.processMessages(events);
      const readReceipts = this.processReadReceipts(events);
      const receivedReceipts = this.processReceivedReceipts(events);
      messages = this.updateStatusOwnMsg(messages, readReceipts, receivedReceipts);

      const response = {
        messages: messages,
        receivedReceipts: receivedReceipts,
        readReceipts: readReceipts
      };

      return response;
    });
  }

  private getSince(since: string, events): Observable<any> {
    return this.http.get(this.API_URL, {
      since: since
    }).flatMap((r: any) => {
      const data = r.json();
      const nextPage = r.headers.get('x-nextpage');
      events = events.length ? events.concat(data) : data;

      if (nextPage) {
        const newSince = nextPage.split('since=')[1].split('&')[0];
        return this.getSince(newSince, events);
      }

      r.events = events;
      console.log('returning...', r.events.length);
      console.log(r.events);
      return Observable.of(r);
    });
  }

  public getAllEvents(start: string, thread: string): Observable<any> {
    // TODO - first archive
    return this.getAll(start, [], thread).first().map((r: any) => {
      const events = r.events;
      console.log(r.events.length);
      let messages = this.processMessages(events);
      const readReceipts = this.processReadReceipts(events);
      const receivedReceipts = this.processReceivedReceipts(events);
      messages = this.updateStatusOwnMsg(messages, readReceipts, receivedReceipts);

      const response = {
        messages: messages,
        receivedReceipts: receivedReceipts,
        readReceipts: readReceipts
      };

      return response;
    });
  }

  private getAll(since: string, events, thread: string): Observable<any> {
    return this.http.get(this.API_URL, {
      since: since,
      convesation_hash: thread
    }).flatMap((r: any) => {
      // TODO
      return Observable.of(r);
    });
  }

  private updateStatusOwnMsg(messages: Message[], readReceipts, receivedReceipts) {
    const self: User = this.userService.user;
    readReceipts.forEach(r => {
      messages.filter(m => {
        const threadRead = m.conversationId === r.thread;
        const olderThanReadTs = (m.date.getTime() / 1000 < r.timestamp);
        const msgFromSelf = m.from === self.id;
        return threadRead && olderThanReadTs && msgFromSelf;
      }).map(m => {
        // TODO - send read_ack (441) per message; - or should I?...
        m.status = messageStatus.READ;
        return m;
      });
    });

    receivedReceipts.forEach(r => {
      // TODO - send read_ack (442) per message;
      const msg = messages.find(m => m.id === r.messageId);
      if (msg && msg.status !== messageStatus.READ) {
        msg.status = messageStatus.RECEIVED;
      }
    });

    return messages;
  }

  private processMessages(archiveData: Array<any>) {
    const self: User = this.userService.user;
    return archiveData.filter((d) => d.type === this.eventTypes.message)
    .map(m => {
      const fromSelf = m.event.from_user_hash === self.id;
      const msg = new Message(m.event.message_id,
        m.event.conversation_hash,
        m.event.body,
        m.event.from_user_hash,
        new Date(m.event.created_ts * 1000),
        fromSelf ? messageStatus.SENT : messageStatus.RECEIVED);

      return msg;
    });

    // return _.uniqBy(result, 'messageId');
  }

  private processReceivedReceipts(archiveData: any) {
    const self: User = this.userService.user;
    let receipts = archiveData.filter((d) => d.type === this.eventTypes.received)
    .map(m => {
      const fromSelf = m.event.from_user_hash === self.id;
      const receipt = {
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

  private processReadReceipts(archiveData: any) {
    const self: User = this.userService.user;
    let receipts = [];
    archiveData.filter((r) => r.type === this.eventTypes.read && r.event.to_user_hash !== self.id)
    .map(m => {
      const toSelf = m.event.to_user_hash === self.id;
      const receipt = {
        thread: m.event.conversation_hash,
        to: m.event.to_user_hash,
        timestamp: m.event.created_ts
      };
      receipts.push(receipt);
    });
    receipts = this.returnLatestBy(receipts, 'thread');

    return receipts;
  }

}

