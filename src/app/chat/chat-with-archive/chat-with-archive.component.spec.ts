import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ChatWithArchiveComponent } from './chat-with-archive.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { TrackingService } from '../../core/tracking/tracking.service';
import { AdService } from '../../core/ad/ad.service';
import { HttpService } from '../../core/http/http.service';
import { I18nService } from '../../core/i18n/i18n.service';
import { Conversation } from '../../core/conversation/conversation';
import { EventService } from '../../core/event/event.service';
import { ConversationService } from '../../core/conversation/conversation.service';
import { UserService } from '../../core/user/user.service';
import { PersistencyService } from '../../core/persistency/persistency.service';
import { ItemService } from '../../core/item/item.service';
import { MockTrackingService } from '../../../tests/tracking.fixtures.spec';
import { User } from '../../core/user/user';
import { USER_ID, USER_WEB_SLUG } from '../../../tests/user.fixtures.spec';
import { Item } from '../../core/item/item';
import { ITEM_ID } from '../../../tests/item.fixtures.spec';
import { MOCK_CONVERSATION, SURVEY_RESPONSES } from '../../../tests/conversation.fixtures.spec';
import { NgxPermissionsModule } from 'ngx-permissions';
import { BlockUserXmppService } from '../../core/conversation/block-user';
import { environment } from '../../../environments/environment';

class MockConversationService {
  storedPhoneNumber: string;

  sendRead(conversation: Conversation) {
  }

  archive(id: string) {
  }

  stream() {
  }

}

class MockUserService {

  public reportUser(): Observable<any> {
    return Observable.of({});
  }


  public isProfessional() {
    return Observable.of(true);
  }
}

class MockItemService {

  public reportListing(): Observable<any> {
    return Observable.of({});
  }
}

class MockedToastr {

  success(message: string, title?: string, optionsOverride?: any): any {
  }
}

