import * as _ from 'lodash';
import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpService } from '../http/http.service';
import { Conversation } from './conversation';
import { ConnectionService } from '../connection/connection.service';
import { UserService } from '../user/user.service';
import { ItemService } from '../item/item.service';
import { XmppService } from '../xmpp/xmpp.service';
import { MessageService } from '../message/message.service';
import { Message, messageStatus, statusOrder } from '../message/message';
import { EventService } from '../event/event.service';
import { PersistencyService } from '../persistency/persistency.service';
import { MessagesData, StoredConversation } from '../message/messages.interface';
import { RequestOptions, Response, Headers } from '@angular/http';
import { NotificationService } from '../notification/notification.service';
import { LeadService } from './lead.service';
import { ConversationResponse, NewConversationResponse } from './conversation-response.interface';
import { Filter } from './filter.interface';
import { Filters } from './conversation-filters';
import { TrackingService } from '../tracking/tracking.service';
import { ConversationTotals } from './totals.interface';
import { Item } from '../item/item';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/share';
import 'rxjs/add/observable/forkJoin';

@Injectable()
export class ConversationService extends LeadService {

  protected API_URL = 'api/v3/protool/conversations';
  protected ARCHIVE_URL = 'api/v3/conversations';
  private PHONE_MESSAGE = 'Mi número de teléfono es';
  private SURVEY_MESSAGE = 'Ya he respondido a tus preguntas';

  private messagesObservable: Observable<Conversation[]>;
  private readSubscription: Subscription;
  private receiptSent = false;
  public messagesReadSubscription: Subscription;
  public ended: boolean;

  constructor(http: HttpService,
              userService: UserService,
              itemService: ItemService,
              event: EventService,
              xmpp: XmppService,
              connectionService: ConnectionService,
              private persistencyService: PersistencyService,
              protected messageService: MessageService,
              protected trackingService: TrackingService,
              protected notificationService: NotificationService,
              private zone: NgZone) {
    super(http, userService, itemService, event, xmpp, connectionService);
  }

  private subscribeConversationRead(conversation) {
    this.messagesReadSubscription = this.event.subscribe(EventService.MESSAGE_READ, (thread) => {
      if (thread === conversation.id) {
        this.markAllAsRead(conversation);
      }
    });
  }

  public getLeads(since?: number, archived?: boolean): Observable<Conversation[]> {
    return this.query(since, archived)
    .flatMap((conversations: Conversation[]) => {
      if (conversations && conversations.length > 0) {
        if (!this.messagesReadSubscription) {
          conversations.forEach((conversation: Conversation) => this.subscribeConversationRead(conversation));
        }
        return Observable.forkJoin(
          conversations.map((conversation: Conversation) => this.loadUnreadMessagesNumber(conversation))
        )
        .flatMap((convWithUnreadNumber: Conversation[]) => {
          return this.loadMessagesIntoConversations(convWithUnreadNumber)
          .map((convWithMessages: Conversation[]) => {
            if (!archived) {
              if (!convWithMessages.length) {
                this.ended = true;
              } else {
                this.leads = this.leads.concat(convWithMessages);
              }
            } else {
              this.archivedLeads = this.archivedLeads.concat(convWithMessages);
            }
            this.firstLoad = false;
            return convWithMessages;
          });
        });
      } else {
        this.firstLoad = false;
        this.ended = true;
        return Observable.of([]);
      }
    });
  }

  public loadMore(): Observable<any> {
    return this.getLeads(this.getLastDate(this.leads))
    .map(() => {
      this.stream$.next(this.leads);
    });
  }

  public loadMoreArchived(): Observable<any> {
    return this.getLeads(this.getLastDate(this.archivedLeads), true)
      .map(() => {
        this.archivedStream$.next(this.archivedLeads);
      });
  }

  public getPage(page: number, archive?: boolean, filters?: Filter[], pageSize: number = this.PAGE_SIZE): Observable<Conversation[]> {
    const init: number = (page - 1) * pageSize;
    const end: number = init + pageSize;
    return (archive ? this.archivedStream$ : this.stream$).asObservable()
      .map((conversations: Conversation[]) => {
        if (filters) {
          return this.filter(conversations, filters);
        }
        return conversations;
      })
      .map((filteredConversations: Conversation[]) => {
        return _.reverse(_.sortBy(filteredConversations, 'modifiedDate'));
      })
      .map((sortedConversations: Conversation[]) => {
        return sortedConversations.slice(0, end);
      });
  }

