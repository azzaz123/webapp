import { Component, EventEmitter, Input, Output } from '@angular/core';
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

@Component({
  selector: 'tsl-conversation-details-bar',
  templateUrl: './conversation-details-bar.component.html',
  styleUrls: ['./conversation-details-bar.component.scss'],
})
export class ConversationDetailsBarComponent {
  @Input() currentConversation: InboxConversation;
  @Input() isExpanded = false;
  @Output() blockUserEvent = new EventEmitter();
  @Output() expandContainer = new EventEmitter();

  constructor(
    private eventService: EventService,
    private modalService: NgbModal,
    private toastService: ToastService,
    private reportService: ReportService,
    private blockUserService: BlockUserService,
    private blockUserXmppService: BlockUserXmppService,
    private i18n: I18nService,
    private inboxConversationService: InboxConversationService
  ) {}

  public showReportListing(): boolean {
    const { isMine, notAvailable } = this.currentConversation.item;
    return !isMine && !notAvailable;
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
          text: this.i18n.getTranslations('archiveConversationSuccess'),
          type: 'success',
        });
        this.eventService.emit(EventService.CURRENT_CONVERSATION_SET, null);
      });
    });
  }

  public unarchiveConversation() {
    this.modalService.open(UnarchiveInboxConversationComponent).result.then(() => {
      this.inboxConversationService.unarchive(this.currentConversation).subscribe(() => {
        this.toastService.show({
          text: this.i18n.getTranslations('unarchiveConversationSuccess'),
          type: 'success',
        });
        this.eventService.emit(EventService.CURRENT_CONVERSATION_SET, null);
      });
    });
  }

  public reportUserAction(): void {
    this.modalService.open(ReportUserComponent, { windowClass: 'report' }).result.then((result: any) => {
      this.reportService
        .reportUser(
          this.currentConversation.user.id,
          this.currentConversation.item.id,
          this.currentConversation.id,
          result.reason,
          result.message
        )
        .subscribe(() => {
          this.toastService.show({
            text: this.i18n.getTranslations('reportUserSuccess'),
            type: 'success',
          });
        });
    });
  }

  public reportListingAction(): void {
    this.modalService.open(ReportListingComponent, { windowClass: 'report' }).result.then((result: any) => {
      this.reportService.reportListing(this.currentConversation.item.id, result.message, result.reason).subscribe(
        () => {
          this.toastService.show({
            text: this.i18n.getTranslations('reportListingSuccess'),
            type: 'success',
          });
        },
        (error: any) => {
          if (error.status === 403) {
            this.toastService.show({
              text: this.i18n.getTranslations('reportListingSuccess'),
              type: 'success',
            });
          } else {
            this.toastService.show({
              text: this.i18n.getTranslations('serverError') + ' ' + error.json().message,
              type: 'error',
            });
          }
        }
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
              text: this.i18n.getTranslations('blockUserSuccess'),
              type: 'success',
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
              text: this.i18n.getTranslations('unblockUserSuccess'),
              type: 'success',
            });
          });
        },
        () => {}
      );
    });
  }
}
