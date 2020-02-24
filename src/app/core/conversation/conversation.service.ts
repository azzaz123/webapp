import { remove } from 'lodash-es';
import { Injectable, NgZone } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpService } from '../http/http.service';
import { Conversation } from './conversation';
import { ConnectionService } from '../connection/connection.service';
import { UserService } from '../user/user.service';
import { ItemService } from '../item/item.service';
import { MessageService } from '../message/message.service';
import { EventService } from '../event/event.service';
import { PersistencyService } from '../persistency/persistency.service';
import { NotificationService } from '../notification/notification.service';
import { LeadService } from './lead.service';
import { ConversationResponse } from './conversation-response.interface';
import { Filter } from './filter.interface';
import { TrackingService } from '../tracking/tracking.service';
import { Subscription } from 'rxjs/Subscription';
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
    return of({});
  }

  public getPage(page: number, archive?: boolean, filters?: Filter[], pageSize: number = this.PAGE_SIZE): Observable<Conversation[]> {
    return of([]);
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

  public sendRead(conversation: Conversation) {
    if (conversation.unreadMessages > 0) {
      this.readSubscription = this.event.subscribe(EventService.MESSAGE_READ_ACK, () => {
        const readSignal = new ChatSignal(chatSignalType.READ, conversation.id, null, null, true);
        this.readSubscription.unsubscribe();
      });
      this.realTime.sendRead(conversation.user.id, conversation.id);
      this.messageService.totalUnreadMessages -= conversation.unreadMessages;
      conversation.unreadMessages = 0;
    }
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
}
