import { Injectable } from '@angular/core';
import {
  ChatSignal,
  ChatSignalType,
  InboxConversation,
  InboxMessage,
  InboxUser,
  MessageStatus,
  MESSAGES_WHITE_LIST,
  MessageType,
} from '@private/features/chat/core/model';
import { clone, eq, includes, remove } from 'lodash-es';
import { from, Observable, Observer, of, ReplaySubject, throwError } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { EventService } from '../event/event.service';
import { RemoteConsoleService } from '../remote-console';
import { User } from '../user/user';
import { JID, XmppBodyMessage, XMPPClient } from './xmpp.interface';
import { StanzaIO } from './xmpp.provider';

@Injectable()
export class XmppService {
  private client: XMPPClient;
  private _clientConnected = false;
  private blockedListAvailable = false;
  private self: JID;
  private resource: string;
  private clientConnected$: ReplaySubject<boolean> = new ReplaySubject(1);
  public blockedUsers: string[];
  private thirdVoiceEnabled: string[] = ['drop_price', 'review'];
  private realtimeQ: Array<XmppBodyMessage> = [];
  private canProcessRealtime = false;
  private xmppError = { message: 'XMPP disconnected' };

  constructor(private eventService: EventService, private remoteConsoleService: RemoteConsoleService) {
    this.clientConnected$.next(false);
  }

