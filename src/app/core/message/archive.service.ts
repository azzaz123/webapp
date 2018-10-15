import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MsgArchiveResponse, ReceivedReceipt, ReadReceipt, ArchiveMetrics } from './archive.interface';
import { HttpService } from '../http/http.service';
import { Message, messageStatus } from './message';
import { UserService } from '../user/user.service';
import { EventService } from '../event/event.service';
import { Subscription } from 'rxjs/Subscription';
import { TrackingService } from '../tracking/tracking.service';
import { TrackingEventData } from '../tracking/tracking-event-base.interface';


@Injectable()
export class MsgArchiveService {

  protected API_URL = 'api/v3/events/chat';
  private pageSize = 100;
  private selfId: string;
  private eventTypes = {
    message: 'chat.message.created',
    received: 'chat.message.received',
    read: 'chat.conversation.read'
  };

  public firstArchiveMetrics = {} as ArchiveMetrics;
  public sinceArchiveMetrics = {} as ArchiveMetrics;
  private firstArchiveSubscription: Subscription;
  private sinceArchiveSubscription: Subscription;

  constructor(private http: HttpService,
              private eventService: EventService,
              private userService: UserService,
              protected trackingService: TrackingService) { }

  public getEventsSince(start: string): Observable<MsgArchiveResponse> {
    if (!this.sinceArchiveSubscription) {
      this.sinceArchiveSubscription = this.eventService.subscribe(EventService.MSG_ARCHIVE_LOADED, () => {
        this.sinceArchiveMetrics = this.calculateMetrics(this.sinceArchiveMetrics);
        if (this.sinceArchiveMetrics.downloadingTime) {
          const trackEvent: TrackingEventData = {
            eventData: TrackingService.CONVERSATION_SINCEARCHIVE_OK,
            attributes: {
              processing_time: this.sinceArchiveMetrics.processingTime,
              downloading_time: this.sinceArchiveMetrics.downloadingTime,
              number_of_messages: this.sinceArchiveMetrics.eventsCount,
              number_of_page_elems: this.pageSize
            }
          };
          this.trackingService.addTrackingEvent(trackEvent);
        }
        this.sinceArchiveMetrics = {} as ArchiveMetrics;
      });
    }
    this.selfId = this.userService.user.id;
    return this.getSince(start).first().map((r: any) => {
      const events = r.events;
      let messages = this.processMessages(events);
      const readReceipts = this.processReadReceipts(events);
      const receivedReceipts = this.processReceivedReceipts(events);
      messages = this.updateStatuses(messages, readReceipts, receivedReceipts);

      const response = {
        messages: messages,
        receivedReceipts: receivedReceipts,
        readReceipts: readReceipts,
        metaDate: events.length ? _.last(events).ts : '0'
      };
      return response;
    });
  }

