/* tslint:disable:no-unused-variable */

import { MessagesPanelComponent } from './messages-panel.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MomentModule } from 'angular2-moment';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MOCK_CONVERSATION } from '../../../test/fixtures/conversation.fixtures';
import { MESSAGE_MAIN, MOCK_MESSAGE } from '../../../test/fixtures/message.fixtures';
import { Message } from '../../core/message/message';
import { I18nService } from '../../core/i18n/i18n.service';

describe('Component: MessagesPanel', () => {
  let component: MessagesPanelComponent;
  let fixture: ComponentFixture<MessagesPanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MomentModule
      ],
      declarations: [MessagesPanelComponent],
      providers: [I18nService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    fixture = TestBed.createComponent(MessagesPanelComponent);
    component = fixture.componentInstance;
    component.currentConversation = MOCK_CONVERSATION();
  });

  it('should instantiate it', () => {
    expect(component).toBeDefined();
  });

  describe('showDate', () => {

    it('should return true if different days', () => {
      const MESSAGE2: Message = new Message(
        MESSAGE_MAIN.id,
        MESSAGE_MAIN.thread,
        MESSAGE_MAIN.body,
        MESSAGE_MAIN.from,
        new Date(MESSAGE_MAIN.date - 24 * 60 * 60 * 1000)
      );
      let result = component.showDate(MOCK_MESSAGE, MESSAGE2);
      expect(result).toBeTruthy();
    });

    it('should return false if same day', () => {
      const MESSAGE2: Message = new Message(
        MESSAGE_MAIN.id,
        MESSAGE_MAIN.thread,
        MESSAGE_MAIN.body,
        MESSAGE_MAIN.from,
        new Date(MESSAGE_MAIN.date - 12 * 60 * 60 * 1000)
      );
      let result = component.showDate(MOCK_MESSAGE, MESSAGE2);
      expect(result).toBeFalsy();
    });

    it('should return false if there is no previous message', () => {
      let result = component.showDate(undefined, MOCK_MESSAGE);
      expect(result).toBeTruthy();
    });

  });

});
