import { Component, OnDestroy, OnInit } from '@angular/core';
import { EventService } from '../core/event/event.service';
import { Conversation } from '../core/conversation/conversation';
import { Lead } from '../core/conversation/lead';
import { TrackingService } from '../core/tracking/tracking.service';
import { ConversationService } from '../core/conversation/conversation.service';
import { Filters } from '../core/conversation/conversation-filters';
import { CallTotals, ConversationTotals } from '../core/conversation/totals.interface';
import { CallsService } from '../core/conversation/calls.service';

@Component({
  selector: 'tsl-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  public phonesTotal: number;
  public messagesTotal: number;
  public completed = false;
  public conversations: Conversation[] = [];
  public calls: Lead[] = [];
  public loading = true;
  public archivedLead: Lead;
  private active = true;

  constructor(private callService: CallsService,
              private trackingService: TrackingService,
              private conversationService: ConversationService,
              private eventService: EventService) {
  }

  ngOnInit() {
    this.getData();
    this.getTotals();
    this.eventService.subscribe(
      EventService.LEAD_ARCHIVED,
      (lead: Lead) => {
        this.archivedLead = lead;
      }
    );

  }

  ngOnDestroy() {
    this.active = false;
  }

  private getData() {
    this.callService.getPage(1, false, null, 5).takeWhile(() => {
      return this.active;
    }).subscribe((calls: Lead[]) => {
      this.trackingService.track(TrackingService.PHONE_LEAD_LIST_ACTIVE_LOADED);
      this.calls = calls;
      this.conversationService.getPage(1, false, Filters.NO_PHONE, 5).takeWhile(() => {
        return this.active;
      }).subscribe((conversations: Conversation[]) => {
        this.trackingService.track(TrackingService.CONVERSATION_LIST_ACTIVE_LOADED);
        this.conversations = conversations;
        this.loading = false;
      });
    });
  }

  private getTotals() {
    this.callService.getTotals().takeWhile(() => {
      return this.active;
    }).subscribe((callsTotals: CallTotals) => {
      this.conversationService.getTotals().takeWhile(() => {
        return this.active;
      }).subscribe((conversationsTotals: ConversationTotals) => {
        this.phonesTotal = callsTotals.calls + conversationsTotals.phonesShared;
        this.messagesTotal = conversationsTotals.conversations - conversationsTotals.phonesShared;
        this.completed = (conversationsTotals.phonesShared + callsTotals.calls + conversationsTotals.meetings + conversationsTotals.messages) === 0;
      });
    });
  }

  public trackPhoneLeadOpened() {
    this.trackingService.track(TrackingService.PHONE_LEAD_OPENED);
  }
}