  private filter(conversations: Conversation[], filters: Filter[]): Conversation[] {
    let bool: boolean;
    return conversations.filter((conversation: Conversation) => {
      bool = true;
      filters.forEach((filter) => {
        bool = bool && conversation[filter.key] === filter.value;
      });
      return bool;
    });
  }

  public getTotals(): Observable<ConversationTotals> {
    return this.stream$.asObservable()
    .flatMap((conversations: Conversation[]) => {
      return this.archivedStream$.asObservable()
      .map((archivedConversations: Conversation[]) => {
        const phonesShared: number = conversations.filter((conversation: Conversation) => {
          return conversation.phone !== undefined;
        }).length;
        const meetings: number = this.filter(conversations, Filters.MEETINGS).length;
        const messages: number = this.filter(conversations, Filters.OTHERS).length;
        const archivedPhonesShared: number = archivedConversations.filter((conversation: Conversation) => {
          return conversation.phone !== undefined;
        }).length;
        const archivedMeetings: number = this.filter(archivedConversations, Filters.MEETINGS).length;
        const archivedMessages: number = this.filter(archivedConversations, Filters.OTHERS).length;
        return {
          phonesShared: phonesShared,
          meetings: meetings,
          messages: messages,
          conversations: conversations.length,
          archivedPhonesShared: archivedPhonesShared,
          archivedMeetings: archivedMeetings,
          archivedMessages: archivedMessages
        };
      });
    });
  }

  public checkIfLastPage(archive: boolean = false): Observable<any> {
    const lastDate: number = archive ? this.getLastDate(this.archivedLeads) : this.getLastDate(this.leads);
    if (lastDate) {
      return this.http.get(this.API_URL, {until: lastDate, hidden: archive})
      .map((res: Response) => res.json())
      .map((res: ConversationResponse[]) => {
        if (res.length === 0) {
          this.ended = true;
        }
      });
    }
    return Observable.of({});
  }

  public archiveWithPhones() {
    const archivedConversations: Conversation[] = _.remove(<Conversation[]>this.leads, (conversation: Conversation) => {
      return conversation.phone !== undefined;
    });
    archivedConversations.forEach((conversation: Conversation) => {
      this.sendRead(conversation);
    });
    this.bulkArchive(archivedConversations);
  }

  protected onArchive(conversation: Conversation) {
    this.sendRead(conversation);
  }

  protected onArchiveAll() {
    this.leads.forEach((conversation: Conversation) => {
      this.sendRead(conversation);
    });
    this.leads = this.bulkArchive(this.leads);
    this.stream();
    this.stream(true);
  }

  private loadUnreadMessagesNumber(conversation: Conversation): Observable<Conversation> {
    return this.persistencyService.getUnreadMessages(conversation.id)
    .map((storedConv: StoredConversation) => {
      conversation.unreadMessages = storedConv.unreadMessages;
      this.messageService.totalUnreadMessages += storedConv.unreadMessages;
      return conversation;
    });
  }

  public loadMessagesIntoConversations(conversations: Conversation[]): Observable<Conversation[]> {
    return this.loadMessages(conversations)
    .flatMap((convWithMessages: Conversation[]) => {
      return (this.firstLoad ? this.loadNotStoredMessages(convWithMessages) : Observable.of(convWithMessages));
    })
    .map((convWithMessages: Conversation[]) => {
      return convWithMessages.filter((conversation: Conversation) => {
        return conversation.messages.length > 0;
      });
    });
  }

  public getConversationPage(id: string, archive?: boolean): number {
    const index: number = (archive ? this.archivedLeads : this.leads).findIndex((conversation: Conversation) => {
      return conversation.id === id;
    });
    if (index === -1) {
      return -1;
    }
    return Math.ceil((index + 1) / this.PAGE_SIZE);
  }

  public findMessage(messages: Message[], message: Message): Message {
    return messages.filter((msg: Message): boolean => {
      return (msg.id === message.id);
    })[0];
  }