  public connect$(userId: string, accessToken: string): Observable<boolean> {
    this.resource = 'WEB_' + Math.floor(Math.random() * 100000000000000);
    this.self = this.createJid(userId, true);
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

  public sendMessage(conversation: InboxConversation, body: string): string {
    const messageId = this.client.nextId();
    this.remoteConsoleService.sendMessageActTimeout(messageId);
    this.remoteConsoleService.sendMessageTimeout(messageId);
    const message = this.createXmppMessage(conversation, messageId, body);
    this.onNewMessage(clone(message), true);
    this.client.sendMessage(message);
    this.remoteConsoleService.sendMessageTimeout(message.id);
    this.eventService.emit(EventService.MESSAGE_SENT, conversation, message.id);
    return message.id;
  }

  public resendMessage(conversation: InboxConversation, message: InboxMessage) {
    const xmppBodyMessage: XmppBodyMessage = this.createXmppMessage(conversation, message.id, message.text);
    this.client.sendMessage(xmppBodyMessage);
  }

  private createXmppMessage(conversation: InboxConversation, id: string, body: string): XmppBodyMessage {
    const message: XmppBodyMessage = {
      id: id,
      to: this.createJid(conversation.user.id),
      from: this.self,
      thread: conversation.id,
      type: 'chat',
      request: {
        xmlns: 'urn:xmpp:receipts',
      },
      body: body,
    };
    return message;
  }

  public sendConversationStatus(userId: string, thread: string) {
    this.client.sendMessage({
      to: this.createJid(userId),
      type: 'chat',
      thread: thread,
      read: {
        xmlns: 'wallapop:thread:status',
      },
    });
  }

  public isConnected$(): Observable<boolean> {
    return this.clientConnected$.asObservable();
  }

  public disconnectError(): Observable<boolean> {
    if (!this.clientConnected) {
      return throwError(this.xmppError);
    }
    return of(true);
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
    this.client = StanzaIO.createClient({
      jid: this.self,
      resource: this.resource,
      password: accessToken,
      transport: 'websocket',
      wsURL: environment.wsUrl,
      useStreamManagement: true,
      sendReceipts: false,
    });
    this.client.use(this.receiptsPlugin);
    this.client.use(this.mamPlugin);
    this.client.use(this.privacyPlugin);
    this.client.use(this.thirdVoicePlugin);
  }

  public reconnectClient() {
    if (this.client && !this.clientConnected) {
      this.client.connect();
    }
  }

  private bindEvents(): void {
    this.eventService.subscribe(EventService.CHAT_CAN_PROCESS_RT, (val) => {
      this.canProcessRealtime = val;
      if (val) {
        this.realtimeQ.map((m) => this.onNewMessage(m));
      }
    });

    this.client.enableKeepAlive({
      interval: 30,
    });
    this.client.on('message', (message: XmppBodyMessage) => {
      if (!this.isFromSelf(message) && message.sentReceipt && message.sentReceipt.id) {
        this.remoteConsoleService.sendMessageActTimeout(message.sentReceipt.id);
      }
      this.canProcessRealtime ? this.onNewMessage(message) : this.realtimeQ.push(message);
    });
    this.client.on('message:sent', (message: XmppBodyMessage) => {
      if (message.received) {
        this.eventService.emit(EventService.MESSAGE_RECEIVED_ACK);
      }
      if (message.read) {
        this.eventService.emit(EventService.MESSAGE_READ_ACK);
      }
      this.buildChatSignal(message);
    });

    this.client.on('disconnected', () => {
      this.clientConnected = false;
      this.remoteConsoleService.sendXmppConnectionClosedWithError();
      console.warn('Client disconnected');
      this.eventService.emit(EventService.CHAT_RT_DISCONNECTED);
    });

    this.client.on('connected', () => {
      this.clientConnected = true;
      console.warn('Client connected');
      if (this.blockedListAvailable) {
        this.eventService.emit(EventService.CHAT_RT_CONNECTED);
      }
    });

    this.client.on('iq', (iq: any) => this.onPrivacyListChange(iq));
  }

  private sessionConnected(): Observable<boolean> {
    return Observable.create((observer: Observer<any>) => {
      this.client.on('session:started', () => {
        this.client.sendPresence();
        this.client.enableCarbons();
        this.getBlockedUsers().subscribe(() => {
          this.blockedListAvailable = true;
          this.eventService.emit(EventService.CHAT_RT_CONNECTED);
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
      if (!this.isFromSelf(message)) {
        this.remoteConsoleService.sendPresentationMessageTimeout(message.id);
      }
      const builtMessage: InboxMessage = this.buildMessage(message, markAsPending);
      if (includes(MESSAGES_WHITE_LIST, builtMessage.type)) {
        this.eventService.emit(EventService.NEW_MESSAGE, builtMessage, replaceTimestamp, message.requestReceipt);
      }
    }
  }

  private isFromSelf(message: XmppBodyMessage): boolean {
    /* The second part of condition is used to exclude 3rd voice messages, where 'from' = the id of the user
    logged in, but they should not be considered messages fromSelf */
    return this.self && message.from && eq(message.from.local, this.self.local) && !message.payload;
  }

  private buildChatSignal(message: XmppBodyMessage) {
    let signal: ChatSignal;
    if (message.timestamp && message.receipt && message.from.bare !== message.to.bare && !message.carbon) {
      signal = new ChatSignal(ChatSignalType.RECEIVED, message.thread, message.date, message.receipt);
    } else if (!message.carbon && message.sentReceipt) {
      signal = new ChatSignal(ChatSignalType.SENT, message.thread, message.date, message.sentReceipt.id);
    } else if (message.readReceipt) {
      signal = new ChatSignal(ChatSignalType.READ, message.thread, message.date, null, this.isFromSelf(message));
    }

    if (signal) {
      this.eventService.emit(EventService.CHAT_SIGNAL, signal);
    }
  }

  private buildMessage(message: XmppBodyMessage, markAsPending = false): InboxMessage {
    message.status = markAsPending ? MessageStatus.PENDING : MessageStatus.SENT;
    const messageType = message.payload ? (message.payload.type as MessageType) : MessageType.TEXT;
    return new InboxMessage(
      message.id,
      message.thread,
      message.body,
      message.from.local,
      this.isFromSelf(message),
      new Date(message.date),
      message.status,
      messageType,
      message.payload
    );
  }

  public sendMessageDeliveryReceipt(toId: string, id: string, thread: string) {
    this.client.sendMessage({
      to: this.createJid(toId),
      type: 'chat',
      thread: thread,
      received: {
        xmlns: 'urn:xmpp:receipts',
        id: id,
      },
    });
  }

  private setDefaultPrivacyList(): Observable<any> {
    return from(
      this.client
        .sendIq({
          type: 'set',
          privacy: {
            default: {
              name: 'public',
            },
          },
        })
        .catch(() => {})
    );
  }

  private getPrivacyList(): Observable<any> {
    return from(
      this.client
        .sendIq({
          type: 'get',
          privacy: {
            list: {
              name: 'public',
            },
          },
        })
        .catch(() => {})
    ).pipe(
      map((response: any) => {
        const blockedIds = [];
        if (response && response.privacy && response.privacy.jids) {
          response.privacy.jids.map((jid: string) => blockedIds.push(jid.split('@')[0]));
        }
        return blockedIds;
      })
    );
  }

  public blockUser(user: User | InboxUser): Observable<any> {
    this.blockedUsers.push(user.id);
    return this.setPrivacyList(this.blockedUsers).pipe(
      mergeMap(() => {
        if (this.blockedUsers.length === 1) {
          return this.setDefaultPrivacyList();
        }
        return of({});
      }),
      tap(() => {
        user.blocked = true;
        this.eventService.emit(EventService.PRIVACY_LIST_UPDATED, this.blockedUsers);
      })
    );
  }

  public unblockUser(user: User | InboxUser): Observable<any> {
    remove(this.blockedUsers, (userId) => userId === user.id);
    return this.setPrivacyList(this.blockedUsers).pipe(
      tap(() => {
        user.blocked = false;
        this.eventService.emit(EventService.PRIVACY_LIST_UPDATED, this.blockedUsers);
      })
    );
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
    ids.map((id) => jids.push(this.createJid(id).bare));
    return from(
      this.client.sendIq({
        type: 'set',
        privacy: {
          list: {
            name: 'public',
            jids: jids,
          },
        },
      })
    );
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
          },
        },
      },
    });
    const read: any = stanzas.define({
      name: 'read',
      element: 'read',
      fields: {
        xmlns: types.attribute('xmlns'),
      },
    });
    const received: any = stanzas.define({
      name: 'received',
      element: 'received',
      fields: {
        xmlns: types.attribute('xmlns'),
        id: types.attribute('id'),
      },
    });
    const request: any = stanzas.define({
      name: 'request',
      element: 'request',
      fields: {
        xmlns: types.attribute('xmlns'),
      },
    });
    const readReceipt = {
      get: function get() {
        const readSignal = this.xml.getElementsByTagName('read')[0];
        if (readSignal) {
          return readSignal.attrs;
        }
      },
    };
    const sentReceipt = {
      get: function get() {
        const sentSignal = this.xml.getElementsByTagName('sent')[0];
        if (sentSignal) {
          return sentSignal.attrs;
        }
      },
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
          },
        },
      },
    });
    const Default: any = stanzas.define({
      name: 'default',
      element: 'default',
      fields: {
        name: types.attribute('name'),
      },
    });
    const Active: any = stanzas.define({
      name: 'active',
      element: 'active',
      fields: {
        name: types.attribute('name'),
      },
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
          },
        },
      },
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
      },
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
      },
    };
    stanzas.withMessage(function (message: any) {
      stanzas.add(message, 'payload', PAYLOAD);
    });
  }

  private createJid(userId: string, withResource = false): JID {
    return new JID(userId, environment.xmppDomain, withResource ? this.resource : null);
  }
}
