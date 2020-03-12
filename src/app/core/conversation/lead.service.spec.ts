/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { LeadService } from './lead.service';
import { HttpService } from '../http/http.service';
import { UserService } from '../user/user.service';
import { ItemService } from '../item/item.service';
import { Conversation } from './conversation';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { User } from '../user/user';
import { Item } from '../item/item';
import { ConversationResponse } from './conversation-response.interface';
import { EventService } from '../event/event.service';
import { Lead } from './lead';
import { MOCK_USER, MockedUserService, USER_ID, USER_ITEM_DISTANCE } from '../../../tests/user.fixtures.spec';
import { ITEM_ID, MockedItemService } from '../../../tests/item.fixtures.spec';
import { CONVERSATIONS_DATA, createConversationsArray } from '../../../tests/conversation.fixtures.spec';
import { TEST_HTTP_PROVIDERS } from '../../../tests/utils.spec';
import { ConnectionService } from '../connection/connection.service';
import { RealTimeService } from '../message/real-time.service';
import { BlockUserXmppService } from '../../chat/service';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { TestRequest } from '@angular/common/http/testing/src/request';

@Injectable()
export class MockService {

  protected API_URL = 'api/v3/conversations';
  protected ARCHIVE_URL = 'api/v2/conversations';

  constructor(private httpClient: HttpClient,
              private userService: UserService,
              private itemService: ItemService,
              private event: EventService,
              private realTime: RealTimeService) {
  }

  protected getLeads(since?: number, concat?: boolean, archived?: boolean): Observable<Conversation[]> {
    return Observable.of([]);
  }

  protected onArchiveAll() {
  }

  protected onArchive(lead: Lead) {
  }

  protected mapRecordData(data: ConversationResponse): Conversation {
    return new Conversation(
      data.id,
      data.legacy_id,
      data.modified_date,
      data.expected_visit,
      data.user,
      data.item,
      [],
      data.buyer_phone_number,
      data.survey_responses
    );
  }
}

let service: MockService;
let http: HttpService;
let userService: UserService;
let itemService: ItemService;
let eventService: EventService;
let connectionService: ConnectionService;
let httpTestingController: HttpTestingController;

describe('LeadService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        MockService,
        EventService,
        ...TEST_HTTP_PROVIDERS,
        { provide: UserService, useClass: MockedUserService },
        { provide: ItemService, useClass: MockedItemService },
        { provide: RealTimeService, useValue: {} },
        {
          provide: BlockUserXmppService, useValue: {
            getBlockedUsers() {
              return ['1', '2', '3'];
            }
          }
        },
        {
          provide: ConnectionService, useValue: {}
        }
      ]
    });
    service = TestBed.get(MockService);
    userService = TestBed.get(UserService);
    itemService = TestBed.get(ItemService);
    eventService = TestBed.get(EventService);
    http = TestBed.get(HttpService);
    connectionService = TestBed.get(ConnectionService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should instantiate the service', () => {
    expect(service).toBeTruthy();
  });

});