  public addMessage(conversation: Conversation, message: Message): boolean {
    if (!this.findMessage(conversation.messages, message)) {
      if (message.fromSelf) {
        message.status = messageStatus.PENDING;
      }
      conversation.messages.push(message);
      conversation.modifiedDate = new Date().getTime();
      if (!message.fromSelf && !this.receiptSent) {
        this.event.subscribe(EventService.MESSAGE_RECEIVED_ACK, () => {
          this.sendAck(message.id, conversation.item.id, conversation.user.id, conversation.id, TrackingService.MESSAGE_RECEIVED_ACK);
          this.event.unsubscribeAll(EventService.MESSAGE_RECEIVED_ACK);
        });
        this.handleUnreadMessage(conversation);
      }
      if (this.receiptSent) {
        this.receiptSent = false;
      }
      return true;
    }
  }

  private addStatusToStoredMessages(conversation: Conversation, newStatus: string) {
    this.persistencyService.localDbVersionUpdate(1.1, () => {
      conversation.messages.filter((message) => {
        return message.fromSelf && typeof message.status !== 'string';
      }).forEach((message) => {
        message.status = newStatus;
        this.persistencyService.updateMessageStatus(message.id, newStatus);
      });
    });
  }

  public markAllAsRead(conversation: Conversation) {
    this.addStatusToStoredMessages(conversation, messageStatus.READ);
    conversation.messages.filter((message) => {
      return (message.status === messageStatus.RECEIVED || message.status === messageStatus.SENT) && message.fromSelf;
    })
    .forEach((message) => {
      message.status = messageStatus.READ;
      this.sendAck(message.id, conversation.item.id, conversation.user.id, conversation.id, TrackingService.MESSAGE_READ);
      this.persistencyService.updateMessageStatus(message.id, messageStatus.READ);
    });
  }

  public markAs(newStatus: string, message: Message, conversation: Conversation) {
    if (!message.status || statusOrder.indexOf(newStatus) > statusOrder.indexOf(message.status) || message.status === null) {
      message.status = newStatus;
      this.persistencyService.updateMessageStatus(message.id, newStatus);
      if (newStatus === messageStatus.SENT) {
        this.sendAck(message.id, conversation.item.id, conversation.user.id, conversation.id, TrackingService.MESSAGE_SENT_ACK);
      } else if (newStatus === messageStatus.RECEIVED) {
        this.sendAck(message.id, conversation.item.id, conversation.user.id, conversation.id, TrackingService.MESSAGE_RECEIVED);
      }
    }
  }

  public get(id: string): Observable<Conversation> {
    return this.http.get(`${this.API_URL}/${id}`)
    .flatMap((res: Response) => {
      let conversation: ConversationResponse = res.json();
      return Observable.forkJoin(
        this.itemService.get(conversation.item_id),
        this.userService.get(conversation.other_user_id)
      ).map((data: any[]) => {
        conversation.user = data[1];
        conversation.user.blocked = this.xmpp.isBlocked(conversation.user.id);
        conversation = <ConversationResponse>this.setItem(conversation, data[0]);
        return conversation;
      });
    })
    .map((data: ConversationResponse ) => this.mapRecordData(data));
  }

  private sendAck(messageId: string, itemId: string, toUserId: string, conversationId: string, trackingEvent: any) {
    this.trackingService.track(trackingEvent, {
      thread_id: conversationId,
      from_user_id: toUserId,
      message_id: messageId,
      item_id: itemId
    });
  }

  public sendRead(conversation: Conversation) {
    if (conversation.unreadMessages > 0) {
      const unreadMessages = conversation.messages.slice(-conversation.unreadMessages);
      this.readSubscription = this.event.subscribe(EventService.MESSAGE_READ_ACK, () => {
        unreadMessages.forEach((message) => {
          this.sendAck(message.id, conversation.item.id, conversation.user.id, conversation.id, TrackingService.MESSAGE_READ_ACK);
        });
        this.readSubscription.unsubscribe();
      });
      this.xmpp.sendConversationStatus(conversation.user.id, conversation.id);
      this.messageService.totalUnreadMessages -= conversation.unreadMessages;
      conversation.unreadMessages = 0;
      this.persistencyService.saveUnreadMessages(conversation.id, 0);
    }
  }

