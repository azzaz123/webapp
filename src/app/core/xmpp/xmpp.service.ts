import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { Message, messageStatus } from '../message/message';
import { EventService } from '../event/event.service';
import { Observable } from 'rxjs/Observable';
import { PersistencyService } from '../persistency/persistency.service';
import { XmppBodyMessage, XMPPClient } from './xmpp.interface';
import { TrackingService } from '../tracking/tracking.service';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { User } from '../user/user';
import { environment } from '../../../environments/environment';
import { Conversation } from '../conversation/conversation';
import { TrackingEventData } from '../tracking/tracking-event-base.interface';

@Injectable()
export class XmppService {

  private client: XMPPClient;
  private _clientConnected = false;
  private currentJid: string;
  private resource: string;
  private clientConnected$: ReplaySubject<boolean> = new ReplaySubject(1);
  private blockedUsers: string[];
  private thirdVoiceEnabled: string[] = ['drop_price', 'review'];
  private reconnectAttempts = 5;
  private reconnectInterval: any;
  private reconnectedTimes = 0;
  private messageQ: Array<XmppBodyMessage> = [];
  private archiveFinishedLoaded = false;

  constructor(private eventService: EventService,
              private persistencyService: PersistencyService,
              private trackingService: TrackingService) {
  }

  public connect(userId: string, accessToken: string): void {
    this.currentJid = this.createJid(userId);
    this.resource = 'WEB_' + Math.floor(Math.random() * 100000000000000);
    this.createClient(accessToken);
    this.bindEvents();
    this.client.connect();
    this.clientConnected = true;
  }

  public disconnect() {
    if (this.clientConnected) {
      this.client.disconnect();
    }
  }

  public sendMessage(conversation: Conversation, body: string, resend = false, messageId?: string) {
    const message: XmppBodyMessage = {
      id: resend ? messageId : this.client.nextId(),
      to: this.createJid(conversation.user.id),
      from: this.currentJid,
      thread: conversation.id,
      type: 'chat',
      request: {
        xmlns: 'urn:xmpp:receipts',
      },
      body: body
    };

    if (!resend) {
      if (!conversation.messages.length) {
        this.trackingService.track(TrackingService.CONVERSATION_CREATE_NEW, {
          item_id: conversation.item.id,
          thread_id: message.thread,
          message_id: message.id });
        appboy.logCustomEvent('FirstMessage', {platform: 'web'});
      }
      const trackEvent: TrackingEventData = {
        eventData: TrackingService.MESSAGE_SENT,
        attributes: {
        thread_id: message.thread,
        message_id: message.id,
        item_id: conversation.item.id
        }
      };
      this.trackingService.addTrackingEvent(trackEvent, false);
      this.onNewMessage(_.clone(message), true);
    }

    this.client.sendMessage(message);
  }

  public sendConversationStatus(userId: string, conversationId: string) {
    this.client.sendMessage({
      to: this.createJid(userId),
      type: 'chat',
      thread: conversationId,
      read: {
        xmlns: 'wallapop:thread:status'
      }
    });
  }


  public isConnected(): Observable<boolean> {
    return this.clientConnected$.asObservable();
  }

  get clientConnected(): boolean {
    return this._clientConnected;
  }

  set clientConnected(value: boolean) {
    this._clientConnected = value;
    this.clientConnected$.next(value);
  }

  public debug() {
    this.client.on('*', (k, v) => console.debug(k, v));
  }

  private createClient(accessToken: string): void {
    this.client = XMPP.createClient({
      jid: this.currentJid,
      resource: this.resource,
      password: accessToken,
      transport: 'websocket',
      wsURL: environment.wsUrl,
      useStreamManagement: true,
      sendReceipts: false
    });
    this.client.use(this.receiptsPlugin);
    this.client.use(this.mamPlugin);
    this.client.use(this.privacyPlugin);
    this.client.use(this.thirdVoicePlugin);
  }

  public reconnectClient() {
    this.reconnectInterval = setInterval(() => {
      if (!this.clientConnected && this.reconnectedTimes < this.reconnectAttempts) {
      this.client.connect();
        this.reconnectedTimes++;
      } else {
        clearInterval(this.reconnectInterval);
        this.reconnectedTimes = 0;
    }
    }, 5000);
  }

