/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ArchiveButtonComponent } from './archive-button.component';
import { Observable } from 'rxjs/Observable';
import { ConversationService } from '../../core/conversation/conversation.service';
import { TrackingService } from '../../core/tracking/tracking.service';
import { MockTrackingService } from '../../../tests/tracking.fixtures.spec';
import { CONVERSATION_ID, MOCK_CONVERSATION } from '../../../tests/conversation.fixtures.spec';

describe('ArchiveButtonComponent', () => {
  let component: ArchiveButtonComponent;
  let fixture: ComponentFixture<ArchiveButtonComponent>;
  let conversationService: ConversationService;
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
    trackingService = TestBed.get(TrackingService);
    fixture.detectChanges();
  });

  describe('archive', () => {
    let called: boolean;

    beforeEach(() => {
      spyOn(conversationService, 'archive').and.callThrough();
      component.click.subscribe(() => {
        called = true;
      });
    });

    it('should call conversationService.archive if lead is Conversation', () => {
      component.lead = MOCK_CONVERSATION();

      component.archive(new Event(''));

      expect(conversationService.archive).toHaveBeenCalledWith(CONVERSATION_ID);
    });

    it('should emit click event', () => {
      expect(called).toBeTruthy();
    });
  });
});