  private handleUnreadMessage(conversation: Conversation) {
    this.zone.run(() => {
      conversation.unreadMessages++;
      this.persistencyService.saveUnreadMessages(conversation.id, conversation.unreadMessages);
      this.messageService.totalUnreadMessages++;
    });
  }

  private loadMessages(conversations: Conversation[]): Observable<Conversation[]> {
    if (this.messagesObservable) {
      return this.messagesObservable;
    }
    if (this.connectionService.isConnected) {
      this.messagesObservable = this.recursiveLoadMessages(conversations)
      .share()
      .do(() => {
        this.messagesObservable = null;
      });
    }
    return this.messagesObservable;
  }

  private recursiveLoadMessages(conversations: Conversation[], index: number = 0): Observable<Conversation[]> {
    return this.xmpp.isConnected()
    .flatMap(() => {
        if (conversations && conversations[index] && this.connectionService.isConnected) {
        return this.messageService.getMessages(conversations[index])
        .flatMap((res: MessagesData) => {
          conversations[index].messages = res.data;
          conversations[index].lastMessageRef = res.meta.first;
          conversations[index].oldMessagesLoaded = res.meta.end;
          if (index < conversations.length - 1) {
            return this.recursiveLoadMessages(conversations, index + 1);
          }
          conversations = this.xmpp.addUnreadMessagesCounter(conversations);
          conversations.forEach(conversation => {
            this.persistencyService.saveUnreadMessages(conversation.id, conversation.unreadMessages);
          });
          this.messageService.totalUnreadMessages = this.messageService.totalUnreadMessages ?
            this.messageService.totalUnreadMessages : this.xmpp.totalUnreadMessages;
          return Observable.of(conversations);
        });
      } else {
          return Observable.of(null);
      }
    });
  }

  public loadNotStoredMessages(conversations: Conversation[]): Observable<Conversation[]> {
    return this.xmpp.isConnected()
    .flatMap(() => {
      if (this.connectionService.isConnected) {
      return this.messageService.getNotSavedMessages().map((response: MessagesData) => {
        if (response.data.length) {
          let conversation: Conversation;
          response.data.forEach((message: Message) => {
            conversation = conversations.filter((filteredConversation: Conversation): boolean => {
              return (filteredConversation.id === message.conversationId);
            })[0];
            if (conversation) {
              if (!this.findMessage(conversation.messages, message)) {
                message = this.messageService.addUserInfo(conversation, message);
                conversation.messages.push(message);
                if (!message.fromSelf) {
                  this.handleUnreadMessage(conversation);
                }
              }
            } else {
              this.get(message.conversationId).subscribe((subscribedConversation: Conversation) => {
                message = this.messageService.addUserInfo(subscribedConversation, message);
                this.addMessage(subscribedConversation, message);
                conversations.unshift(subscribedConversation);
                if (message.fromSelf) {
                  this.handleUnreadMessage(subscribedConversation);
                }
              });
            }
          });
        }
        return conversations;
      });
      } else {
        return Observable.of(null);
      }
    });
  }

  protected mapRecordData(data: ConversationResponse): Conversation {
    return new Conversation(
      data.conversation_id,
      data.legacy_id,
      data.modified_date,
      data.expected_visit,
      data.user,
      data.item,
      [],
      data.buyer_phone_number,
      data.survey_responses
    );
  }

  public handleNewMessages(message: Message, updateDate: boolean) {
    if (!this.firstLoad) {
      this.onNewMessage(message, updateDate);
    } else {
      const interval: any = setInterval(() => {
        if (!this.firstLoad) {
          clearInterval(interval);
          this.onNewMessage(message, updateDate);
        }
      }, 500);
    }
  }

  public getItemFromConvId(conversationId: string): Item {
    return _.find(this.leads, {id: conversationId}).item;
  }

  public getByItemId(itemId): Observable<NewConversationResponse> {
    return this.http.get(`api/v3/items/${itemId}/conversation`).map((r: Response) => {
      return r.json();
    });
  }

