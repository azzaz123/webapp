import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { EventService } from '@core/event/event.service';
import { I18nService } from '@core/i18n/i18n.service';
import { RealTimeService } from '@core/message/real-time.service';
import { RemoteConsoleService } from '@core/remote-console';
import { InboxConversation } from '@private/features/chat/core/model';
import { MOCK_CONVERSATION, CREATE_MOCK_INBOX_CONVERSATION, SECOND_MOCK_INBOX_CONVERSATION } from '@fixtures/chat';
import { RealTimeServiceMock } from '@fixtures/real-time.fixtures.spec';
import { DeviceDetectorServiceMock, MockRemoteConsoleService } from '@fixtures/remote-console.fixtures.spec';
import { USER_ID } from '@fixtures/user.fixtures.spec';
import { AutosizeModule } from 'ngx-autosize';
import { DeviceDetectorService } from 'ngx-device-detector';
import { InputComponent } from './input.component';

describe('Component: Input', () => {
  const MESSAGE_ID = 'MESSAGE_ID';

  let component: InputComponent;
  let realTimeService: RealTimeService;
  let fixture: ComponentFixture<InputComponent>;
  let eventService: EventService;
  let remoteConsoleService: RemoteConsoleService;
  let deviceService: DeviceDetectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, AutosizeModule],
      declarations: [InputComponent],
      providers: [
        I18nService,
        { provide: RealTimeService, useClass: RealTimeServiceMock },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceMock },
        { provide: RemoteConsoleService, useClass: MockRemoteConsoleService },
        EventService,
        EventService,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
    fixture = TestBed.createComponent(InputComponent);
    component = TestBed.createComponent(InputComponent).componentInstance;
    realTimeService = TestBed.inject(RealTimeService);
    eventService = TestBed.inject(EventService);
    remoteConsoleService = TestBed.inject(RemoteConsoleService);
    deviceService = TestBed.inject(DeviceDetectorService);
  });

  beforeEach(() => {
    spyOn(realTimeService, 'sendMessage').and.returnValue(MESSAGE_ID);
  });

  describe('ngOnInit', () => {
    it('should disable input when the user has been blocked', () => {
      component.currentConversation = MOCK_CONVERSATION();

      component.ngOnInit();
      eventService.emit(EventService.PRIVACY_LIST_UPDATED, [USER_ID]);

      expect(component.isUserBlocked).toBe(true);
    });
    it('should disable input when the user has been unblocked', () => {
      component.currentConversation = MOCK_CONVERSATION();

      component.ngOnInit();
      eventService.emit(EventService.PRIVACY_LIST_UPDATED, []);

      expect(component.isUserBlocked).toBe(false);
    });
  });

  describe('sendMessage', () => {
    const EVENT = new Event('event');
    const conversation: InboxConversation = MOCK_CONVERSATION();
    const TEXT = 'text';
    let textarea: HTMLTextAreaElement;

    beforeEach(() => {
      spyOn(EVENT, 'preventDefault');
      spyOn(remoteConsoleService, 'sendMessageTimeout');
      spyOn(component.clickSentMessage, 'emit');
      textarea = fixture.debugElement.query(By.css('textarea')).nativeElement;
      component.currentConversation = conversation;
    });

    it('should call the send method event if texts is present', () => {
      component.message = TEXT;

      component.sendMessage(EVENT);

      expect(EVENT.preventDefault).toHaveBeenCalled();
      expect(realTimeService.sendMessage).toHaveBeenCalledWith(conversation, TEXT);
      expect(component.message).toBe('');
      expect(component.clickSentMessage.emit).toHaveBeenCalledWith(MESSAGE_ID);
    });

    it('should call the send method if texts is present with spaces', () => {
      component.message = `   ${TEXT}   `;

      component.sendMessage(EVENT);

      expect(EVENT.preventDefault).toHaveBeenCalled();
      expect(realTimeService.sendMessage).toHaveBeenCalledWith(component.currentConversation, TEXT);
      expect(component.message).toBe('');
      expect(component.clickSentMessage.emit).toHaveBeenCalledWith(MESSAGE_ID);
    });

    it('should NOT call the send method if texts is empty', () => {
      component.message = '';

      component.sendMessage(EVENT);

      expect(EVENT.preventDefault).toHaveBeenCalled();
      expect(realTimeService.sendMessage).not.toHaveBeenCalled();
      expect(component.message).toBe('');
      expect(remoteConsoleService.sendMessageTimeout).not.toHaveBeenCalled();
    });

    it('should NOT call the send method if texts is just spaces', () => {
      component.message = '   ';

      component.sendMessage(EVENT);

      expect(EVENT.preventDefault).toHaveBeenCalled();
      expect(realTimeService.sendMessage).not.toHaveBeenCalled();
      expect(component.message).toBe('');
      expect(remoteConsoleService.sendMessageTimeout).not.toHaveBeenCalled();
    });

    it('should NOT call the send method if disabled', () => {
      component.message = TEXT;
      component.isUserBlocked = true;

      component.sendMessage(EVENT);

      expect(EVENT.preventDefault).toHaveBeenCalled();
      expect(realTimeService.sendMessage).not.toHaveBeenCalled();
      expect(remoteConsoleService.sendMessageTimeout).not.toHaveBeenCalled();
    });

    it('should NOT call the send method if message contains link', () => {
      component.isUserBlocked = false;
      component.message = 'Hi, here is a link: www.link-to-something.com ;*';

      component.sendMessage(EVENT);
      expect(EVENT.preventDefault).toHaveBeenCalled();
      expect(realTimeService.sendMessage).toHaveBeenCalled();
      expect(component.clickSentMessage.emit).toHaveBeenCalledWith(MESSAGE_ID);
    });

    it('should NOT call the send method if message contains correct and wrong link at the same time', () => {
      component.isUserBlocked = false;
      component.message = 'Can U access to my webpage outside https://wallapop.com that is www.notAllowedURL.com';

      component.sendMessage(EVENT);
      expect(EVENT.preventDefault).toHaveBeenCalled();
      expect(realTimeService.sendMessage).toHaveBeenCalled();
      expect(component.clickSentMessage.emit).toHaveBeenCalledWith(MESSAGE_ID);
    });
  });

  describe('ngOnChanges', () => {
    beforeEach(() => {
      component.messageArea = {
        nativeElement: {
          focus() {},
          value: '',
        },
      };
      spyOn(component.messageArea.nativeElement, 'focus');
      component.currentConversation = MOCK_CONVERSATION();
    });

    it('should focus the message if change conversation', fakeAsync(() => {
      component.ngOnChanges();
      tick(500);

      expect(component.isFocus).toEqual(true);
      expect(component.messageArea.nativeElement.focus).toHaveBeenCalled();
    }));

    it('should focus the message area', fakeAsync(() => {
      component.ngAfterViewInit();
      tick(500);

      expect(component.isFocus).toEqual(true);
      expect(component.messageArea.nativeElement.focus).toHaveBeenCalled();
    }));

    describe('if it`s a mobile device', () => {
      beforeEach(() => {
        spyOn(deviceService, 'isMobile').and.returnValue(true);
      });

      it('should not focus the message if change conversation', fakeAsync(() => {
        component.ngOnChanges();
        tick(500);

        expect(component.messageArea.nativeElement.focus).not.toHaveBeenCalled();
      }));

      it('should not focus the message area', fakeAsync(() => {
        component.ngAfterViewInit();
        tick(500);

        expect(component.messageArea.nativeElement.focus).not.toHaveBeenCalled();
      }));
    });

    it('should reset the input value when the conversation is changed', fakeAsync(() => {
      component.messageArea.nativeElement.value = 'I typed some some text...';
      component.currentConversation = SECOND_MOCK_INBOX_CONVERSATION;

      component.ngOnChanges(component);
      tick(500);

      expect(component.message).toBe('');
    }));

    it('should not do anything if there is no message to read', () => {
      component.messageArea = undefined;

      component.ngOnChanges();
    });

    it('should disable input if user is blocked', () => {
      component.currentConversation = CREATE_MOCK_INBOX_CONVERSATION();
      component.currentConversation.user.blocked = true;

      component.ngOnChanges();

      expect(component.isUserBlocked).toBe(true);
    });

    it('should enable input if user is blocked', () => {
      component.isUserBlocked = true;
      component.currentConversation = CREATE_MOCK_INBOX_CONVERSATION();
      component.currentConversation.user.blocked = false;

      component.ngOnChanges();

      expect(component.isUserBlocked).toBe(false);
    });
  });
});
