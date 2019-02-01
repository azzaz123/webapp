import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { Message, messageStatus } from '../message/message';
import { EventService } from '../event/event.service';
import { XmppBodyMessage, XMPPClient, JID } from './xmpp.interface';
import { Observable, Observer } from 'rxjs';
import 'rxjs/add/observable/from';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { User } from '../user/user';
import { environment } from '../../../environments/environment';
import { Conversation } from '../conversation/conversation';
import { ChatSignal, chatSignalType } from '../message/chat-signal.interface';

@Injectable()
export class XmppService {

  private client: XMPPClient;
  private _clientConnected = false;
  private self: JID;
  private resource: string;
  private clientConnected$: ReplaySubject<boolean> = new ReplaySubject(1);
  public blockedUsers: string[];
  private thirdVoiceEnabled: string[] = ['drop_price', 'review'];
  private messageQ: Array<XmppBodyMessage> = [];
  private archiveFinishedLoaded = false;

  constructor(private eventService: EventService) {
  }

  public connect(userId: string, accessToken: string): Observable<boolean> {
    this.resource = 'WEB_' + Math.floor(Math.random() * 100000000000000);
    this.self = this.createJid(userId);
    this.createClient(accessToken);
    this.bindEvents();
    this.client.connect();
    this.clientConnected = true;
    return this.sessionConnected();
  }

  public disconnect() {
    if (this.clientConnected) {
      this.client.disconnect();
    }
  }

  public sendMessage(conversation: Conversation, body: string) {
    const message = this.createXmppMessage(conversation, this.client.nextId(), body);
    this.onNewMessage(_.clone(message), true);
    this.client.sendMessage(message);
    this.eventService.emit(EventService.MESSAGE_SENT, conversation, message.id);
  }

  public resendMessage(conversation: Conversation, message: Message) {
    const msg: XmppBodyMessage = this.createXmppMessage(conversation, message.id, message.message);
    this.client.sendMessage(msg);
  }

