import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CallsService } from '@core/conversation/calls.service';
import { Lead } from '@core/conversation/lead';
import { CallTotals } from '@core/conversation/totals.interface';
import { EventService } from '@core/event/event.service';
import { InboxConversationService } from '@private/features/chat/core/inbox/inbox-conversation.service';
import { InboxConversation } from '@private/features/chat/core/model';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'tsl-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  public phonesTotal: number;
  public messagesTotal: number;
  public hasMessagesOrCalls = false;
  public conversations: InboxConversation[] = [];
  public calls: Lead[] = [];
  public loading = true;
  public archivedLead: Lead;
  private active = true;

  constructor(
    private callService: CallsService,
    private router: Router,
    private inboxConversationService: InboxConversationService,
    private eventService: EventService
  ) {}

  ngOnInit() {
    this.getData();
    this.getTotals();
    this.eventService.subscribe(EventService.LEAD_ARCHIVED, (lead: Lead) => (this.archivedLead = lead));
    this.eventService.subscribe(
      EventService.INBOX_LOADED,
      (conversations: InboxConversation[]) => (this.conversations = this.inboxConversationService.conversations)
    );
  }

  ngOnDestroy() {
    this.active = false;
  }

  public openConversation(inboxConversation: InboxConversation): void {
    this.inboxConversationService.openConversation(inboxConversation);
    this.router.navigateByUrl(`/chat?conversationId=${inboxConversation.id}`);
  }

  public countTotalMessages(): number {
    return !this.conversations
      ? 0
      : this.conversations
          .filter((conversation, index) => !!conversation && index < 5)
          .reduce((sum, current) => sum + (current.unreadCounter < 1 ? 1 : current.unreadCounter), 0);
  }

  public hasConversations(): boolean {
    return this.conversations.length > 0;
  }

  public hasCalls(): boolean {
    return this.calls.length > 0;
  }

  private getData() {
    this.callService
      .getPage(1, false, null, 5)
      .pipe(takeWhile(() => this.active))
      .subscribe((calls: Lead[]) => {
        this.calls = calls;
        this.conversations = this.inboxConversationService.conversations;
        this.loading = false;
      });
  }

  private getTotals() {
    this.callService
      .getTotals()
      .pipe(takeWhile(() => this.active))
      .subscribe((callsTotals: CallTotals) => {
        this.phonesTotal = callsTotals.calls;
        this.messagesTotal = this.countTotalMessages();
        this.hasMessagesOrCalls = this.phonesTotal + this.messagesTotal > 0;
      });
  }
}
