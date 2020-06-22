/* tslint:isUserDisable:no-unused-variable */

import { InboxConversationComponent } from './inbox-conversation.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CREATE_MOCK_INBOX_CONVERSATION } from '../../../../tests/inbox.fixtures.spec';
import { InboxItemStatus } from '../../model/inbox-item';
import { NgxPermissionsModule } from 'ngx-permissions';
import { InboxConversationService } from '../../service';
import { InboxConversationServiceMock } from '../../../../tests';
import { of } from 'rxjs';
import { InboxConversation, InboxMessage, MessageStatus, MessageType } from '../../model';
import { I18nService } from '../../../core/i18n/i18n.service';
import { DateCalendarPipe } from 'app/shared/pipes';
import { CommonModule } from '@angular/common';

describe('Component: Conversation', () => {
  let inboxConversationService: InboxConversationService;
  let component: InboxConversationComponent;
  let fixture: ComponentFixture<InboxConversationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        NgxPermissionsModule.forRoot()
      ],
      declarations: [InboxConversationComponent],
      providers: [
        I18nService,
        { provide: InboxConversationService, useClass: InboxConversationServiceMock },
        DateCalendarPipe
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InboxConversationComponent);
    component = fixture.componentInstance;
    component.conversation = CREATE_MOCK_INBOX_CONVERSATION();
    inboxConversationService = TestBed.get(InboxConversationService);
    fixture.detectChanges();
  });

  describe('describe dateIsThisYear', () => {
    it('should return TRUE when conversaiton.modifiedDate is in the current calendar year', () => {
      component.conversation.modifiedDate = new Date(Date.now());

      const expectedResult = component.dateIsThisYear();

      expect(expectedResult).toBe(true);
    });

    it('should return FALSE when conversaiton does not have a modifiedDate', () => {
      component.conversation.modifiedDate = null;

      const expectedResult = component.dateIsThisYear();

      expect(expectedResult).toBe(false);
    });

    it('should return FALSE when conversaiton.modifiedDate is not in the current calendar year', () => {
      component.conversation.modifiedDate = new Date('1 Jan 1999');

      const expectedResult = component.dateIsThisYear();

      expect(expectedResult).toBe(false);
    });
  });

  describe('cannotChat', () => {
    it('should set conversation.cannotChat to TRUE when the conversation user is not available', () => {
      component.conversation.user.available = false;

      expect(component.conversation.cannotChat).toBe(true);
    });

    it('should set conversation.cannotChat to TRUE when the conversation user is blocked', () => {
      component.conversation.user.blocked = true;

      expect(component.conversation.cannotChat).toBe(true);
    });

    it('should set conversation.cannotChat to TRUE when the conversation item is not available', () => {
      component.conversation.item.status = InboxItemStatus.NOT_AVAILABLE;

      expect(component.conversation.cannotChat).toBe(true);
    });

    it('should set conversation.cannotChat to FALSE when none of the above conditions are met', () => {
      component.conversation.item.status = InboxItemStatus.PUBLISHED;
      component.conversation.user.blocked = false;
      component.conversation.user.available = true;

      expect(component.conversation.cannotChat).toBe(false);
    });
  });

  describe('archiveConversation', () => {
    let inboxConversation: InboxConversation;

    beforeEach(() => {
      inboxConversation = CREATE_MOCK_INBOX_CONVERSATION();
    });

    it('should archive$ conversation and set conversation to NULL', () => {
      spyOn(inboxConversationService, 'archive$').and.returnValue(of(inboxConversation));
      component.conversation = inboxConversation;

      component.onClickArchiveConversation();

      expect(inboxConversationService.archive$).toHaveBeenCalledWith(inboxConversation);
      expect(component.conversation).toEqual(null);
    });
  });
});

