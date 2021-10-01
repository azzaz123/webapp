import { MOCK_CONVERSATION } from '@fixtures/chat';
import { MOCK_CALL } from '@fixtures/call.fixtures';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CallComponent } from './call.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CallsService } from '@core/conversation/calls.service';
import { I18nService } from '@core/i18n/i18n.service';
import { CallStatusLabelPipe, DateCalendarPipe } from '@shared/pipes';
import { MomentCalendarSpecService } from '@core/i18n/moment/moment-calendar-spec.service';

describe('CallComponent', () => {
  let component: CallComponent;
  let fixture: ComponentFixture<CallComponent>;
  let callService: CallsService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [NoopAnimationsModule],
        providers: [
          I18nService,
          MomentCalendarSpecService,
          {
            provide: CallsService,
            useValue: {
              stream() {},
            },
          },
        ],
        declarations: [CallComponent, CallStatusLabelPipe, DateCalendarPipe],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CallComponent);
    component = fixture.componentInstance;
    component.call = MOCK_CALL();
    callService = TestBed.inject(CallsService);
    fixture.detectChanges();
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

    it('should call conversationService.stream if lead is NOT a Call', () => {
      component.archived = true;
      component.call = MOCK_CONVERSATION();

      component.onAnimationDone(new Event(''));

      expect(callService.stream).not.toHaveBeenCalled();
    });

    it('should do nothing if not archive', () => {
      component.archived = false;

      component.onAnimationDone(new Event(''));

      expect(callService.stream).not.toHaveBeenCalled();
    });
  });
});
