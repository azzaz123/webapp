/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallComponent } from './call.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MomentModule } from 'angular2-moment';
import { MOCK_CALL } from '../../../test/fixtures/call.fixtures';
import { CallStatusLabelPipe } from '../../core/conversation/call-status-label.pipe';
import { ConversationService, I18nService, MOCK_CONVERSATION } from 'shield';
import { CallService } from '../../core/conversation/call.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('CallComponent', () => {
  let component: CallComponent;
  let fixture: ComponentFixture<CallComponent>;
  let callService: CallService;
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
          provide: CallService, useValue: {
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
    callService = TestBed.get(CallService);
    conversationService = TestBed.get(ConversationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
