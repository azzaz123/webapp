/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed, fakeAsync, tick} from '@angular/core/testing';
import {MessageComponent} from './message.component';
import {NO_ERRORS_SCHEMA, DebugElement} from '@angular/core';
import {MOCK_MESSAGE} from '../../../tests/message.fixtures.spec';
import {USER_ID, USER_WEB_SLUG} from '../../../tests/user.fixtures.spec';
import {User} from '../../core/user/user';
import {By} from '@angular/platform-browser';
import {phoneRequestState, Message} from '../../core/message/message';
import {MOCK_CONVERSATION} from '../../../tests/conversation.fixtures.spec';
import {ConversationService} from '../../core/conversation/conversation.service';
import {environment} from '../../../environments/environment';
import {LinkTransformPipe} from '../pipes/link-transform';

const WEB_SLUG_USER = 'https://www.wallapop.com/user/';

describe('Component: Message', () => {
  let component: MessageComponent;
  let fixture: ComponentFixture<MessageComponent>;
  let conversationService: ConversationService;
  let element: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MessageComponent,
        LinkTransformPipe
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {provide: 'SUBDOMAIN', useValue: 'www'},
        {provide: ConversationService, useValue: {
          openPhonePopup() {}
        }}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageComponent);
    conversationService = TestBed.get(ConversationService);
    component = fixture.componentInstance;
    MOCK_MESSAGE.user = new User(USER_ID, null, null, null, null, null, null, null, null, null, null, null, null, USER_WEB_SLUG);
    component.message = MOCK_MESSAGE;
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should set userWebSlug', () => {
      expect(component.userWebSlug).toBe(environment.siteUrl.replace('es', 'www') + 'user/' + USER_WEB_SLUG);
    });
  });


  describe('openDialog', () => {
    beforeEach(() => {
      component.currentConversation = MOCK_CONVERSATION();
      component.message = new Message('someId', MOCK_CONVERSATION().id, 'some text', USER_ID, new Date());
      component.message.phoneRequest = phoneRequestState.pending;
      fixture.detectChanges();
      element = fixture.debugElement.queryAll(By.css('button.btn'))[0];
      component.ngOnInit();
    });

    it('should call conversationService.openPhonePopup with the current conversation, when the button is clicked', () => {
      spyOn(conversationService, 'openPhonePopup');

      element.triggerEventHandler('click', {});

      expect(conversationService.openPhonePopup).toHaveBeenCalledWith(component.currentConversation);
    });
  });

});
