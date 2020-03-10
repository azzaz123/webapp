/* tslint:disable:no-unused-variable */

import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { InputComponent } from './input.component';
import { Conversation } from '../../core/conversation/conversation';
import { MessageService } from '../service/message.service';
import { EventService } from '../../core/event/event.service';
import { MOCK_CONVERSATION, SECOND_MOCK_CONVERSATION } from '../../../tests/conversation.fixtures.spec';
import { USER_ID } from '../../../tests/user.fixtures.spec';
import { TrackingService } from '../../core/tracking/tracking.service';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { I18nService } from '../../core/i18n/i18n.service';
import { AutosizeModule } from 'ngx-autosize';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DeviceDetectorServiceMock } from '../../../tests';
import { RemoteConsoleService } from '../../core/remote-console';
import { MockRemoteConsoleService } from '../../../tests';
import { InboxConversation } from '../model';
import {
  CREATE_MOCK_INBOX_CONVERSATION,
  MOCK_INBOX_CONVERSATION,
  SECOND_MOCK_INBOX_CONVERSATION
} from '../../../tests/inbox.fixtures.spec';

class MessageServiceMock {
  send(c: Conversation, t: string): void {
  }
}

class NgbModalMock {
  open(content: any, options?: NgbModalOptions): NgbModalRef {
    return null;
  }
}

describe('Component: Input', () => {

  let component: InputComponent;
  let messageService: MessageService;
  let fixture: ComponentFixture<InputComponent>;
  let eventService: EventService;
  let trackingService: TrackingService;
  let remoteConsoleService: RemoteConsoleService;
  let modalService: NgbModal;
  let deviceService: DeviceDetectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        AutosizeModule
      ],
      declarations: [InputComponent],
      providers: [
        I18nService,
        { provide: MessageService, useClass: MessageServiceMock },
        { provide: NgbModal, useClass: NgbModalMock },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceMock },
        { provide: RemoteConsoleService, useClass: MockRemoteConsoleService },
        EventService,
        {
          provide: TrackingService, useValue: {
            track() {
            }
          }
        },
        EventService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    fixture = TestBed.createComponent(InputComponent);
    component = TestBed.createComponent(InputComponent).componentInstance;
    messageService = TestBed.get(MessageService);
    eventService = TestBed.get(EventService);
    trackingService = TestBed.get(TrackingService);
    modalService = TestBed.get(NgbModal);
    remoteConsoleService = TestBed.get(RemoteConsoleService);
    deviceService = TestBed.get(DeviceDetectorService);
    spyOn(messageService, 'send');
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
      spyOn(trackingService, 'track');
      spyOn(modalService, 'open');
      spyOn(remoteConsoleService, 'sendMessageTimeout');
      spyOn(remoteConsoleService, 'sendAcceptTimeout');
      textarea = fixture.debugElement.query(By.css('textarea')).nativeElement;
      component.currentConversation = conversation;
    });

    it('should call the send method and track the SEND_BUTTON event if texts is present', () => {
      component.message = TEXT;

      component.sendMessage(EVENT);

      expect(EVENT.preventDefault).toHaveBeenCalled();
      expect(messageService.send).toHaveBeenCalledWith(conversation, TEXT);
      expect(component.message).toBe('');
      expect(modalService.open).not.toHaveBeenCalled();
      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.SEND_BUTTON, {
        thread_id: conversation.id
      });
      expect(trackingService.track).toHaveBeenCalledTimes(1);
    });

    it('should call the send method and track the SEND_BUTTON event if texts is present with spaces', () => {
      component.message = `   ${TEXT}   `;

      component.sendMessage(EVENT);

      expect(EVENT.preventDefault).toHaveBeenCalled();
      expect(messageService.send).toHaveBeenCalledWith(component.currentConversation, TEXT);
      expect(component.message).toBe('');
      expect(modalService.open).not.toHaveBeenCalled();
      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.SEND_BUTTON, {
        thread_id: conversation.id
      });
      expect(trackingService.track).toHaveBeenCalledTimes(1);
    });

    it('should NOT call the send method and NOT track the SEND_BUTTON event if texts is empty', () => {
      component.message = '';

      component.sendMessage(EVENT);

      expect(EVENT.preventDefault).toHaveBeenCalled();
      expect(modalService.open).not.toHaveBeenCalled();
      expect(messageService.send).not.toHaveBeenCalled();
      expect(component.message).toBe('');
      expect(trackingService.track).not.toHaveBeenCalled();
      expect(remoteConsoleService.sendMessageTimeout).not.toHaveBeenCalled();
      expect(remoteConsoleService.sendAcceptTimeout).not.toHaveBeenCalled();
    });

    it('should NOT call the send method and NOT track the SEND_BUTTON event if texts is just spaces', () => {
      component.message = '   ';

      component.sendMessage(EVENT);

      expect(EVENT.preventDefault).toHaveBeenCalled();
      expect(modalService.open).not.toHaveBeenCalled();
      expect(messageService.send).not.toHaveBeenCalled();
      expect(component.message).toBe('');
      expect(trackingService.track).not.toHaveBeenCalled();
      expect(remoteConsoleService.sendMessageTimeout).not.toHaveBeenCalled();
      expect(remoteConsoleService.sendAcceptTimeout).not.toHaveBeenCalled();
    });

    it('should NOT call the send method and NOT track the SEND_BUTTON event if disabled', () => {
      component.message = TEXT;
      component.isUserBlocked = true;

      component.sendMessage(EVENT);

      expect(EVENT.preventDefault).toHaveBeenCalled();
      expect(modalService.open).not.toHaveBeenCalled();
      expect(messageService.send).not.toHaveBeenCalled();
      expect(trackingService.track).not.toHaveBeenCalled();
      expect(remoteConsoleService.sendMessageTimeout).not.toHaveBeenCalled();
      expect(remoteConsoleService.sendAcceptTimeout).not.toHaveBeenCalled();
    });

    it('should NOT call the send method and NOT track the SEND_BUTTON event if message contains link', () => {
      component.isUserBlocked = false;
      component.message = 'Hi, here is a link: www.link-to-something.com ;*';

      component.sendMessage(EVENT);
      expect(EVENT.preventDefault).toHaveBeenCalled();
      expect(modalService.open).toHaveBeenCalled();
      expect(messageService.send).not.toHaveBeenCalled();
      expect(trackingService.track).not.toHaveBeenCalled();
      expect(remoteConsoleService.sendMessageTimeout).not.toHaveBeenCalled();
      expect(remoteConsoleService.sendAcceptTimeout).not.toHaveBeenCalled();
    });

    it('should NOT call the send method and NOT track the SEND_BUTTON event if message contains correct and wrong link at the same time',
      () => {
        component.isUserBlocked = false;
        component.message = 'Can U access to my webpage outside https://wallapop.com that is www.notAllowedURL.com';

        component.sendMessage(EVENT);
        expect(EVENT.preventDefault).toHaveBeenCalled();
        expect(modalService.open).toHaveBeenCalled();
        expect(messageService.send).not.toHaveBeenCalled();
        expect(trackingService.track).not.toHaveBeenCalled();
        expect(remoteConsoleService.sendMessageTimeout).not.toHaveBeenCalled();
        expect(remoteConsoleService.sendAcceptTimeout).not.toHaveBeenCalled();
      });
  });

  describe('ngOnChanges', () => {

    beforeEach(() => {
      component.messageArea = {
        nativeElement: {
          focus() {
          },
          value: ''
        }
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