  private getSince(since: string, events?: Array<any>): Observable<any> {
    const nanoTimestamp = since.indexOf('.') === 10 || since === '0' ? since : (new Date(since).getTime() / 1000) + '000';
    this.addMetric(this.sinceArchiveMetrics, 'startDownloadTs', Date.now());
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
      this.addMetric(this.sinceArchiveMetrics, 'endDownloadTs', Date.now(), true);
      this.sinceArchiveMetrics.eventsCount = this.sinceArchiveMetrics.eventsCount
        ? this.sinceArchiveMetrics.eventsCount + events.length
        : events.length;
      return Observable.of(r);
    });
  }

  public getAllEvents(thread: string, since: string = '0'): Observable<MsgArchiveResponse> {
    if (!this.firstArchiveSubscription) {
      this.firstArchiveSubscription = this.eventService.subscribe(EventService.MSG_ARCHIVE_LOADED, () => {
        this.firstArchiveMetrics = this.calculateMetrics(this.firstArchiveMetrics);
        if (this.firstArchiveMetrics.downloadingTime) {
          const trackEvent: TrackingEventData = {
            eventData: TrackingService.CONVERSATION_FIRSTARCHIVE_OK,
            attributes: {
              processing_time: this.firstArchiveMetrics.processingTime,
              downloading_time: this.firstArchiveMetrics.downloadingTime,
              number_of_messages: this.firstArchiveMetrics.eventsCount,
              number_of_page_elems: this.pageSize
            }
          };
          this.trackingService.addTrackingEvent(trackEvent);
        }
        this.firstArchiveMetrics = {} as ArchiveMetrics;
      });
    }
    this.selfId = this.userService.user.id;
    return this.getAll(thread, since).first().map((r: any) => {
      const events = r.events;
      let messages = this.processMessages(events);
      const readReceipts = this.processReadReceipts(events);
      const receivedReceipts = this.processReceivedReceipts(events);
      messages = this.updateStatuses(messages, readReceipts, receivedReceipts);

      const response: MsgArchiveResponse = {
        messages: messages,
        receivedReceipts: receivedReceipts,
        readReceipts: readReceipts,
        metaDate: events.length ? _.last(events).ts : '0'
      };

      return response;
    });
  }

  private getAll(thread: string, since: string, events?: Array<any>): Observable<any> {
    const nanoTimestamp = since.indexOf('.') === 10 || since === '0' ? since : (new Date(since).getTime() / 1000) + '000';
    this.addMetric(this.firstArchiveMetrics, 'startDownloadTs', Date.now());
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
      this.addMetric(this.firstArchiveMetrics, 'endDownloadTs', Date.now(), true);
      this.firstArchiveMetrics.eventsCount = this.firstArchiveMetrics.eventsCount
        ? this.firstArchiveMetrics.eventsCount + events.length
        : events.length;
      return Observable.of(r);
    });
  }

  public updateStatuses(messages: Message[], readReceipts: ReadReceipt[], receivedReceipts: ReceivedReceipt[]) {
    readReceipts.forEach(r => {
      messages.filter(m => {
        const threadMatches = m.conversationId === r.thread;
        const senderMatches = m.from === r.to;
        const olderThanReadTs = ((new Date(m.date)).getTime() / 1000 <= r.timestamp);
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

    this.addMetric(this.firstArchiveMetrics, 'endProcessTs', Date.now(), true, Boolean(this.firstArchiveMetrics.startDownloadTs));
    this.addMetric(this.sinceArchiveMetrics, 'endProcessTs', Date.now(), true, Boolean(this.sinceArchiveMetrics.startDownloadTs));
    return messages;
  }

  private processMessages(archiveData: Array<any>) {
    this.addMetric(this.firstArchiveMetrics, 'startProcessTs', Date.now(), false, Boolean(this.firstArchiveMetrics.startDownloadTs));
    this.addMetric(this.sinceArchiveMetrics, 'startProcessTs', Date.now(), false, Boolean(this.sinceArchiveMetrics.startDownloadTs));
    let messages = archiveData.filter((d) => d.type === this.eventTypes.message)
    .map(m => {
      const fromSelf = m.event.from_user_hash === this.selfId;
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
    let receipts = archiveData.filter((d) => d.type === this.eventTypes.received)
    .map(m => {
      const fromSelf = m.event.from_user_hash === this.selfId;
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
    const receipts = [];
    const sentByMe = _.findLast(archiveData, (r) => r.type === this.eventTypes.read && r.event.to_user_hash !== this.selfId);
    const sentToMe = _.findLast(archiveData, (r) => r.type === this.eventTypes.read && r.event.to_user_hash === this.selfId);

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

  private calculateMetrics(metricsObj: ArchiveMetrics) {
    if (metricsObj.startDownloadTs) {
      metricsObj.downloadingTime = metricsObj.endDownloadTs - metricsObj.startDownloadTs;
      metricsObj.processingTime = metricsObj.endProcessTs - metricsObj.startProcessTs;
    }
    delete metricsObj.startDownloadTs;
    delete metricsObj.endDownloadTs;
    delete metricsObj.startProcessTs;
    delete metricsObj.endProcessTs;
    return metricsObj;
  }

  private addMetric(addTo: ArchiveMetrics, metricName: string, value: any, allowOverwrite = false, condition = true) {
    if ((allowOverwrite || !addTo[metricName]) && condition) {
      addTo[metricName] = value;
    }
  }
}