  private bindEvents(): void {
    this.eventService.subscribe(EventService.MSG_ARCHIVE_LOADING, () => {
      this.archiveFinishedLoaded = false;
    });
    this.eventService.subscribe(EventService.MSG_ARCHIVE_LOADED, () => {
      this.archiveFinishedLoaded = true;
      this.messageQ.map(m => this.onNewMessage(m));
    });

    this.client.enableKeepAlive({
      interval: 30
    });
    this.client.on('message', (message: XmppBodyMessage) => {
      this.archiveFinishedLoaded ? this.onNewMessage(message) : this.messageQ.push(message);
    });
    this.client.on('message:sent', (message: XmppBodyMessage) => {
      if (message.received) {
        this.eventService.emit(EventService.MESSAGE_RECEIVED_ACK);
      }
      if (message.read) {
        this.eventService.emit(EventService.MESSAGE_READ_ACK);
      }
    });
    this.client.on('session:started', () => {
      this.client.sendPresence();
      this.client.enableCarbons();
      this.setDefaultPrivacyList().subscribe();
      this.getPrivacyList().subscribe((jids: string[]) => {
        this.blockedUsers = jids;
        this.clientConnected = true;
      });
    });

    this.client.on('disconnected', () => {
      console.warn('Client disconnected');
      this.clientConnected = false;
      this.eventService.emit(EventService.CLIENT_DISCONNECTED);
    });

    this.client.on('connected', () => {
      this.clientConnected = true;
      console.warn('Client connected');
      clearInterval(this.reconnectInterval);
    });

    this.eventService.subscribe(EventService.CONNECTION_RESTORED, () => {
      this.reconnectClient();
    });

    this.client.on('iq', (iq: any) => this.onPrivacyListChange(iq));
  }

  private onNewMessage(message: XmppBodyMessage, markAsPending = false) {
    if (message.body || message.timestamp || message.carbonSent
        || (message.payload && this.thirdVoiceEnabled.indexOf(message.payload.type) !== -1)) {
      const builtMessage: Message = this.buildMessage(message, markAsPending);
      builtMessage.fromSelf = message.from === this.currentJid;
      this.persistencyService.saveMetaInformation({
          start: builtMessage.date.toISOString()
        }
      );
      const replaceTimestamp = !message.timestamp || message.carbonSent;
      this.eventService.emit(EventService.NEW_MESSAGE, builtMessage, replaceTimestamp);
      if (message.requestReceipt && !builtMessage.fromSelf) {
        this.persistencyService.findMessage(message.id).subscribe(() => {}, (error) => {
          if (error.reason === 'missing') {
        this.sendMessageDeliveryReceipt(message.from.bare, message.id, message.thread);
      }
        });
      }
    }
  }

  private buildMessage(message: XmppBodyMessage, markAsPending = false) {
    if (message.carbonSent) {
      message = message.carbonSent.forwarded.message;
    }
    if (message.timestamp) {
      message.date = new Date(message.timestamp.body).getTime();
    } else if (!message.date) {
        message.date = new Date().getTime();
      }
    let messageId: string = null;
    if (markAsPending) {
      message.status = messageStatus.PENDING;
    }
    if (message.timestamp && message.receipt && message.from.local !== message.to.local && !message.carbon) {
      messageId = message.receipt;
      message.status = messageStatus.RECEIVED;
      this.eventService.emit(EventService.MESSAGE_RECEIVED, message.thread, messageId);
    }
    if (!message.carbon && message.sentReceipt) {
      message.status = messageStatus.SENT;
      messageId = message.sentReceipt.id;
      this.eventService.emit(EventService.MESSAGE_SENT_ACK, message.thread, messageId);
    }
    if (!message.carbon && message.readReceipt) {
      const timestamp = new Date(message.date).getTime();
      message.status = messageStatus.READ;
      this.eventService.emit(EventService.MESSAGE_READ, message.thread, timestamp);
    } else {
      messageId = message.id;
    }
    return new Message(messageId, message.thread, message.body, (message.from.full || message.from),
                       new Date(message.date), (message.status || null), message.payload);
  }

