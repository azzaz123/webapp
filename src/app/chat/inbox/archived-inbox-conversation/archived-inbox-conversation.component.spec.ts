/* tslint:isUserDisable:no-unused-variable */

import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CREATE_MOCK_INBOX_CONVERSATION } from '../../../../tests/inbox.fixtures.spec';
import { InboxItemStatus } from '../../model/inbox-item';
import { ArchivedInboxConversationComponent } from './archived-inbox-conversation.component';
import { DateCalendarPipe } from 'app/shared/pipes';


describe('Component: Conversation', () => {
  let component: ArchivedInboxConversationComponent;
  let fixture: ComponentFixture<ArchivedInboxConversationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ArchivedInboxConversationComponent, DateCalendarPipe],
      providers: [DateCalendarPipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivedInboxConversationComponent);
    component = fixture.componentInstance;
    component.conversation = CREATE_MOCK_INBOX_CONVERSATION();
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
});