describe('ChatWithArchiveComponent', () => {
  let component: ChatWithArchiveComponent;
  let eventService: EventService;
  let conversationService: ConversationService;
  let conversation: Conversation;
  let userService: UserService;
  let itemService: MockItemService;
  let trackingService: TrackingService;
  let toastr: ToastrService;
  let modalService: NgbModal;
  let blockService: BlockUserXmppService;
  let persistencyService: PersistencyService;
  let adService: AdService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatWithArchiveComponent ],
      imports: [NgbModule.forRoot(), FormsModule, NgxPermissionsModule],
      providers: [
        ChatWithArchiveComponent,
        {provide: ConversationService, useClass: MockConversationService},
        {provide: ItemService, useClass: MockItemService},
        {provide: TrackingService, useClass: MockTrackingService},
        {provide: UserService, useClass: MockUserService},
        {provide: HttpService, useValue: {}},
        {provide: ToastrService, useClass: MockedToastr},
        {provide: 'SUBDOMAIN', useValue: 'www'},
        {
          provide: PersistencyService, useValue: {
          getMetaInformation() {
            return Observable.of({});
          },
          saveMetaInformation() {},
          getPhoneNumber() {
            return Observable.of({});
          }
        }
        },
        I18nService,
        EventService,
        {
          provide: BlockUserXmppService, useValue: {
          blockUser() {
          },
          unblockUser() {
          }
        }
        },
        {
          provide: AdService,
          useValue: {
            startAdsRefresh() {
            },
            stopAdsRefresh() {
            }
          }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    component = TestBed.createComponent(ChatWithArchiveComponent).componentInstance;
    eventService = TestBed.get(EventService);
    conversationService = TestBed.get(ConversationService);
    userService = TestBed.get(UserService);
    trackingService = TestBed.get(TrackingService);
    itemService = TestBed.get(ItemService);
    toastr = TestBed.get(ToastrService);
    modalService = TestBed.get(NgbModal);
    blockService = TestBed.get(BlockUserXmppService);
    persistencyService = TestBed.get(PersistencyService);
    adService = TestBed.get(AdService);
  });

  describe('onCurrentConversationChange', () => {
    const WEB_SLUG_USER = 'https://www.wallapop.com/user/';

    beforeEach(() => {
      spyOn(conversationService, 'sendRead');
      const USER = new User(USER_ID, null, null, null, null, null, null, null, null, null, null, null, null, USER_WEB_SLUG);
      conversation = new Conversation('1', 1, new Date().getTime(), false, USER, new Item(ITEM_ID, 500002512, USER_ID), [], '666', SURVEY_RESPONSES);
    });

    it('should set the current conversation', () => {
      component.onCurrentConversationChange(conversation);

      expect(component.currentConversation).toBe(conversation);
    });

    it('should send the conversation status', () => {
      component.onCurrentConversationChange(conversation);

      expect(conversationService.sendRead).toHaveBeenCalledWith(conversation);
    });

    it('should set which conversation is active', () => {
      const conversationOld: Conversation = MOCK_CONVERSATION(2);
      conversationOld.active = true;
      component.currentConversation = conversationOld;

      component.onCurrentConversationChange(conversation);

      expect(conversationOld.active).toBeFalsy();
      expect(conversation.active).toBeTruthy();
    });

    it('should NOT send the conversation status if conversation is NULL', () => {
      component.onCurrentConversationChange(null);

      expect(conversationService.sendRead).not.toHaveBeenCalled();
    });

    it('should set userWebSlug', () => {
      component.onCurrentConversationChange(conversation);
      expect(component.userWebSlug).toBe(environment.siteUrl.replace('es', 'www') + 'user/' + USER_WEB_SLUG);
    });
  });

  it('should set the conversationsLoaded value to FALSE when event.loaded is false', () => {
    component.onLoaded({
      loaded: false,
      total: 0,
      firstPage: true
    });

    expect(component.conversationsLoaded).toBe(false);
    expect(component.conversationsTotal).toBe(0);
  });

  it('should set the conversationsLoaded value to TRUE when event.loaded AND event.firstPage are true', () => {
    component.onLoaded({
      loaded: false,
      total: 0,
      firstPage: true
    });

    expect(component.conversationsLoaded).toBe(false);
    expect(component.conversationsTotal).toBe(0);

    component.onLoaded({
      loaded: true,
      total: 10,
      firstPage: true
    });

    expect(component.conversationsLoaded).toBe(true);
    expect(component.conversationsTotal).toBe(10);
  });

  it('should set the conversationsLoaded value to TRUE when event.firstPage is NOT true', () => {
    component.onLoaded({
      loaded: false,
      total: 0,
      firstPage: false
    });

    expect(component.conversationsLoaded).toBe(true);
    expect(component.conversationsTotal).toBe(0);
  });

  describe('ngOnInit', () => {
    const phone = '+34912345678';

    it('should set connection error', () => {
      component.ngOnInit();
      eventService.emit(EventService.CONNECTION_ERROR);

      expect(component.connectionError).toBeTruthy();
      expect(component.conversationsLoaded).toBeTruthy();
    });


    it('should set firstLoad to false after DB_READY event triggered, and if getMetaInformation return meta', () => {
      component.ngOnInit();
      eventService.emit(EventService.DB_READY);

      expect(component.firstLoad).toBe(false);
    });

    it('should set firstLoad true and call saveMetaInformation if getMetaInformation does NOT return meta', () => {
      spyOn(persistencyService, 'getMetaInformation').and.returnValue(Observable.throw('err'));
      spyOn(persistencyService, 'saveMetaInformation');

      component.ngOnInit();
      eventService.emit(EventService.DB_READY);

      expect(component.firstLoad).toBe(true);
      expect(persistencyService.saveMetaInformation).toHaveBeenCalled();
    });

    it('should call persistencyService.getPhoneNumber and set the phone number in conversationService', () => {
      spyOn(persistencyService, 'getMetaInformation').and.returnValue(Observable.throw('err'));
      spyOn(persistencyService, 'getPhoneNumber').and.returnValue(Observable.of({phone: phone}));

      component.ngOnInit();
      eventService.emit(EventService.DB_READY);

      expect(persistencyService.getPhoneNumber).toHaveBeenCalled();
      expect(conversationService.storedPhoneNumber).toBe(phone);
    });
  });

  describe('reportListingAction', () => {
    beforeEach(() => {
      spyOn(modalService, 'open').and.returnValue({
        result: Promise.resolve({
          message: 'Report Listing Reason',
          reason: 1
        })
      });
    });

    describe('success', () => {
      it('should call the itemService.reportListing and then close the modal and show a toast', fakeAsync(() => {
        spyOn(itemService, 'reportListing').and.callThrough();
        spyOn(toastr, 'success').and.callThrough();
        component.currentConversation = MOCK_CONVERSATION();

        component.reportListingAction();
        tick();

        expect(itemService.reportListing).toHaveBeenCalledWith(ITEM_ID,
          'Report Listing Reason',
          1,
          component.currentConversation.legacyId);
        expect(toastr.success).toHaveBeenCalledWith('The listing has been reported correctly');
      }));

      it('should track the ProductRepported event', fakeAsync(() => {
        spyOn(trackingService, 'track');
        spyOn(itemService, 'reportListing').and.callThrough();
        spyOn(toastr, 'success').and.callThrough();
        component.currentConversation = MOCK_CONVERSATION();

        component.reportListingAction();
        tick();

        expect(trackingService.track).toHaveBeenCalledWith(TrackingService.PRODUCT_REPPORTED, {
          product_id: ITEM_ID,
          reason_id: 1
        });
      }));
    });

    describe('error', () => {
      it('should open toastr if error 403', fakeAsync(() => {
        spyOn(itemService, 'reportListing').and.returnValue(Observable.throw({
          status: 403
        }));
        spyOn(toastr, 'success').and.callThrough();
        component.currentConversation = MOCK_CONVERSATION();

        component.reportListingAction();
        tick();

        expect(toastr.success).toHaveBeenCalled();
      }));
    });
  });

  describe('reportUserAction', () => {
    beforeEach(() => {
      spyOn(modalService, 'open').and.returnValue({
        result: Promise.resolve({
          message: 'Report User Reason',
          reason: 1
        })
      });
    });

    it('should call the itemService.reportListing and then close the modal and show a toast', fakeAsync(() => {
      spyOn(userService, 'reportUser').and.callThrough();
      spyOn(toastr, 'success').and.callThrough();
      component.currentConversation = MOCK_CONVERSATION();

      component.reportUserAction();
      tick();

      expect(userService.reportUser).toHaveBeenCalledWith(component.currentConversation.user.id,
        component.currentConversation.item.legacyId,
        'Report User Reason',
        1,
        component.currentConversation.legacyId);
      expect(toastr.success).toHaveBeenCalledWith('The user has been reported correctly');
    }));

    it('should track the UserProfileRepported event', fakeAsync(() => {
      spyOn(trackingService, 'track');
      spyOn(userService, 'reportUser').and.callThrough();
      spyOn(toastr, 'success').and.callThrough();
      component.currentConversation = MOCK_CONVERSATION();

      component.reportUserAction();
      tick();

      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.USER_PROFILE_REPPORTED, {
        user_id: 'l1kmzn82zn3p',
        reason_id: 1
      });
    }));
  });

  describe('archiveConversation', () => {
    beforeEach(() => {
      spyOn(modalService, 'open').and.returnValue({
        result: Promise.resolve()
      });
      spyOn(conversationService, 'stream');
    });

    it('should close the modal, emit an event, clear the current conversation and show the toast', fakeAsync(() => {
      component.currentConversation = MOCK_CONVERSATION();
      spyOn(conversationService, 'archive').and.returnValue(Observable.of({}));
      spyOn(toastr, 'success').and.callThrough();

      component.archiveConversation();
      tick();

      expect(conversationService.archive).toHaveBeenCalledWith(component.currentConversation.id);
      expect(conversationService.stream).toHaveBeenCalled();
      expect(toastr.success).toHaveBeenCalledWith('The conversation has been archived correctly');
    }));
  });

  describe('blockUserAction', () => {
    beforeEach(() => {
      spyOn(modalService, 'open').and.returnValue({
        result: Promise.resolve()
      });
    });

    it('should close the modal, call blockUser and show the toast', fakeAsync(() => {
      component.currentConversation = MOCK_CONVERSATION();
      spyOn(blockService, 'blockUser').and.returnValue(Observable.of({}));
      spyOn(toastr, 'success').and.callThrough();

      component.blockUserAction();
      tick();

      expect(blockService.blockUser).toHaveBeenCalledWith(component.currentConversation.user);
      expect(toastr.success).toHaveBeenCalledWith('The user has been blocked');
    }));
  });

  describe('unblockUserAction', () => {
    beforeEach(() => {
      spyOn(modalService, 'open').and.returnValue({
        result: Promise.resolve()
      });
    });

    it('should close the modal, call unblockUser and show the toast', fakeAsync(() => {
      component.currentConversation = MOCK_CONVERSATION();
      spyOn(blockService, 'unblockUser').and.returnValue(Observable.of({}));
      spyOn(toastr, 'success').and.callThrough();

      component.unblockUserAction();
      tick();

      expect(blockService.unblockUser).toHaveBeenCalledWith(component.currentConversation.user);
      expect(toastr.success).toHaveBeenCalledWith('The user has been unblocked');
    }));
  });

  it('should call start refresh ad when init some conversation', () => {
    spyOn(adService, 'startAdsRefresh');

    component.onCurrentConversationChange(conversation);

    expect(adService.startAdsRefresh).toHaveBeenCalled();
  });

  it('should call stopAdsRefresh when destroy component', () => {
    spyOn(adService, 'stopAdsRefresh');

    component.ngOnInit();
    component.ngOnDestroy();

    expect(adService.stopAdsRefresh).toHaveBeenCalled();
  });
});
