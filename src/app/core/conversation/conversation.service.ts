import { reverse, sortBy, remove, find, findIndex, isEmpty } from 'lodash-es';
import { Injectable, NgZone } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpService } from '../http/http.service';
import { Conversation } from './conversation';
import { ConnectionService } from '../connection/connection.service';
import { UserService } from '../user/user.service';
import { ItemService } from '../item/item.service';
import { MessageService } from '../message/message.service';
import { Message, messageStatus, statusOrder } from '../message/message';
import { EventService } from '../event/event.service';
import { PersistencyService } from '../persistency/persistency.service';
import { MessagesData } from '../message/messages.interface';
import { Headers, RequestOptions, Response } from '@angular/http';
import { NotificationService } from '../notification/notification.service';
import { LeadService } from './lead.service';
import { ConversationResponse, NewConversationResponse } from './conversation-response.interface';
import { Filter } from './filter.interface';
import { Filters } from './conversation-filters';
import { TrackingService } from '../tracking/tracking.service';
import { ConversationTotals } from './totals.interface';
import { Item } from '../item/item';
import { Subscription } from 'rxjs/Subscription';
import { TrackingEventData } from '../tracking/tracking-event-base.interface';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/share';
import 'rxjs/add/observable/forkJoin';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SendPhoneComponent } from '../../chat/modals/send-phone/send-phone.component';
import { RealTimeService } from '../message/real-time.service';
import { BlockUserXmppService } from './block-user';
import { ChatSignal, chatSignalType } from '../message/chat-signal.interface';
import { InboxService } from '../inbox/inbox.service';
import { InboxConversation } from '../../chat/model';
import { RemoteConsoleService } from '../remote-console';
import { InboxConversationService } from '../inbox/inbox-conversation.service';

@Injectable()
export class ConversationService extends LeadService {

  protected API_URL = 'api/v3/protool/conversations';
  protected ARCHIVE_URL = 'api/v3/conversations';
  private PHONE_MESSAGE = 'Mi número de teléfono es';
  private SURVEY_MESSAGE = 'Ya he respondido a tus preguntas';

  private readSubscription: Subscription;

  public storedPhoneNumber: string;
  private phoneRequestType;
  public ended = {
    pending: false,
    processed: false
  };

  constructor(http: HttpService,
              userService: UserService,
              itemService: ItemService,
              event: EventService,
              realTime: RealTimeService,
              blockService: BlockUserXmppService,
              connectionService: ConnectionService,
              private persistencyService: PersistencyService,
              protected messageService: MessageService,
              protected trackingService: TrackingService,
              protected notificationService: NotificationService,
              private inboxService: InboxService,
              private inboxConversationService: InboxConversationService,
              private remoteConsole: RemoteConsoleService,
              private modalService: NgbModal,
              private zone: NgZone) {
    super(http, userService, itemService, event, realTime, blockService, connectionService);
  }

