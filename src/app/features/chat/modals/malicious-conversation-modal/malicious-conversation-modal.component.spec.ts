import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  AnalyticsPageView,
  ANALYTICS_EVENT_NAMES,
  SCREEN_IDS,
  ViewBannedUserChatPopUp,
} from 'app/core/analytics/analytics-constants';
import { AnalyticsService } from 'app/core/analytics/analytics.service';
import { ButtonComponent } from 'app/shared/button/button.component';
import { MaliciousConversationModalComponent } from './malicious-conversation-modal.component';

describe('MaliciousConversationModalComponent', () => {
  let component: MaliciousConversationModalComponent;
  let activeModal: NgbActiveModal;
  let fixture: ComponentFixture<MaliciousConversationModalComponent>;
  let analyticsService: AnalyticsService;
  const chatContext: ViewBannedUserChatPopUp = {
    userId: '121',
    bannedUserId: '2332',
    conversationId: '2332',
    screenId: SCREEN_IDS.BannedUserChatPopUp,
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ButtonComponent, MaliciousConversationModalComponent],
        providers: [
          NgbActiveModal,
          { provide: AnalyticsService, useClass: MockAnalyticsService },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MaliciousConversationModalComponent);
    component = fixture.componentInstance;
    activeModal = TestBed.inject(NgbActiveModal);
    analyticsService = TestBed.inject(AnalyticsService);
    component.chatContext = chatContext;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when clicking on main button', () => {
    it('should close the modal', () => {
      spyOn(activeModal, 'close');
      const CTAButtonElement = fixture.debugElement.query(
        By.directive(ButtonComponent)
      ).nativeElement;

      CTAButtonElement.click();

      expect(activeModal.close).toHaveBeenCalledWith(true);
    });
  });

  describe('when clicking on cross button', () => {
    it('should dismiss the modal', () => {
      spyOn(activeModal, 'dismiss');
      const closeButtonElement = fixture.debugElement.query(
        By.css('.MaliciousConversationModal__close')
      ).nativeElement;

      closeButtonElement.click();

      expect(activeModal.dismiss).toHaveBeenCalledTimes(1);
    });
  });

  describe('Analytics', () => {
    describe('when displaying modal', () => {
      it('should track modal was viewed', () => {
        const expectedEvent: AnalyticsPageView<ViewBannedUserChatPopUp> = {
          name: ANALYTICS_EVENT_NAMES.ViewBannedUserChatPopUp,
          attributes: component.chatContext,
        };

        spyOn(analyticsService, 'trackPageView');
        component.ngOnInit();

        expect(analyticsService.trackPageView).toHaveBeenCalledWith(
          expectedEvent
        );
      });
    });
  });
});
