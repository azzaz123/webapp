import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { LeadResponse } from './lead-response.interface';
import { User } from '../user/user';
import { Item } from '../item/item';
import { UserService } from '../user/user.service';
import { ItemService } from '../item/item.service';
import { Lead } from './lead';
import { findIndex, isEmpty } from 'lodash-es';
import { EventService } from '../event/event.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/do';
import { RealTimeService } from '../message/real-time.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable()
export abstract class LeadService {

  protected abstract mapRecordData(r: LeadResponse): Lead;

  protected abstract getLeads(since?: number, archived?: boolean): Observable<Lead[]>;

  protected abstract onArchive(lead: Lead);

  protected abstract onArchiveAll();

}