  public getLeads(since?: number, archived?: boolean): Observable<Conversation[]> {
    return Observable.of([]);
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
        conversations = this.markBlockedUsers(conversations);
        return conversations;
      })
      .map((filteredConversations: Conversation[]) => {
        return reverse(sortBy(filteredConversations, 'modifiedDate'));
      })
      .map((sortedConversations: Conversation[]) => {
        return sortedConversations.slice(0, end);
      });
  }

  private markBlockedUsers(conversations: Conversation[]): Conversation[] {
    const blockedUsers = this.blockService.getBlockedUsers();
    conversations.filter(conv => blockedUsers.indexOf(conv.user.id) !== -1).map(conv => conv.user.blocked = true);
    return conversations;
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

  public openPhonePopup(conversation: Conversation | InboxConversation, required = false) {
    const modalOptions: NgbModalOptions = { windowClass: 'phone-request', backdrop: 'static', keyboard: false };
    const modalRef: NgbModalRef = this.modalService.open(SendPhoneComponent, modalOptions);
    modalRef.componentInstance.conversation = conversation;
    modalRef.componentInstance.required = required;
    modalRef.componentInstance.phone = this.storedPhoneNumber;
    if (required) {
      this.trackingService.addTrackingEvent({
        eventData: TrackingService.ITEM_SHAREPHONE_SHOWFORM,
        attributes: { item_id: conversation.item.id }
      });
    }
  }

  public checkIfLastPage(archive: boolean = false): Observable<any> {
    const lastDate: number = archive ? this.getLastDate(this.archivedLeads) : this.getLastDate(this.leads);
    if (lastDate) {
      return this.http.get(this.API_URL, { until: lastDate, hidden: archive })
      .map((res: Response) => res.json())
      .map((res: ConversationResponse[]) => {
        if (res.length === 0) {
          archive ? this.ended.processed = true : this.ended.pending = true;
        }
      });
    }
    return Observable.of({});
  }

  public archiveWithPhones() {
    const archivedConversations: Conversation[] = remove(<Conversation[]>this.leads, (conversation: Conversation) => {
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

  public loadMessagesIntoConversations(conversations: Conversation[], archived: boolean = false): Observable<Conversation[]> {
    this.event.subscribe(EventService.FOUND_MESSAGES_IN_DB, () => {
      this.loadNotStoredMessages(conversations, archived);
      this.event.unsubscribeAll(EventService.FOUND_MESSAGES_IN_DB);
    });

    return this.loadMessages(conversations).map((convWithMessages: Conversation[]) => {
      if (convWithMessages) {
      return convWithMessages.filter((conversation: Conversation) => {
        return conversation.messages.length > 0;
      });
      } else {
        return null;
      }
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

  private findMessage(messages: Message[], message: Message): Message {
    return messages.filter((msg: Message): boolean => {
      return (msg.id === message.id);
    })[0];
  }

  private addMessage(conversation: Conversation, message: Message): boolean {
    if (!this.findMessage(conversation.messages, message)) {
      conversation.messages.push(message);
      conversation.modifiedDate = new Date().getTime();
      if (!message.fromSelf) {
        this.event.subscribe(EventService.MESSAGE_RECEIVED_ACK, () => {
          const trackEvent: TrackingEventData = {
            eventData: TrackingService.MESSAGE_RECEIVED_ACK,
            attributes: {
              thread_id: message.thread,
              message_id: message.id
            }
          };
          this.trackingService.addTrackingEvent(trackEvent, false);
          this.event.unsubscribeAll(EventService.MESSAGE_RECEIVED_ACK);
        });
        this.handleUnreadMessage(conversation);
      }
      return true;
    }
  }

  public processChatSignal(signal: ChatSignal) {
    switch (signal.type) {
      case chatSignalType.SENT:
        this.remoteConsole.sendAcceptTimeout(signal.messageId);
        this.markAs(messageStatus.SENT, signal.messageId, signal.thread);
        break;
      case chatSignalType.RECEIVED:
        this.markAs(messageStatus.RECEIVED, signal.messageId, signal.thread);
        break;
      case chatSignalType.READ:
        /* the last argument passed to markAllAsRead is the reverse of fromSelf, as markAllAsRead method uses it to filter which messages
           it should mark with status 'read'; when receiving a READ signal fromSelf we want to mark as 'read' messages from other */
        this.markAllAsRead(signal.thread, signal.timestamp, !signal.fromSelf);
        break;
      default:
        break;
    }
  }

  private markAllAsRead(thread: string, timestamp?: number, markMessagesFromSelf: boolean = false) {
    const conversation = this.leads.find(c => c.id === thread) || this.archivedLeads.find(c => c.id === thread);
    if (conversation) {
      const unreadMessages = conversation.messages.filter(message => (message.status === messageStatus.RECEIVED ||
        message.status === messageStatus.SENT) && (markMessagesFromSelf ? message.fromSelf &&
        new Date(message.date).getTime() <= timestamp : !message.fromSelf));
      unreadMessages.map((message) => {
        message.status = messageStatus.READ;
        const eventAttributes = {
          thread_id: message.thread,
          message_id: message.id
        };
        this.trackingService.addTrackingEvent({
          eventData: markMessagesFromSelf ? TrackingService.MESSAGE_READ : TrackingService.MESSAGE_READ_ACK,
          attributes: eventAttributes
        }, false);
      });
      if (!markMessagesFromSelf) {
        conversation.unreadMessages -= unreadMessages.length;
        this.messageService.totalUnreadMessages -= unreadMessages.length;
      }
    }
  }

  private markAs(newStatus: string, messageId: string, thread: string) {
    const conversation = this.leads.find(c => c.id === thread) || this.archivedLeads.find(c => c.id === thread);
    if (!conversation) {
      return;
    }
    const message = conversation.messages.find(m => m.id === messageId);
    if (!message) {
      return;
    }

    if (!message.status || statusOrder.indexOf(newStatus) > statusOrder.indexOf(message.status) || message.status === null) {
      message.status = newStatus;
    }

    const trackingEv: TrackingEventData = {
      eventData: null,
      attributes: {
        thread_id: message.thread,
        message_id: message.id
      }
    };

    switch (newStatus) {
      case messageStatus.SENT:
        trackingEv.eventData = TrackingService.MESSAGE_SENT_ACK;
        break;
      case messageStatus.RECEIVED:
        trackingEv.eventData = TrackingService.MESSAGE_RECEIVED;
        break;
    }

    this.trackingService.addTrackingEvent(trackingEv, false);
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
        conversation = <ConversationResponse>this.setItem(conversation, data[0]);
        return conversation;
      });
    })
    .map((data: ConversationResponse) => this.mapRecordData(data));
  }

  public sendRead(conversation: Conversation) {
    if (conversation.unreadMessages > 0) {
      this.readSubscription = this.event.subscribe(EventService.MESSAGE_READ_ACK, () => {
        const readSignal = new ChatSignal(chatSignalType.READ, conversation.id, null, null, true);
        this.processChatSignal(readSignal);
        this.readSubscription.unsubscribe();
      });
      this.realTime.sendRead(conversation.user.id, conversation.id);
      this.messageService.totalUnreadMessages -= conversation.unreadMessages;
      conversation.unreadMessages = 0;
    }
  }

  private handleUnreadMessage(conversation: Conversation) {
    this.zone.run(() => {
      conversation.unreadMessages++;
      this.messageService.totalUnreadMessages++;
    });
  }

  private loadMessages(conversations: Conversation[]): Observable<Conversation[]> {
    return of(conversations);
  }

  public loadNotStoredMessages(conversations: Conversation[], archived: boolean = false) {
    this.messageService.getNotSavedMessages(conversations, archived).subscribe();
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

  public getItemFromThread(thread: string): Item {
    return find(this.leads, { id: thread }).item;
  }

  public getByItemId(itemId): Observable<NewConversationResponse> {
    return this.http.get(`api/v3/items/${itemId}/conversation`).map((r: Response) => {
      return r.json();
    });
  }

  public createConversation(itemId: string): Observable<Conversation> {
    const options = new RequestOptions();
    options.headers = new Headers();
    options.headers.append('Content-Type', 'application/json');
    return this.http.post(`api/v3/conversations`, JSON.stringify({ item_id: itemId }), options).flatMap((r: Response) => {
      const response: ConversationResponse = r.json();
      return Observable.forkJoin(
        this.userService.get(response.other_user_id),
        this.itemService.get(itemId),
        this.userService.getPhoneInfo(response.other_user_id)
      ).map((data: any) => {
        const userResponse = data[0];
        const itemResponse = data[1];
        const phoneMethodResponse = data[2];
        if (phoneMethodResponse) {
          this.phoneRequestType = phoneMethodResponse.phone_method;
        }
        return new Conversation(
          response.conversation_id,
          null,
          response.modified_date,
          false,
          userResponse,
          itemResponse);
      });
    });
  }

  public getSingleConversationMessages(conversation: Conversation) {
    return this.messageService.getMessages(conversation, true).map((res: MessagesData) => {
      conversation.messages = res.data;
      if (!conversation.messages.length && this.phoneRequestType) {
        this.event.emit(EventService.REQUEST_PHONE, this.phoneRequestType);
      }
      conversation.unreadMessages = res.data.filter(m => !m.fromSelf && m.status !== messageStatus.READ).length;
      this.messageService.totalUnreadMessages = this.messageService.totalUnreadMessages ?
        this.messageService.totalUnreadMessages + conversation.unreadMessages :
        conversation.unreadMessages;
      this.event.emit(EventService.CHAT_CAN_PROCESS_RT, true);
      return conversation;
    });
  }
}
