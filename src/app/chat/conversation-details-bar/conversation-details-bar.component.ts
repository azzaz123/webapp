import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InboxConversation } from '../model';
import { ArchiveInboxConversationComponent } from '../modals/archive-inbox-conversation';
import { EventService } from '../../core/event/event.service';
import { UnarchiveInboxConversationComponent } from '../modals/unarchive-inbox-conversation';
import { ReportUserComponent } from '../modals/report-user';
import { TrackingService } from '../../core/tracking/tracking.service';
import { ReportListingComponent } from '../modals/report-listing';
import { BlockUserComponent } from '../modals/block-user';
import { UnblockUserComponent } from '../modals/unblock-user';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../core/user/user.service';
import { ItemService } from '../../core/item/item.service';
import { BlockUserService, BlockUserXmppService, InboxConversationService } from '../service';
import { I18nService } from '../../core/i18n/i18n.service';

@Component({
  selector: 'tsl-conversation-details-bar',
  templateUrl: './conversation-details-bar.component.html',
  styleUrls: ['./conversation-details-bar.component.scss']
})
export class ConversationDetailsBarComponent {

  @Input() currentConversation: InboxConversation;
  @Output() blockUserEvent = new EventEmitter();
  @Output() expandContainer = new EventEmitter();

  public isExpanded = false;

  constructor(private eventService: EventService,
              private modalService: NgbModal,
              private toastr: ToastrService,
              private trackingService: TrackingService,
              private userService: UserService,
              private itemService: ItemService,
              private blockUserService: BlockUserService,
              private blockUserXmppService: BlockUserXmppService,
              private i18n: I18nService,
              private inboxConversationService: InboxConversationService) {
  }

  public itemIsMine(): boolean {
    return this.currentConversation.item.isMine;
  }

  public currentConversationisArchived(): boolean {
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
        this.toastr.success(this.i18n.getTranslations('archiveConversationSuccess'));
        this.eventService.emit(EventService.CURRENT_CONVERSATION_SET, null);
      });
    });
  }

  public unarchiveConversation() {
    this.modalService.open(UnarchiveInboxConversationComponent).result.then(() => {
      this.inboxConversationService.unarchive(this.currentConversation).subscribe(() => {
        this.toastr.success(this.i18n.getTranslations('unarchiveConversationSuccess'));
        this.eventService.emit(EventService.CURRENT_CONVERSATION_SET, null);
      });
    });
  }

  public reportUserAction(): void {
    this.modalService.open(ReportUserComponent, { windowClass: 'report' }).result.then((result: any) => {
      this.userService.reportUser(
        this.currentConversation.user.id,
        this.currentConversation.item.id,
        this.currentConversation.id,
        result.reason,
        result.message
      ).subscribe(() => {
        this.trackingService.track(TrackingService.USER_PROFILE_REPPORTED,
          { user_id: this.currentConversation.user.id, reason_id: result.reason });
        this.toastr.success(this.i18n.getTranslations('reportUserSuccess'));
      });
    });
  }

  public reportListingAction(): void {
    this.modalService.open(ReportListingComponent, { windowClass: 'report' }).result.then((result: any) => {
      this.itemService.reportListing(
        this.currentConversation.item.id,
        result.message,
        result.reason
      ).subscribe(() => {
        this.trackingService.track(TrackingService.PRODUCT_REPPORTED,
          { product_id: this.currentConversation.item.id, reason_id: result.reason });
        this.toastr.success(this.i18n.getTranslations('reportListingSuccess'));
      }, (error: any) => {
        if (error.status === 403) {
          this.toastr.success(this.i18n.getTranslations('reportListingSuccess'));
        } else {
          this.toastr.error(this.i18n.getTranslations('serverError') + ' ' + error.json().message);
        }
      });
    });
  }

  public blockUserAction() {
    this.modalService.open(BlockUserComponent).result.then(() => {
      this.blockUserService.blockUser(this.currentConversation.user.id).subscribe(() => {
        this.blockUserXmppService.blockUser(this.currentConversation.user).subscribe(() => {
          this.blockUserEvent.emit();
          this.toastr.success(this.i18n.getTranslations('blockUserSuccess'));
        });
      }, () => {
      });
    });
  }

  public unblockUserAction() {
    this.modalService.open(UnblockUserComponent).result.then(() => {
      this.blockUserService.unblockUser(this.currentConversation.user.id).subscribe(() => {
        this.blockUserXmppService.unblockUser(this.currentConversation.user).subscribe(() => {
          this.toastr.success(this.i18n.getTranslations('unblockUserSuccess'));
        });
      }, () => {
      });
    });
  }
}
