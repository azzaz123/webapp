/* tslint:isUserDisable:no-unused-variable */

import { InboxConversationComponent } from './inbox-conversation.component';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MomentModule } from 'angular2-moment';
import { CREATE_MOCK_INBOX_CONVERSATION } from '../../../../../tests/inbox.fixtures.spec';
import { INBOX_ITEM_STATUSES } from '../../../../chat/chat-with-inbox/inbox/inbox-item';


describe('Component: Conversation', () => {
  let component: InboxConversationComponent;
  let fixture: ComponentFixture<InboxConversationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MomentModule],
      declarations: [InboxConversationComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InboxConversationComponent);
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
      component.conversation.item.status = INBOX_ITEM_STATUSES.notAvailable;

      expect(component.conversation.cannotChat).toBe(true);
    });

    it('should set conversation.cannotChat to FALSE when none of the above conditions are met', () => {
      component.conversation.item.status = INBOX_ITEM_STATUSES.available;
      component.conversation.user.blocked = false;
      component.conversation.user.available = true;

      expect(component.conversation.cannotChat).toBe(false);
    });
  });
});

