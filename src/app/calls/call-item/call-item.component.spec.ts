/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CallItemComponent } from './call-item.component';
import { EventService } from '../../core/event/event.service';
import { ActivatedRoute } from '@angular/router';
import { TrackingService } from '../../core/tracking/tracking.service';
import { CallsService } from '../../core/conversation/calls.service';
import { ConversationService } from '../../core/conversation/conversation.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MomentModule } from 'angular2-moment';
import { CallStatusLabelPipe } from '../../core/conversation/call-status-label.pipe';
import { I18nService } from '../../core/i18n/i18n.service';
import { MockTrackingService } from '../../../tests/tracking.fixtures.spec';
import { Observable } from 'rxjs/Observable';
import { MOCK_CALL, CALL_ID } from '../../../tests/call.fixtures';
import { createMessagesArray } from '../../../tests/message.fixtures.spec';
import { MOCK_CONVERSATION } from '../../../tests/conversation.fixtures.spec';

describe('CallItemComponent', () => {
  let component: CallItemComponent;
  let fixture: ComponentFixture<CallItemComponent>;
  let eventService: EventService;
  let route: ActivatedRoute;
  let trackingService: TrackingService;
  let callService: CallsService;
  let conversationService: ConversationService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MomentModule
      ],
      declarations: [CallItemComponent, CallStatusLabelPipe],
      providers: [
        I18nService,
        EventService,
        {provide: TrackingService, useClass: MockTrackingService},
        {
          provide: ActivatedRoute, useValue: {
          queryParams: Observable.of({})
        }
        },
        {
          provide: CallsService, useValue: {
          stream() {
          }
        }
        },
        {
          provide: ConversationService, useValue: {
          stream() {
          }
        }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallItemComponent);
    component = fixture.componentInstance;
    component.call = MOCK_CALL();
    eventService = TestBed.get(EventService);
    route = TestBed.get(ActivatedRoute);
    trackingService = TestBed.get(TrackingService);
    callService = TestBed.get(CallsService);
    conversationService = TestBed.get(ConversationService);
    fixture.detectChanges();
  });

  describe('ngOnChanges', () => {
    it('should set messages', () => {
      component.call = MOCK_CALL();
      component.call.messages = createMessagesArray(10);

      component.ngOnChanges();

      expect(component.messages.length).toBe(4);
    });
    it('should call changeExpandedState if there is the permalink', () => {
      route.queryParams = Observable.of({
        c: CALL_ID
      });
      spyOn(component, 'changeExpandedState');
      component.call = MOCK_CALL();

      component.ngOnChanges();

      expect(component.changeExpandedState).toHaveBeenCalled();
    });
    it('should call NOT changeExpandedState if the call is not found', () => {
      route.queryParams = Observable.of({
        c: '2'
      });
      spyOn(component, 'changeExpandedState');
      component.call = MOCK_CALL();

      component.ngOnChanges();

      expect(component.changeExpandedState).not.toHaveBeenCalled();
    });
  });
  describe('changeExpandedState', () => {
    beforeEach(() => {
      spyOn(eventService, 'emit');
    });
    it('should emit an event to close other calls if the current is not active and track', () => {
      spyOn(trackingService, 'track');
      component.open = false;

      component.changeExpandedState();

      expect(eventService.emit).toHaveBeenCalledWith(EventService.CLOSE_EXPANDED_CALLS);
      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.PHONE_LEAD_OPENED, {lead_id: component.call.id});
    });
    it('should not emit the event if the open call is the active', () => {
      component.open = true;

      component.changeExpandedState();

      expect(eventService.emit).not.toHaveBeenCalled();
    });
  });
  describe('onAnimationDone', () => {
    beforeEach(() => {
      spyOn(callService, 'stream');
    });
    it('should call callService.stream if lead is Call', () => {
      component.archived = true;
      component.call = MOCK_CALL();

      component.onAnimationDone(new Event(''));

      expect(callService.stream).toHaveBeenCalled();
    });
    it('should do nothing if not archive', () => {
      component.archived = false;

      component.onAnimationDone(new Event(''));
      
      expect(callService.stream).not.toHaveBeenCalled();
    });
  });
});