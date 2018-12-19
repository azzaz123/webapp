/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UnarchiveButtonComponent } from './unarchive-button.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { ConversationService } from '../../core/conversation/conversation.service';
import { CONVERSATION_ID, MOCK_CONVERSATION } from '../../../tests/conversation.fixtures.spec';
import { Lead } from '../../core/conversation/lead';
import { MockTrackingService } from '../../../tests/tracking.fixtures.spec';
import { TrackingService } from '../../core/tracking/tracking.service';
import { CallsService } from '../../core/conversation/calls.service';
import { MOCK_CALL, CALL_ID } from '../../../tests/call.fixtures';

describe('UnarchiveButtonComponent', () => {
  let component: UnarchiveButtonComponent;
  let fixture: ComponentFixture<UnarchiveButtonComponent>;
  let conversationService: ConversationService;
  let callsService: CallsService;
  let trackingService: TrackingService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbModule.forRoot()
      ],
      providers: [
        {provide: TrackingService, useClass: MockTrackingService},
        {
          provide: ConversationService, useValue: {
          unarchive() {
            return Observable.of({});
          }
        }
        },
        {
          provide: CallsService, useValue: {
            unarchive() {
              return Observable.of({});
            }
          }
        }
      ],
      declarations: [ UnarchiveButtonComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnarchiveButtonComponent);
    component = fixture.componentInstance;
    conversationService = TestBed.get(ConversationService);
    callsService = TestBed.get(CallsService);
    trackingService = TestBed.get(TrackingService);
    fixture.detectChanges();
  });

  describe('unarchive', () => {
    beforeEach(() => {
      spyOn(trackingService, 'track').and.callThrough();
    });

    it('should call unarchive conversation if the lead is conversation and send a conversation mark pending track', () => {
      spyOn(conversationService, 'unarchive').and.callThrough();
      component.lead = <Lead>MOCK_CONVERSATION();

      component.unarchive(new Event('click'));

      expect(conversationService.unarchive).toHaveBeenCalledWith(CONVERSATION_ID);
      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.CONVERSATION_MARK_PENDING);
    });

    it('should call unarchive call if the lead is call and send a call mark pending track', () => {
      spyOn(callsService, 'unarchive').and.callThrough();
      component.lead = <Lead>MOCK_CALL();

      component.unarchive(new Event('click'));

      expect(callsService.unarchive).toHaveBeenCalledWith(CALL_ID);
      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.CALLS_MARK_PENDING);
    });
  });
});
