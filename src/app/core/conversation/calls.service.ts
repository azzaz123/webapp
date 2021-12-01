import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { difference, findIndex, isEmpty, map as lodashMap, reverse, sortBy } from 'lodash-es';
import { forkJoin, Observable, of, ReplaySubject } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { EventService } from '../event/event.service';
import { Item } from '../item/item';
import { ItemService } from '../item/item.service';
import { User } from '../user/user';
import { UserService } from '../user/user.service';
import { CallResponse } from './call-response.interface';
import { Call } from './calls';
import { Conversation } from './conversation';
import { Lead } from './lead';
import { LeadResponse } from './lead-response.interface';
import { CallTotals } from './totals.interface';
@Injectable()
export class CallsService {
  public PAGE_SIZE = 30;
  public API_URL = 'api/v3/protool/calls';
  public ARCHIVE_URL = 'api/v3/protool/calls';

  public leads: Lead[] = [];
  public archivedLeads: Lead[] = [];

  public stream$: ReplaySubject<Lead[]>;
  public archivedStream$: ReplaySubject<Lead[]>;

  public firstLoad: boolean;

  constructor(
    private httpClient: HttpClient,
    private userService: UserService,
    private itemService: ItemService,
    private event: EventService
  ) {
    this.stream$ = new ReplaySubject(1);
    this.archivedStream$ = new ReplaySubject(1);
  }

  public init(archived?: boolean): Observable<Lead[]> {
    return this.getLeads(null, archived).pipe(
      tap((conversations: Lead[]) => {
        if (!archived) {
          this.stream$.next(conversations);
        } else {
          this.archivedStream$.next(conversations);
        }
        this.firstLoad = false;
      })
    );
  }

  public query(until?: number, archived: boolean = false): Observable<Lead[]> {
    return this.httpClient
      .get<LeadResponse[]>(`${environment.baseUrl}${this.API_URL}`, {
        params: {
          until: until ? until.toString() : new Date().getTime().toString(),
          hidden: String(archived),
        },
      })
      .pipe(
        mergeMap((res: LeadResponse[]) => {
          return isEmpty(res)
            ? of([])
            : forkJoin(res.map((conversation: LeadResponse) => this.getUser(conversation))).pipe(
                mergeMap((response: LeadResponse[]) => {
                  return forkJoin(
                    response.map((conversation: LeadResponse) =>
                      this.getItem(conversation).pipe(
                        map((convWithItem: Lead) => {
                          convWithItem.archived = archived;
                          return convWithItem;
                        })
                      )
                    )
                  );
                })
              );
        }),
        catchError((a) => {
          return of(null);
        })
      );
  }

  public archiveAll(until?: number): Observable<any> {
    until = until || new Date().getTime();
    return this.httpClient.put(`${environment.baseUrl}${this.ARCHIVE_URL}/hide?until=${until}`, {}).pipe(
      map(() => {
        this.leads = this.bulkArchive(this.leads);
        this.stream();
      })
    );
  }

  public stream(archive?: boolean) {
    if (archive) {
      this.archivedStream$.next(this.archivedLeads);
    } else {
      this.stream$.next(this.leads);
    }
  }

  public syncItem(item: Item) {
    const replaceItem = (lead: Lead) => {
      if (lead.item.id === item.id) {
        lead.item = item;
      }
    };
    this.leads.forEach(replaceItem);
    this.archivedLeads.forEach(replaceItem);
  }