  public sendMessageDeliveryReceipt(to: string, id: string, thread: string) {
    to = (to.indexOf('@') === -1) ? this.createJid(to) : to;
        this.client.sendMessage({
          to: to,
          type: 'chat',
          thread: thread,
          received: {
            xmlns: 'urn:xmpp:receipts',
            id: id
          }
        });
      }

  private setDefaultPrivacyList(): Observable<any> {
    return Observable.fromPromise(this.client.sendIq({
      type: 'set',
      privacy: {
        default: {
          name: 'public'
        }
      }
    })
    .catch(() => {}));
  }

  private getPrivacyList(): Observable<any> {
    return Observable.fromPromise(this.client.sendIq({
      type: 'get',
      privacy: {
        list: {
          name: 'public'
        }
      }
    })
    .catch(() => {}))
    .map((response: any) => {
      return response && response.privacy && response.privacy.jids ? response.privacy.jids : [];
    });
  }

  public blockUser(user: User): Observable<any> {
    const jid: string = this.createJid(user.id);
    this.blockedUsers.push(jid);
    return this.setPrivacyList(this.blockedUsers)
    .flatMap(() => {
      if (this.blockedUsers.length === 1) {
        return this.setDefaultPrivacyList();
      }
      return Observable.of({});
    })
    .do(() => user.blocked = true)
    .do(() => this.eventService.emit(EventService.USER_BLOCKED, user.id));
  }

  public unblockUser(user: User): Observable<any> {
    const jid: string = this.createJid(user.id);
    _.remove(this.blockedUsers, (userId) => userId === jid);
    return this.setPrivacyList(this.blockedUsers)
    .do(() => user.blocked = false)
    .do(() => this.eventService.emit(EventService.USER_UNBLOCKED, user.id));
  }

  public isBlocked(userId: string): boolean {
    const jid: string = this.createJid(userId);
    return this.blockedUsers ? this.blockedUsers.indexOf(jid) !== -1 : false;
  }

  private onPrivacyListChange(iq: any) {
    if (iq.type === 'set' && iq.privacy) {
      this.getPrivacyList().subscribe((jids: string[]) => {
        if (jids.length > this.blockedUsers.length) {
          const blockedUsers: string[] = _.difference(jids, this.blockedUsers);
          blockedUsers.forEach((jid: string) => {
            this.eventService.emit(EventService.USER_BLOCKED, this.getIdFromJid(jid));
          });
        } else {
          const unblockedUsers: string[] = _.difference(this.blockedUsers, jids);
          unblockedUsers.forEach((jid: string) => {
            this.eventService.emit(EventService.USER_UNBLOCKED, this.getIdFromJid(jid));
          });
        }
        this.blockedUsers = jids;
      });
    }
  }

  private setPrivacyList(jids: string[]): Observable<any> {
    return Observable.fromPromise(this.client.sendIq({
      type: 'set',
      privacy: {
        list: {
          name: 'public',
          jids: jids
        }
      }
    }));
  }

  private receiptsPlugin(client: XMPPClient, stanzas: any) {
    const types: any = stanzas.utils;
    const timestamp: any = stanzas.define({
      namespace: 'wallapop:message:timestamp',
      name: 'timestamp',
      element: 'timestamp',
      fields: {
        body: {
          get: function getBody() {
            return this.xml.children[0];
          }
        },
      }
    });
    const read: any = stanzas.define({
      name: 'read',
      element: 'read',
      fields: {
        xmlns: types.attribute('xmlns')
      }
    });
    const received: any = stanzas.define({
      name: 'received',
      element: 'received',
      fields: {
        xmlns: types.attribute('xmlns'),
        id: types.attribute('id')
      }
    });
    const request: any = stanzas.define({
      name: 'request',
      element: 'request',
      fields: {
        xmlns: types.attribute('xmlns')
      }
    });
    const readReceipt = {
      get: function get() {
        const readSignal = this.xml.getElementsByTagName('read')[0];
        if (readSignal) {
          return readSignal.attrs;
        }
      }
    };
    const sentReceipt = {
      get: function get() {
        const sentSignal = this.xml.getElementsByTagName('sent')[0];
        if (sentSignal) {
          return sentSignal.attrs;
        }
      }
    };
    stanzas.withMessage(function (Message: any) {
      stanzas.extend(Message, read);
      stanzas.extend(Message, timestamp);
      stanzas.extend(Message, received);
      stanzas.extend(Message, request);
      stanzas.add(Message, 'sentReceipt', sentReceipt);
      stanzas.add(Message, 'readReceipt', readReceipt);
    });
  }

