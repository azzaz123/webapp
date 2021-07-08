import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EventService } from '@core/event/event.service';
import { I18nService } from '@core/i18n/i18n.service';
import { BlockUserXmppService } from '@private/features/chat/core/block-user/block-user-xmpp.service';
import { BlockUserService } from '@private/features/chat/core/block-user/block-user.service';
import { InboxConversationService } from '@private/features/chat/core/inbox/inbox-conversation.service';
import { InboxConversation } from '@private/features/chat/core/model';
import {
  ArchiveInboxConversationComponent,
  BlockUserComponent,
  ReportListingComponent,
  ReportUserComponent,
  UnarchiveInboxConversationComponent,
  UnblockUserComponent,
} from '@private/features/chat/modals';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReportService } from '@core/trust-and-safety/report/report.service';
import { UserReportRequest } from '@core/trust-and-safety/report/interfaces/user/user-report-request.interface';
import { ErrorsService } from '@core/errors/errors.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { TOAST_TYPES } from '@layout/toast/core/interfaces/toast.interface';

@Component({
  selector: 'tsl-conversation-details-bar',
  templateUrl: './conversation-details-bar.component.html',
  styleUrls: ['./conversation-details-bar.component.scss'],
})
export class ConversationDetailsBarComponent implements OnInit {
  @Input() currentConversation: InboxConversation;
  @Input() isExpanded = false;
  @Output() blockUserEvent = new EventEmitter();
  @Output() expandContainer = new EventEmitter();
  public showReportListing = false;

  constructor(
    private eventService: EventService,
    private modalService: NgbModal,
    private toastService: ToastService,
    private reportService: ReportService,
    private blockUserService: BlockUserService,
    private blockUserXmppService: BlockUserXmppService,
    private i18n: I18nService,
    private errorService: ErrorsService,
    private inboxConversationService: InboxConversationService
  ) {}

  ngOnInit() {
    this.setShowReportListing();
  }

  public currentConversationIsArchived(): boolean {
    return this.inboxConversationService.containsArchivedConversation(this.currentConversation);
  }

  public expand(): void {
    this.isExpanded = !this.isExpanded;
    this.expandContainer.emit(this.isExpanded);
  }

  public navigationBack(): void {
    this.eventService.emit(EventService.CURRENT_CONVERSATION_SET, null);
  }

  public archiveConversation(): void {
    this.modalService.open(ArchiveInboxConversationComponent).result.then(() => {
      this.inboxConversationService.archive$(this.currentConversation).subscribe(() => {
        this.toastService.show({
          text: this.i18n.translate(TRANSLATION_KEY.CHAT_ARCHIVE_CONVERSATION_SUCCESS),
          type: TOAST_TYPES.SUCCESS,
        });
        this.eventService.emit(EventService.CURRENT_CONVERSATION_SET, null);
      });
    });
  }

  public unarchiveConversation() {
    this.modalService.open(UnarchiveInboxConversationComponent).result.then(() => {
      this.inboxConversationService.unarchive(this.currentConversation).subscribe(() => {
        this.toastService.show({
          text: this.i18n.translate(TRANSLATION_KEY.CHAT_UNARCHIVE_CONVERSATION_SUCCESS),
          type: TOAST_TYPES.SUCCESS,
        });
        this.eventService.emit(EventService.CURRENT_CONVERSATION_SET, null);
      });
    });
  }

  public reportUserAction(): void {
    this.modalService.open(ReportUserComponent, { windowClass: 'report' }).result.then((result: any) => {
      const userReportRequest: UserReportRequest = {
        userId: this.currentConversation.user.id,
        itemHashId: this.currentConversation.item.id,
        conversationHash: this.currentConversation.id,
        reason: result.reason,
        comments: result.message,
        targetCrm: 'zendesk',
      };
      this.reportService.reportUser(userReportRequest).subscribe(() => {
        this.toastService.show({
          text: this.i18n.translate(TRANSLATION_KEY.CHAT_REPORT_USER_SUCCESS),
          type: TOAST_TYPES.SUCCESS,
        });
      });
    });
  }

  public reportListingAction(): void {
    this.modalService.open(ReportListingComponent, { windowClass: 'report' }).result.then((result: any) => {
      this.reportService.reportItem(this.currentConversation.item.id, result.message, result.reason).subscribe(
        () => {
          this.toastService.show({
            text: this.i18n.translate(TRANSLATION_KEY.CHAT_REPORT_LISTING_SUCCESS),
            type: TOAST_TYPES.SUCCESS,
          });
        },
        (error) => this.errorService.show(error)
      );
    });
  }

  public blockUserAction() {
    this.modalService.open(BlockUserComponent).result.then(() => {
      this.blockUserService.blockUser(this.currentConversation.user.id).subscribe(
        () => {
          this.blockUserXmppService.blockUser(this.currentConversation.user).subscribe(() => {
            this.blockUserEvent.emit();
            this.toastService.show({
              text: this.i18n.translate(TRANSLATION_KEY.CHAT_BLOCK_USER_SUCCESS),
              type: TOAST_TYPES.SUCCESS,
            });
          });
        },
        () => {}
      );
    });
  }

  public unblockUserAction() {
    this.modalService.open(UnblockUserComponent).result.then(() => {
      this.blockUserService.unblockUser(this.currentConversation.user.id).subscribe(
        () => {
          this.blockUserXmppService.unblockUser(this.currentConversation.user).subscribe(() => {
            this.toastService.show({
              text: this.i18n.translate(TRANSLATION_KEY.CHAT_UNBLOCK_USER_SUCCESS),
              type: TOAST_TYPES.SUCCESS,
            });
          });
        },
        () => {}
      );
    });
  }

  private setShowReportListing(): void {
    const { isMine, notAvailable } = this.currentConversation.item;
    this.showReportListing = !isMine && !notAvailable;
  }
}
