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
import { ToastService } from '../../layout/toast/toast.service';
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
  @Input() isExpanded = false;
  @Output() blockUserEvent = new EventEmitter();
  @Output() expandContainer = new EventEmitter();

  constructor(private eventService: EventService,
              private modalService: NgbModal,
              private toastService: ToastService,
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
        this.toastService.show({text:this.i18n.getTranslations('archiveConversationSuccess'), type:'success'});
        this.eventService.emit(EventService.CURRENT_CONVERSATION_SET, null);
      });
    });
  }

  public unarchiveConversation() {
    this.modalService.open(UnarchiveInboxConversationComponent).result.then(() => {
      this.inboxConversationService.unarchive(this.currentConversation).subscribe(() => {
        this.toastService.show({text:this.i18n.getTranslations('unarchiveConversationSuccess'), type:'success'});
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
        this.toastService.show({text:this.i18n.getTranslations('reportUserSuccess'), type:'success'});
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
        this.toastService.show({text:this.i18n.getTranslations('reportListingSuccess'), type:'success'});
      }, (error: any) => {
        if (error.status === 403) {
          this.toastService.show({text:this.i18n.getTranslations('reportListingSuccess'), type:'success'});
        } else {
          this.toastService.show({text:this.i18n.getTranslations('serverError') + ' ' + error.json().message, type:'error'});
        }
      });
    });
  }

  public blockUserAction() {
    this.modalService.open(BlockUserComponent).result.then(() => {
      this.blockUserService.blockUser(this.currentConversation.user.id).subscribe(() => {
        this.blockUserXmppService.blockUser(this.currentConversation.user).subscribe(() => {
          this.blockUserEvent.emit();
          this.toastService.show({text:this.i18n.getTranslations('blockUserSuccess'), type:'success'});
        });
      }, () => {
      });
    });
  }

  public unblockUserAction() {
    this.modalService.open(UnblockUserComponent).result.then(() => {
      this.blockUserService.unblockUser(this.currentConversation.user.id).subscribe(() => {
        this.blockUserXmppService.unblockUser(this.currentConversation.user).subscribe(() => {
          this.toastService.show({text:this.i18n.getTranslations('unblockUserSuccess'), type:'success'});
        });
      }, () => {
      });
    });
  }
}
