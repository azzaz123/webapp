import { Injectable } from '@angular/core';
import { Call } from './calls';
import { HttpService } from '../http/http.service';
import { UserService } from '../user/user.service';
import { ItemService } from '../item/item.service';
import { EventService } from '../event/event.service';
import { ConversationService } from './conversation.service';
import { LeadService } from './lead.service';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { Lead } from './lead';
import { Conversation } from './conversation';
import { CallTotals } from './totals.interface';
import { CallResponse } from './call-response.interface';
import { ConnectionService } from '../connection/connection.service';
import { RealTimeService } from '../message/real-time.service';
import { BlockUserXmppService } from './block-user';

@Injectable()
export class CallsService extends LeadService {

  protected API_URL = 'api/v3/protool/calls';
  protected ARCHIVE_URL: string = this.API_URL;

  private lastCall = 0;
  private lastLeadResponse: Call[];

  constructor(http: HttpService,
              userService: UserService,
              itemService: ItemService,
              event: EventService,
              realTime: RealTimeService,
              blockService: BlockUserXmppService,
              connectionService: ConnectionService,
              private conversationService: ConversationService ) {
    super(http, userService, itemService, event, realTime, blockService, connectionService);
  }

  protected getLeads(since?: number, archived?: boolean): Observable<Call[]> {
    // do not execute anything unless is more than 30 sec after last call

    return this.query(since, archived)
    .map((calls: Call[]) => {
      if (calls && calls.length > 0) {
        if (!archived) {
          const diff: any[] = _.difference(_.map(calls, 'id'), _.map(this.leads, 'id'));
          const result: Call[] = calls.filter((call: Call) => {
            return diff.indexOf(call.id) >= 0;
          });
          this.leads = this.leads.concat(result);
        } else {
          this.archivedLeads = this.archivedLeads.concat(calls);
        }
      }
      this.lastLeadResponse = calls;
      return calls;
    });
  }

  public getPage(page: number, archive?: boolean, status?: string, pageSize: number = this.PAGE_SIZE): Observable<Lead[]> {
    const init: number = (page - 1) * pageSize;
    const end: number = init + pageSize;
    return (archive ? this.archivedStream$ : this.stream$).asObservable()
    .map((calls: Lead[]) => {
      if (status) {
        const statuses: string[] = status.split(',');
        let bool: boolean;
        return calls.filter((call: Lead) => {
          bool = false;
          statuses.forEach((callStatus: string) => {
            if (callStatus === 'SHARED') {
              bool = bool || call instanceof Conversation;
            } else {
              bool = bool || call instanceof Call && call.callStatus === callStatus;
            }
          });
          return bool;
        });
      }
      return calls;
    })
    .map((calls: Lead[]) => {
      return _.reverse(_.sortBy(calls, 'modifiedDate'));
    })
    .map((calls: Lead[]) => {
      return calls.slice(0, end);
    });
  }

  public getTotals(): Observable<CallTotals> {
    return this.stream$
    .flatMap((calls: Call[]) => {
      return this.archivedStream$
      .map((archivedCalls: Call[]) => {
        return {
          calls: calls.length,
          archived: archivedCalls.length
        };
      });
    });
  }

  protected mapRecordData(data: CallResponse): Call {
    return new Call(
      data.id,
      data.legacy_id,
      data.modified_date,
      data.buyer_phone_number,
      data.call_duration,
      data.call_status,
      data.user,
      data.item,
      [],
      false,
      data.survey_responses
    );
  }

  protected onArchive(lead: Lead) {
  }

  protected onArchiveAll() {
    this.leads = this.bulkArchive(this.leads);
    this.conversationService.archiveWithPhones();
    this.stream();
    this.conversationService.stream();
  }
}
