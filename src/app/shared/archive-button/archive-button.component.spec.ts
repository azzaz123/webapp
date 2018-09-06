/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ArchiveButtonComponent } from './archive-button.component';
import { Observable } from 'rxjs';
import { ConversationService } from '../../core/conversation/conversation.service';
import { TrackingService } from '../../core/tracking/tracking.service';
import { MockTrackingService } from '../../../tests/tracking.fixtures.spec';
import { CONVERSATION_ID, MOCK_CONVERSATION } from '../../../tests/conversation.fixtures.spec';
import { CallsService } from '../../core/conversation/calls.service';
import { MOCK_CALL, CALL_ID } from '../../../tests/call.fixtures';

describe('ArchiveButtonComponent', () => {
  let component: ArchiveButtonComponent;
  let fixture: ComponentFixture<ArchiveButtonComponent>;
  let conversationService: ConversationService;
  let callsService: CallsService;
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
          provide: CallsService, useValue: {
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
    callsService = TestBed.get(CallsService);
    trackingService = TestBed.get(TrackingService);
    fixture.detectChanges();
  });

  describe('archive', () => {
    let called: boolean;

    beforeEach(() => {
      spyOn(trackingService, 'track').and.callThrough();
      component.click.subscribe(() => {
        called = true;
      });
    });

    it('should call conversationService.archive if lead is Conversation and send conversation process tracking', () => {
      spyOn(conversationService, 'archive').and.callThrough();
      component.lead = MOCK_CONVERSATION();

      component.archive(new Event(''));

      expect(conversationService.archive).toHaveBeenCalledWith(CONVERSATION_ID);
      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.CONVERSATION_PROCESSED);
    });

    it('should call callService.archive if lead is Call and send call process tracking', () => {
      spyOn(callsService, 'archive').and.callThrough();
      component.lead = MOCK_CALL();

      component.archive(new Event(''));

      expect(callsService.archive).toHaveBeenCalledWith(CALL_ID);
      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.CALLS_PROCESSED);
    });


    it('should emit click event', () => {
      expect(called).toBeTruthy();
    });
  });
});
