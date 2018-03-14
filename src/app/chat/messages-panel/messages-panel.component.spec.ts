/* tslint:disable:no-unused-variable */

import { MessagesPanelComponent } from './messages-panel.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MomentModule } from 'angular2-moment';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  MOCK_CONVERSATION,
  MESSAGE_MAIN,
  MOCK_MESSAGE,
  Message,
  I18nService,
  EventService
} from 'shield';

describe('Component: MessagesPanel', () => {
  let component: MessagesPanelComponent;
  let fixture: ComponentFixture<MessagesPanelComponent>;
  let eventService: EventService;

  const EVENT_CALLBACK: Function = jasmine.createSpy('EVENT_CALLBACK');

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MomentModule
      ],
      declarations: [MessagesPanelComponent],
      providers: [I18nService, EventService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    fixture = TestBed.createComponent(MessagesPanelComponent);
    component = fixture.componentInstance;
    component.currentConversation = MOCK_CONVERSATION();
    eventService = TestBed.get(EventService);
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

  describe('ngAfterViewChecked', () => {
    it('should set scrollTop = scrollHeight', () => {
      component.messagesPanel = {
        nativeElement: {
          scrollTop: 0,
          scrollHeight: 100
        }
      };
      component.ngAfterViewChecked();
      expect(component.messagesPanel.nativeElement.scrollHeight).toBe(100);
    });
  });

  describe('ngOnChanges', () => {
    it('should set alreadyScrolled to false when invoked', () => {
      component.alreadyScrolled = true;
      component.ngOnChanges();
      expect(component.alreadyScrolled).toBe(false);
    });
  });

  describe('ngOnInit', () => {
    it('should set alreadyScrolled to false when a NEW_MESSAGE event is triggered', () => {
      component.alreadyScrolled = true;
      component.ngOnInit();
      eventService.emit(EventService.NEW_MESSAGE);
      expect(component.alreadyScrolled).toBe(false);
    });
  });

})
;
