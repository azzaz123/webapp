/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ArchiveButtonComponent } from './archive-button.component';
import { CONVERSATION_ID, ConversationService, MOCK_CONVERSATION, MockTrackingService, TrackingService } from 'shield';
import { Observable } from 'rxjs/Observable';
import { CallService } from '../call.service';
import { Call } from '../call';
import { CALL_ID, MOCK_CALL } from '../../../../test/fixtures/call.fixtures';

describe('ArchiveButtonComponent', () => {
  let component: ArchiveButtonComponent;
  let fixture: ComponentFixture<ArchiveButtonComponent>;
  let conversationService: ConversationService;
  let callService: CallService;
  let trackingService: TrackingService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: TrackingService, useClass: MockTrackingService},
        {
          provide: ConversationService, useValue: {
          archive() {
            return Observable.of({});
          }
        }
        },
        {
          provide: CallService, useValue: {
          archive() {
            return Observable.of({});
          }
        }
        }
      ],
      declarations: [ArchiveButtonComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchiveButtonComponent);
    component = fixture.componentInstance;
    conversationService = TestBed.get(ConversationService);
    callService = TestBed.get(CallService);
    trackingService = TestBed.get(TrackingService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('archive', () => {
    let called: boolean;
    beforeEach(() => {
      spyOn(conversationService, 'archive').and.callThrough();
      spyOn(callService, 'archive').and.callThrough();
      component.click.subscribe(() => {
        called = true;
      });
    });
    it('should call callService.archive if lead is Call', () => {
      const ANSWERED_CALL: Call = MOCK_CALL();
      component.lead = ANSWERED_CALL;
      component.archive(new Event(''));
      expect(callService.archive).toHaveBeenCalledWith(CALL_ID);
    });
    it('should call conversationService.archive if lead is Conversation', () => {
      component.lead = MOCK_CONVERSATION();
      component.archive(new Event(''));
      expect(conversationService.archive).toHaveBeenCalledWith(CONVERSATION_ID);
    });
    it('should emit click event', () => {
      expect(called).toBeTruthy();
    });
    it('should track the PhoneLeadProcessed event if the lead has phone', () => {
      const ANSWERED_CALL: Call = MOCK_CALL();
      spyOn(trackingService, 'track');
      component.lead = ANSWERED_CALL;
      component.archive(new Event(''));
      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.PHONE_LEAD_PROCESSED, {lead_id: ANSWERED_CALL.id});
    });
    it('should track the ConversationProcessed event if the lead does not have phone', () => {
      spyOn(trackingService, 'track');
      component.lead = MOCK_CONVERSATION();
      component.archive(new Event(''));
      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.CONVERSATION_PROCESSED, {conversation_id: component.lead.id});
    });
  });
});