  public archive(id: string): Observable<Lead> {
    return this.httpClient.put(`${environment.baseUrl}${this.ARCHIVE_URL}/${id}/hide`, {}).pipe(
      map(() => {
        const index: number = findIndex(this.leads, { id: id });
        if (index > -1) {
          const deletedLead: Lead = this.leads.splice(index, 1)[0];
          deletedLead.archived = true;
          this.archivedLeads.push(deletedLead);
          this.stream(true);
          this.stream();
          this.event.emit(EventService.LEAD_ARCHIVED, deletedLead);
          return deletedLead;
        }
      })
    );
  }
  public getPage(page: number, archive?: boolean, status?: string, pageSize: number = this.PAGE_SIZE): Observable<Lead[]> {
    const init: number = (page - 1) * pageSize;
    const end: number = init + pageSize;
    return (archive ? this.archivedStream$ : this.stream$).asObservable().pipe(
      map((calls: Lead[]) => {
        if (status) {
          const statuses: string[] = status.split(',');
          let bool: boolean;
          return calls.filter((call: Lead) => {
            bool = false;
            statuses.forEach((callStatus: string) => {
              if (callStatus === 'SHARED') {
                bool = bool || call instanceof Conversation;
              } else {
                bool = bool || (call instanceof Call && call.callStatus === callStatus);
              }
            });
            return bool;
          });
        }
        return calls;
      }),
      map((calls: Lead[]) => reverse(sortBy(calls, 'modifiedDate'))),
      map((calls: Lead[]) => calls.slice(0, end))
    );
  }

  public getTotals(): Observable<CallTotals> {
    return this.stream$.pipe(
      mergeMap((calls: Call[]) => {
        return this.archivedStream$.pipe(
          map((archivedCalls: Call[]) => {
            return {
              calls: calls.length,
              archived: archivedCalls.length,
            };
          })
        );
      })
    );
  }
  public unarchive(id: string): Observable<Lead> {
    return this.httpClient.put(`${environment.baseUrl}${this.ARCHIVE_URL}/${id}/unhide`, {}).pipe(
      map(() => {
        const index: number = findIndex(this.archivedLeads, { id: id });
        if (index > -1) {
          const lead: Lead = this.archivedLeads.splice(index, 1)[0];
          lead.archived = false;
          this.leads.push(lead);
          this.stream(true);
          this.stream();
          this.event.emit(EventService.CONVERSATION_UNARCHIVED);
          return lead;
        }
      })
    );
  }

  protected getLastDate(conversations: Lead[]): number {
    if (conversations.length > 0 && conversations[conversations.length - 1] && conversations[conversations.length - 1].modifiedDate) {
      return conversations[conversations.length - 1].modifiedDate - 1;
    }
  }

  protected getUser(conversation: LeadResponse): Observable<LeadResponse> {
    if (!conversation.user_id) {
      conversation.user = new User(null);
      return of(conversation);
    }
    return this.userService.get(conversation.user_id).pipe(
      map((user: User) => {
        conversation.user = user;
        return conversation;
      })
    );
  }

  protected getItem(conversation: LeadResponse): Observable<Lead> {
    if (!conversation.item_id) {
      return of(conversation).pipe(map((data: CallResponse) => this.mapRecordData(data)));
    }
    return this.itemService.get(conversation.item_id).pipe(
      map((item: Item) => this.setItem(conversation, item)),
      map((data: CallResponse) => this.mapRecordData(data))
    );
  }

  protected setItem(conv: LeadResponse, item: Item): LeadResponse {
    conv.item = item;
    conv.user.itemDistance = this.userService.calculateDistanceFromItem(conv.user, conv.item);
    return conv;
  }

  protected bulkArchive(leads: Lead[]): Lead[] {
    leads.forEach((lead: Lead) => (lead.archived = true));
    this.archivedLeads.push(...leads);
    return [];
  }

  protected getLeads(since?: number, archived?: boolean): Observable<Call[]> {
    // do not execute anything unless is more than 30 sec after last call
    return this.query(since, archived).pipe(
      map((calls: Call[]) => {
        if (calls && calls.length > 0) {
          if (!archived) {
            const diff: any[] = difference(lodashMap(calls, 'id'), lodashMap(this.leads, 'id'));
            const result: Call[] = calls.filter((call: Call) => {
              return diff.indexOf(call.id) >= 0;
            });
            this.leads = this.leads.concat(result);
          } else {
            this.archivedLeads = this.archivedLeads.concat(calls);
          }
        }
        return calls;
      })
    );
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
}
