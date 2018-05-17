/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DashboardComponent } from './dashboard.component';
import { EventService } from '../core/event/event.service';
import { ConversationService } from '../core/conversation/conversation.service';
import { TrackingService } from '../core/tracking/tracking.service';
import { CallsService } from '../core/conversation/calls.service';
import { MockTrackingService } from '../../tests/tracking.fixtures.spec';
import { createConversationsArray, MOCK_CONVERSATION } from '../../tests/conversation.fixtures.spec';
import { Lead } from '../core/conversation/lead';
import { Call } from '../core/conversation/calls';
import { createCallsArray } from '../../tests/call.fixtures';
import { Conversation } from '../core/conversation/conversation';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let callService: CallsService;
  let conversationService: ConversationService;
  let trackingService: TrackingService;
  let eventService: EventService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      providers: [
        {provide: TrackingService, useClass: MockTrackingService},
        EventService,
        {
          provide: CallsService, useValue: {
          getPage() {
            return Observable.of([]);
          },
          getTotals() {
            return Observable.of({});
          }
        }
        },
        {
          provide: ConversationService, useValue: {
          getPage() {
            return Observable.of([]);
          },
          getTotals() {
            return Observable.of({});
          }
        }
        },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    callService = TestBed.get(CallsService);
    conversationService = TestBed.get(ConversationService);
    trackingService = TestBed.get(TrackingService);
    eventService = TestBed.get(EventService);
    fixture.detectChanges();
  });

  describe('ngOninit', () => {

    it('should call methods', () => {
      spyOn<any>(component, 'getData');
      spyOn<any>(component, 'getTotals');

      component.ngOnInit();

      expect(component['getData']).toHaveBeenCalled();
      expect(component['getTotals']).toHaveBeenCalled();
    });

    it('should set archived lead', () => {
      component.ngOnInit();
      const LEAD: Lead = MOCK_CONVERSATION();

      eventService.emit(EventService.LEAD_ARCHIVED, LEAD);

      expect(component.archivedLead).toEqual(LEAD);
    });
  });

  describe('getData', () => {
    const CALLS: Call[] = createCallsArray(5);
    const CONVERSATIONS: Conversation[] = createConversationsArray(4);

    beforeEach(() => {
      spyOn(callService, 'getPage').and.returnValue(Observable.of(CALLS));
      spyOn(conversationService, 'getPage').and.returnValue(Observable.of(CONVERSATIONS));
      spyOn(trackingService, 'track');

      component['getData']();
    });

    it('should set calls', () => {
      expect(callService.getPage).toHaveBeenCalledWith(1, false, null, 5);
      expect(component.calls).toEqual(CALLS);
    });

    it('should set conversations', () => {
      expect(conversationService.getPage).toHaveBeenCalledWith(1, false, [{
        key: 'phone',
        value: undefined
      }], 5);
      expect(component.conversations).toEqual(CONVERSATIONS);
    });

    it('should track the ConversationListActiveLoaded event', () => {
      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.CONVERSATION_LIST_ACTIVE_LOADED);
    });

    it('should track the PhoneLeadListActiveLoaded event', () => {
      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.PHONE_LEAD_LIST_ACTIVE_LOADED);
    });
  });

  describe('getTotals', () => {
    describe('with conversations and archive', () => {

      beforeEach(() => {
        spyOn(callService, 'getTotals').and.returnValue(Observable.of({
          calls: 6,
          archived: 9
        }));
        spyOn(conversationService, 'getTotals').and.returnValue(Observable.of({
          phonesShared: 2,
          meetings: 3,
          messages: 4,
          conversations: 5,
          archivedPhonesShared: 6,
          archivedMeetings: 7,
          archivedMessages: 8
        }));

        component['getTotals']();
      });

      it('should set phonesTotal', () => {
        expect(component.phonesTotal).toBe(6 + 2);
      });

      it('should set messagesTotal', () => {
        expect(component.messagesTotal).toBe(5 - 2);
      });

      it('should set completed to false', () => {
        expect(component.completed).toBeFalsy();
      });
    });

    describe('without conversations and with archive', () => {
      beforeEach(() => {
        spyOn(callService, 'getTotals').and.returnValue(Observable.of({
          calls: 0,
          archived: 9
        }));
        spyOn(conversationService, 'getTotals').and.returnValue(Observable.of({
          phonesShared: 0,
          meetings: 0,
          messages: 0,
          conversations: 0,
          archivedPhonesShared: 6,
          archivedMeetings: 7,
          archivedMessages: 8
        }));

        component['getTotals']();
      });

      it('should set completed to true', () => {
        expect(component.completed).toBeTruthy();
      });
    });

    describe('without conversations and without archive', () => {
      beforeEach(() => {
        spyOn(callService, 'getTotals').and.returnValue(Observable.of({
          calls: 0,
          archived: 0
        }));
        spyOn(conversationService, 'getTotals').and.returnValue(Observable.of({
          phonesShared: 0,
          meetings: 0,
          messages: 0,
          conversations: 0,
          archivedPhonesShared: 0,
          archivedMeetings: 0,
          archivedMessages: 0
        }));

        component['getTotals']();
      });

      it('should set completed to false', () => {
        expect(component.completed).toBeFalsy();
      });

    });
  });

  describe('trackPhoneLeadOpened', () => {
    it('should track the PHONE_LEAD_OPENED event', () => {
      spyOn(trackingService, 'track');

      component.trackPhoneLeadOpened();

      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.PHONE_LEAD_OPENED);
    });
  });
});