  public createConversation(itemId): Observable<Conversation> {
    const options = new RequestOptions();
    options.headers = new Headers();
    options.headers.append('Content-Type', 'application/json');
    return this.http.post(`api/v3/conversations`, JSON.stringify({item_id: itemId}), options).flatMap((r: Response) => {
      const response: ConversationResponse = r.json();
      return Observable.forkJoin(
        this.userService.get(response.other_user_id),
        this.itemService.get(itemId)
      ).map((data: any) => {
        return new Conversation(
          response.conversation_id,
          null,
          response.modified_date,
          false,
          data[0],
          data[1]);
      });
    });
  }

  public getSingleConversationMessages(conversation: Conversation) {
    return this.messageService.getMessages(conversation).map((data: MessagesData) => {
      conversation.messages = data.data;
      return conversation;
    });
  }

  private onNewMessage(message: Message, updateDate: boolean) {
    const conversation: Conversation = (<Conversation[]>this.leads).find((c: Conversation) => c.id === message.conversationId);
    const messageToUpdate: Message = conversation ? conversation.messages.find((m: Message) => m.id === message.id) : null;
    if (updateDate && messageToUpdate) {
      messageToUpdate.date = message.date;
      this.persistencyService.updateMessageDate(message);
    } else if (message.message) {
      this.persistencyService.saveMessages(message);
      if (conversation) {
        this.updateConversation(message, conversation).subscribe(() => {
          message = this.messageService.addUserInfo(conversation, message);
          if (this.addMessage(conversation, message)) {
            this.event.emit(EventService.MESSAGE_ADDED, message);
            this.leads = this.bumpConversation(conversation);
            if (!message.fromSelf) {
              this.notificationService.sendBrowserNotification(message, conversation.item.id);
            }
            this.stream$.next(this.leads);
          }
        });
      } else {
        const archivedConversationIndex: number = _.findIndex(this.archivedLeads, {'id': message.conversationId});
        if (archivedConversationIndex > -1) {
          const unarchivedConversation: Conversation = (<Conversation[]>this.archivedLeads).splice(archivedConversationIndex, 1)[0];
          unarchivedConversation.archived = false;
          this.addConversation(unarchivedConversation, message);
          this.event.emit(EventService.CONVERSATION_UNARCHIVED);
        } else {
          this.event.subscribe(EventService.MESSAGE_RECEIVED_ACK, () => {
            this.requestConversationInfo(message);
            this.event.unsubscribeAll(EventService.MESSAGE_RECEIVED_ACK);
            this.receiptSent = true;
          });
        }
      }
    }
  }

  private updateConversation(message: Message, conversation: Conversation): Observable<Conversation> {
    if (message.message.indexOf(this.PHONE_MESSAGE) !== -1 || message.message.indexOf(this.SURVEY_MESSAGE) !== -1) {
      return this.http.get(`${this.API_URL}/${conversation.id}`)
      .map((res: Response) => {
        return res.json();
      })
      .map((conversationResponse: ConversationResponse) => {
        conversation.phone = conversationResponse.buyer_phone_number;
        conversation.surveyResponses = conversationResponse.survey_responses;
        return conversation;
      });
    } else {
      return Observable.of(conversation);
    }
  }

  private bumpConversation(conversation: Conversation) {
    const index: number = this.leads.indexOf(conversation);
    if (index > 0) {
      this.leads.splice(index, 1);
      this.leads.unshift(conversation);
    }
    return this.leads;
  }

  private requestConversationInfo(message: Message) {
    this.get(message.conversationId).subscribe((conversation: Conversation) => {
      if (!(<Conversation[]>this.leads).find((c: Conversation) => c.id === message.conversationId)) {
        this.addConversation(conversation, message);
      }
    });
  }

  private addConversation(conversation: Conversation, message: Message) {
    this.sendAck(message.id, conversation.item.id, conversation.user.id, conversation.id, TrackingService.MESSAGE_RECEIVED_ACK);
    message = this.messageService.addUserInfo(conversation, message);
    this.addMessage(conversation, message);
    this.subscribeConversationRead(conversation);
    this.leads.unshift(conversation);
    this.notificationService.sendBrowserNotification(message, conversation.item.id);
    this.stream$.next(this.leads);
  }
}
