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
import { InboxService } from '../inbox/inbox.service';
import { InboxConversation } from '../../chat/model';
import { RemoteConsoleService } from '../remote-console';
import { InboxConversationService } from '../inbox/inbox-conversation.service';

@Injectable()
export class ConversationService extends LeadService {

  protected API_URL = 'api/v3/protool/conversations';
  protected ARCHIVE_URL = 'api/v3/conversations';

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
  }

  protected onArchive(conversation: Conversation) {
  }

  protected onArchiveAll() {
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