  private privacyPlugin(client: XMPPClient, stanzas: any) {
    const types: any = stanzas.utils;
    const Privacy: any = stanzas.define({
      namespace: 'jabber:iq:privacy',
      name: 'privacy',
      element: 'query',
      fields: {
        jids: {
          get: function getList() {
            let result = [], items;
            const list = this.xml.getElementsByTagName('list');
            if (list && list[0]) {
              items = list[0].getElementsByTagName('item');
            }
            if (!items || !items.length) {
              return result;
            }
            items.forEach((item) => {
              if (types.getAttribute(item, 'action', '') === 'deny') {
                result.push(types.getAttribute(item, 'value', ''));
              }
            });
            return result;
          }
        }
      }
    });
    const Default: any = stanzas.define({
      name: 'default',
      element: 'default',
      fields: {
        name: types.attribute('name')
      }
    });
    const Active: any = stanzas.define({
      name: 'active',
      element: 'active',
      fields: {
        name: types.attribute('name')
      }
    });
    const List: any = stanzas.define({
      name: 'list',
      element: 'list',
      fields: {
        name: types.attribute('name'),
        jids: {
          set: function set(values) {
            const self = this;
            values.forEach(function (value, index) {
              const item = types.createElement('jabber:iq:privacy', 'item', 'jabber:iq:privacy');
              types.setAttribute(item, 'type', 'jid');
              types.setAttribute(item, 'order', index + 1);
              types.setAttribute(item, 'action', 'deny');
              types.setAttribute(item, 'value', value.toString());
              self.xml.appendChild(item);
            });
          }
        }
      }
    });
    stanzas.withIq(function (Iq: any) {
      stanzas.extend(Iq, Privacy);
    });
    stanzas.withDefinition('query', 'jabber:iq:privacy', function (Privacy) {
      stanzas.extend(Privacy, Default);
      stanzas.extend(Privacy, Active);
      stanzas.extend(Privacy, List);
    });
  }

  private mamPlugin(client: XMPPClient, stanzas: any) {
    const types: any = stanzas.utils;
    const MAMQuery: any = stanzas.define({
      name: 'mam',
      namespace: 'urn:xmpp:mam:tmp',
      element: 'query',
      fields: {
        queryid: types.attribute('queryid'),
        start: types.dateSub('urn:xmpp:mam:tmp', 'start'),
        end: types.dateSub('urn:xmpp:mam:tmp', 'end'),
        thread: types.dateSub('urn:xmpp:mam:tmp', 'thread'),
      }
    });
    stanzas.withIq(function (Iq: any) {
      stanzas.extend(Iq, MAMQuery);
    });
    stanzas.withDefinition('set', 'http://jabber.org/protocol/rsm', function (RSM: any) {
      stanzas.extend(MAMQuery, RSM);
    });
  }

  private thirdVoicePlugin(client: XMPPClient, stanzas: any) {
    const types: any = stanzas.utils;
    const PAYLOAD = {
      get: function get() {
        const payload = types.find(this.xml, 'jabber:client', 'payload')[0];
        if (payload && payload.children[0]) {
          return JSON.parse(payload.children[0]);
        }
      }
    };
    stanzas.withMessage(function (Message: any) {
      stanzas.add(Message, 'payload', PAYLOAD);
    });
  }

  private createJid(userId: string): string {
    return userId + '@' + environment.xmppDomain;
  }

  private getIdFromJid(jid: string): string {
    const splitted = jid.split('@');
    return splitted[0];
  }
}
