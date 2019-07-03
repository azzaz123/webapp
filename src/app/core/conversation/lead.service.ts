import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Observable } from 'rxjs';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Response } from '@angular/http';
import { LeadResponse } from './lead-response.interface';
import { User } from '../user/user';
import { Item } from '../item/item';
import { UserService } from '../user/user.service';
import { ItemService } from '../item/item.service';
import { Lead } from './lead';
import * as _ from 'lodash';
import { EventService } from '../event/event.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/do';
import { ConnectionService } from '../connection/connection.service';
import { RealTimeService } from '../message/real-time.service';
import { BlockUserXmppService } from './block-user';

@Injectable()
export abstract class LeadService {

  protected API_URL: string;
  protected ARCHIVE_URL: string;
  protected PAGE_SIZE = 30;
  public leads: Lead[] = [];
  public archivedLeads: Lead[] = [];
  public stream$: ReplaySubject<Lead[]> = new ReplaySubject(1);
  public archivedStream$: ReplaySubject<Lead[]> = new ReplaySubject(1);
  public firstLoad: boolean;

  constructor(protected http: HttpService,
              protected userService: UserService,
              protected itemService: ItemService,
              protected event: EventService,
              protected realTime: RealTimeService,
              protected blockService: BlockUserXmppService,
              protected connectionService: ConnectionService) {
  }

  public init(archived?: boolean): Observable<Lead[]> {
    return this.getLeads(null, archived)
    .do((conversations: Lead[]) => {
      if (!archived) {
        this.stream$.next(conversations);
      } else {
        this.archivedStream$.next(conversations);
      }
      this.firstLoad = false;
    });
  }

  public addLead(lead: Lead) {
    this.leads.unshift(lead);
    this.stream();
  }

  // TODO - this method seems to never be used; check if it can be safely removed
  protected getAllLeads(since?: number, archived?: boolean): Observable<Lead[]> {
    return this.getLeads(since, archived)
    .flatMap((conversations: Lead[]) => {
      if (conversations && conversations.length > 0) {
        return this.getAllLeads(this.getLastDate(conversations), archived);
      }
      return Observable.of(conversations);
    })
    .map(() => {
      return archived ? this.archivedLeads : this.leads;
    });
  }

  protected getLastDate(conversations: Lead[]): number {
    if (conversations.length > 0 && conversations[conversations.length - 1] && conversations[conversations.length - 1].modifiedDate) {
      return conversations[conversations.length - 1].modifiedDate - 1;
    }
  }

  public query(until?: number, archived: boolean = false): Observable<Lead[]> {
    if (!until) {
      until = new Date().getTime();
    }
    if (this.connectionService.isConnected) {
      return this.http.get(this.API_URL, {until: until, hidden: archived})
      .map((res: Response) => res.json())
      .flatMap((res: LeadResponse[]) => {
        if (res.length > 0) {
          return Observable.forkJoin(
            res.map((conversation: LeadResponse) => this.getUser(conversation))
          )
          .flatMap((response: LeadResponse[]) => {
            return Observable.forkJoin(
              response.map((conversation: LeadResponse) => this.getItem(conversation)
              .map((convWithItem: Lead) => {
                convWithItem.archived = archived;
                return convWithItem;
              }))
            );
          });
        }
        return Observable.of([]);
      })
      .catch((a) => {
        return Observable.of(null);
      });
    } else {
      return Observable.of(null);
    }
  }

  protected getUser(conversation: LeadResponse): Observable<LeadResponse> {
    if (!conversation.user_id) {
      conversation.user = new User(null);
      return Observable.of(conversation);
    }
    return this.userService.get(conversation.user_id)
      .map((user: User) => {
        conversation.user = user;
        return conversation;
      });
  }

  protected getItem(conversation: LeadResponse): Observable<Lead> {
    if (!conversation.item_id) {
      return Observable.of(conversation)
        .map((data: LeadResponse) => this.mapRecordData(data));
    }
    return this.itemService.get(conversation.item_id)
      .map((item: Item) => this.setItem(conversation, item))
      .map((data: LeadResponse) => this.mapRecordData(data));
  }

  protected setItem(conv: LeadResponse, item: Item): LeadResponse {
    conv.item = item;
    conv.user.itemDistance = this.userService.calculateDistanceFromItem(conv.user, conv.item);
    return conv;
  }

  public resetCache() {
    this.leads = [];
    this.archivedLeads = [];
    this.stream$ = new ReplaySubject(1);
    this.firstLoad = true;
  }

  public archive(id: string): Observable<Lead> {
    return this.http.put(`${this.ARCHIVE_URL}/${id}/hide`, {})
    .map(() => {
      const index: number = _.findIndex(this.leads, {'id': id});
      if (index > -1) {
        const deletedLead: Lead = this.leads.splice(index, 1)[0];
        deletedLead.archived = true;
        this.archivedLeads.push(deletedLead);
        this.onArchive(deletedLead);
        this.stream(true);
        this.stream();
        this.event.emit(EventService.LEAD_ARCHIVED, deletedLead);
        return deletedLead;
      }
    });
  }

  public unarchive(id: string): Observable<Lead> {
    return this.http.put(`${this.ARCHIVE_URL}/${id}/unhide`, {})
    .map(() => {
      const index: number = _.findIndex(this.archivedLeads, {'id': id});
      if (index > -1) {
        const lead: Lead = this.archivedLeads.splice(index, 1)[0];
        lead.archived = false;
        this.leads.push(lead);
        this.stream(true);
        this.stream();
        this.event.emit(EventService.CONVERSATION_UNARCHIVED);
        return lead;
      }
    });
  }

  public archiveAll(until?: number): Observable<any> {
    if (!until) {
      until = new Date().getTime();
    }
    return this.http.put(`${this.ARCHIVE_URL}/hide?until=${until}`)
    .map(() => this.onArchiveAll());
  }

  protected bulkArchive(leads: Lead[]): Lead[] {
    leads.forEach((lead: Lead) => {
      lead.archived = true;
    });
    this.archivedLeads.push(...leads);
    return [];
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

  protected abstract mapRecordData(r: LeadResponse): Lead;

  protected abstract getLeads(since?: number, archived?: boolean): Observable<Lead[]>;

  protected abstract onArchive(lead: Lead);

  protected abstract onArchiveAll();

}
