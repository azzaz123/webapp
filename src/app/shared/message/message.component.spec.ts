/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MessageComponent } from './message.component';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { MOCK_MESSAGE } from '../../../tests/message.fixtures.spec';
import { USER_ID, USER_WEB_SLUG } from '../../../tests/user.fixtures.spec';
import { User } from '../../core/user/user';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { By } from '@angular/platform-browser';
import { SendPhoneComponent } from '../../chat/modals/send-phone/send-phone.component';
import { phoneRequestState } from '../../core/message/message';
import { MOCK_CONVERSATION } from '../../../tests/conversation.fixtures.spec';

const WEB_SLUG_USER = 'https://www.wallapop.com/user/';

describe('Component: Message', () => {
  let component: MessageComponent;
  let fixture: ComponentFixture<MessageComponent>;
  let modalService: NgbModal;
  let element: DebugElement;
  const componentInstance: any = { SendPhoneComponent: jasmine.createSpy('SendPhoneComponent') };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {provide: 'SUBDOMAIN', useValue: 'www'},
        {
          provide: NgbModal, useValue: {
            open() {
              return {
                result: Promise.resolve(),
                componentInstance: componentInstance
              };
            }
          }
        },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageComponent);
    modalService = TestBed.get(NgbModal);
    component = fixture.componentInstance;
    MOCK_MESSAGE.user = new User(USER_ID, null, null, null, null, null, null, null, null, null, null, null, null, USER_WEB_SLUG);
    component.message = MOCK_MESSAGE;
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should set userWebSlug', () => {
      expect(component.userWebSlug).toBe(WEB_SLUG_USER + USER_WEB_SLUG);
    });
  });


  describe('openDialog', () => {
    beforeEach(() => {
      spyOn(modalService, 'open').and.callThrough();
      component.message.phoneRequest = phoneRequestState.pending;
      component.currentConversation = MOCK_CONVERSATION();
      fixture.detectChanges();
      element = fixture.debugElement.queryAll(By.css('button.btn'))[0];
      component.ngOnInit();
    });

    it('should open phoneRequest modal when the button is clicked', () => {
      element.triggerEventHandler('click', {});

      expect(modalService.open).toHaveBeenCalledWith(SendPhoneComponent, {
        windowClass: 'phone-request'
      });
    });

    it('should set the modal conversation to the currentConversation, when the modal is opened by clicking the button', () => {
      component['modalRef'] = <any>{
        componentInstance: componentInstance
      };

      element.triggerEventHandler('click', {});

      expect(component['modalRef'].componentInstance.conversation).toBe(component.currentConversation);
    });
  });

});
