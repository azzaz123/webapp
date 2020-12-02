import { MOCK_CALL } from '@fixtures/call.fixtures';
import { MockTrackingService } from '@fixtures/tracking.fixtures.spec';
import { createMessagesArray } from '@fixtures/message.fixtures.spec';
import { of } from 'rxjs';

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CallItemComponent } from './call-item.component';
import { ActivatedRoute } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CallsService } from '@core/conversation/calls.service';
import { I18nService } from '@core/i18n/i18n.service';
import { TrackingService } from '@core/tracking/tracking.service';
import { CallStatusLabelPipe, DateCalendarPipe } from '@shared/pipes';

describe('CallItemComponent', () => {
  let component: CallItemComponent;
  let fixture: ComponentFixture<CallItemComponent>;
  let trackingService: TrackingService;
  let callService: CallsService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [NoopAnimationsModule],
        declarations: [
          CallItemComponent,
          CallStatusLabelPipe,
          DateCalendarPipe,
        ],
        providers: [
          I18nService,
          { provide: TrackingService, useClass: MockTrackingService },
          {
            provide: ActivatedRoute,
            useValue: {
              queryParams: of({}),
            },
          },
          {
            provide: CallsService,
            useValue: {
              stream() {},
            },
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CallItemComponent);
    component = fixture.componentInstance;
    component.call = MOCK_CALL();
    trackingService = TestBed.inject(TrackingService);
    callService = TestBed.inject(CallsService);
    fixture.detectChanges();
  });

  describe('ngOnChanges', () => {
    it('should set messages', () => {
      component.call = MOCK_CALL();
      component.call.messages = createMessagesArray(10);

      component.ngOnChanges();

      expect(component.messages.length).toBe(4);
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