  private createXmppMessage(conversation: Conversation, id: string, body: string): XmppBodyMessage {
    const message: XmppBodyMessage = {
      id: id,
      to: this.createJid(conversation.user.id),
      from: this.self,
      thread: conversation.id,
      type: 'chat',
      request: {
        xmlns: 'urn:xmpp:receipts',
      },
      body: body
    };
    return message;
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

  public disconnectError(): Observable<boolean> {
    if (!this.clientConnected) {
      return Observable.throw({});
    }
    return Observable.of(true);
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
      jid: this.self,
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
    if (!this.clientConnected) {
      this.client.connect();
    }
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

    this.client.on('disconnected', () => {
      this.clientConnected = false;
      this.eventService.emit(EventService.CLIENT_DISCONNECTED);
      console.warn('Client disconnected');
    });

    this.client.on('connected', () => {
      this.clientConnected = true;
      console.warn('Client connected');
    });

    this.client.on('iq', (iq: any) => this.onPrivacyListChange(iq));
  }

  private sessionConnected(): Observable<boolean> {
    return Observable.create((observer: Observer<any>) => {
      this.client.on('session:started', () => {
        this.client.sendPresence();
        this.client.enableCarbons();
        this.getBlockedUsers().subscribe(() => {
          observer.next(true);
        });
      });
    });
  }

  private getBlockedUsers(): Observable<boolean> {
    return Observable.create((observer: Observer<boolean>) => {
      this.setDefaultPrivacyList().subscribe();
      this.getPrivacyList().subscribe((blockedIds: string[]) => {
        this.blockedUsers = blockedIds;
        this.clientConnected = true;
        observer.next(true);
      });
    });
  }

  private onNewMessage(message: XmppBodyMessage, markAsPending = false) {
      const replaceTimestamp = !message.timestamp || message.carbonSent;
    if (message.carbonSent) {
      message = message.carbonSent.forwarded.message;
    }

    if (message.timestamp) {
      message.date = new Date(message.timestamp.body).getTime();
    } else if (!message.date) {
        message.date = new Date().getTime();
      }
    this.eventService.emit(EventService.CHAT_LAST_RECEIVED_TS, message.date);

    if (message.receipt || message.sentReceipt || message.readReceipt) {
      this.buildChatSignal(message);
    } else if (message.body || (message.payload && this.thirdVoiceEnabled.indexOf(message.payload.type) !== -1)) {
      const builtMessage: Message = this.buildMessage(message, markAsPending);
      builtMessage.fromSelf = this.isFromSelf(message);
      this.eventService.emit(EventService.NEW_MESSAGE, builtMessage, replaceTimestamp, message.requestReceipt);
    }
  }

  private isFromSelf(message: XmppBodyMessage): boolean {
    /* The second part of condition is used to exclude 3rd voice messages, where 'from' = the id of the user
    logged in, but they should not be considered messages fromSelf */
    const fromSelf = (message.from.local === this.self.local) && !message.payload;
    return fromSelf;
  }

  private buildChatSignal(message: XmppBodyMessage) {
    let signal: ChatSignal;
    if (message.timestamp && message.receipt && message.from.bare !== message.to.bare && !message.carbon) {
      signal = new ChatSignal(chatSignalType.RECEIVED, message.thread, message.date, message.receipt);
    } else if (!message.carbon && message.sentReceipt) {
      signal = new ChatSignal(chatSignalType.SENT, message.thread, message.date, message.sentReceipt.id);
    } else if (!message.carbon && message.readReceipt) {
      signal = new ChatSignal(chatSignalType.READ, message.thread, message.date);
    }

    if (signal) {
      this.eventService.emit(EventService.CHAT_SIGNAL, signal);
    }
    }

  private buildMessage(message: XmppBodyMessage, markAsPending = false) {
    message.status = markAsPending ? messageStatus.PENDING : null;
    return new Message(message.id, message.thread, message.body, message.from.local,
      new Date(message.date), message.status, message.payload);
  }

  public sendMessageDeliveryReceipt(toId: string, id: string, thread: string) {
    this.client.sendMessage({
      to: this.createJid(toId),
      type: 'chat',
      thread: thread,
      received: {
        xmlns: 'urn:xmpp:receipts',
        id: id
      }
    });
  }

  private setDefaultPrivacyList(): Observable<any> {
    return Observable.from(this.client.sendIq({
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
    return Observable.from(this.client.sendIq({
      type: 'get',
      privacy: {
        list: {
          name: 'public'
        }
      }
    })
    .catch(() => {}))
    .map((response: any) => {
      const blockedIds = [];
        if (response && response.privacy && response.privacy.jids) {
          response.privacy.jids.map((jid: string) => blockedIds.push(jid.split('@')[0]));
        }
      return blockedIds;
    });
  }

  public blockUser(user: User): Observable<any> {
    this.blockedUsers.push(user.id);
    return this.setPrivacyList(this.blockedUsers)
    .flatMap(() => {
      if (this.blockedUsers.length === 1) {
        return this.setDefaultPrivacyList();
      }
      return Observable.of({});
    })
    .do(() => user.blocked = true);
  }

  public unblockUser(user: User): Observable<any> {
    _.remove(this.blockedUsers, (userId) => userId === user.id);
    return this.setPrivacyList(this.blockedUsers)
    .do(() => user.blocked = false);
  }

  private onPrivacyListChange(iq: any) {
    if (iq.type === 'set' && iq.privacy) {
      this.getPrivacyList().subscribe((ids: string[]) => {
        this.eventService.emit(EventService.PRIVACY_LIST_UPDATED, ids);
        this.blockedUsers = ids;
      });
    }
  }

  private setPrivacyList(ids: string[]): Observable<any> {
    const jids = [];
    ids.map(id => jids.push(this.createJid(id).bare));
    return Observable.from(this.client.sendIq({
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
    stanzas.withMessage(function (message: any) {
      stanzas.extend(message, read);
      stanzas.extend(message, timestamp);
      stanzas.extend(message, received);
      stanzas.extend(message, request);
      stanzas.add(message, 'sentReceipt', sentReceipt);
      stanzas.add(message, 'readReceipt', readReceipt);
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
            const result = [];
            let items;
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
    stanzas.withMessage(function (message: any) {
      stanzas.add(message, 'payload', PAYLOAD);
    });
  }

  private createJid(userId: string): JID {
    const jid = new JID(userId, environment.xmppDomain, this.resource);
    return jid;
  }
}
