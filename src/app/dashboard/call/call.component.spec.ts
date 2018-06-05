/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallComponent } from './call.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MomentModule } from 'angular2-moment';
import { CallStatusLabelPipe } from '../../core/conversation/call-status-label.pipe';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ConversationService } from '../../core/conversation/conversation.service';
import { CallsService } from '../../core/conversation/calls.service';
import { MOCK_CALL } from '../../../tests/call.fixtures';
import { MOCK_CONVERSATION } from '../../../tests/conversation.fixtures.spec';
import { I18nService } from '../../core/i18n/i18n.service';

describe('CallComponent', () => {
  let component: CallComponent;
  let fixture: ComponentFixture<CallComponent>;
  let callService: CallsService;
  let conversationService: ConversationService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MomentModule
      ],
      providers: [
        I18nService,
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
      declarations: [ CallComponent, CallStatusLabelPipe ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallComponent);
    component = fixture.componentInstance;
    component.call = MOCK_CALL();
    callService = TestBed.get(CallsService);
    conversationService = TestBed.get(ConversationService);
    fixture.detectChanges();
  });

  describe('onAnimationDone', () => {

    beforeEach(() => {
      spyOn(callService, 'stream');
      spyOn(conversationService, 'stream');
    });

    it('should call callService.stream if lead is Call', () => {
      component.archived = true;
      component.call = MOCK_CALL();

      component.onAnimationDone(new Event(''));

      expect(conversationService.stream).not.toHaveBeenCalled();
      expect(callService.stream).toHaveBeenCalled();
    });

    it('should call conversationService.stream if lead is NOT a Call', () => {
      component.archived = true;
      component.call = MOCK_CONVERSATION();

      component.onAnimationDone(new Event(''));

      expect(callService.stream).not.toHaveBeenCalled();
      expect(conversationService.stream).toHaveBeenCalled();
    });

    it('should do nothing if not archive', () => {
      component.archived = false;

      component.onAnimationDone(new Event(''));

      expect(callService.stream).not.toHaveBeenCalled();
      expect(conversationService.stream).not.toHaveBeenCalled();
    });
  });
});
