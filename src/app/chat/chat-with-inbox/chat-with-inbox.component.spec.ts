import { TestBed } from '@angular/core/testing';
import { ChatWithInboxComponent } from './chat-with-inbox.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { AdService } from '../../core/ad/ad.service';
import { HttpService } from '../../core/http/http.service';
import { I18nService } from '../../core/i18n/i18n.service';
import { EventService } from '../../core/event/event.service';
import { UserService } from '../../core/user/user.service';
import { NgxPermissionsModule } from 'ngx-permissions';
import { CREATE_MOCK_INBOX_CONVERSATION } from '../../../tests/inbox.fixtures.spec';

class MockUserService {
  public isProfessional() {
    return Observable.of(true);
  }
}


describe('Component: ChatWithInboxComponent', () => {
  let component: ChatWithInboxComponent;
  let eventService: EventService;
  let adService: AdService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatWithInboxComponent ],
      imports: [NgbModule.forRoot(), FormsModule, NgxPermissionsModule],
      providers: [
        ChatWithInboxComponent,
        {provide: UserService, useClass: MockUserService},
        {provide: HttpService, useValue: {}},
        I18nService,
        EventService,
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
    component = TestBed.createComponent(ChatWithInboxComponent).componentInstance;
    eventService = TestBed.get(EventService);
    adService = TestBed.get(AdService);
  });

  it('should set the conversationsLoading value to FALSE when event.loading is false', () => {
    component.onLoad({
      loading: false,
      total: 0,
    });

    expect(component.conversationsLoading).toBe(false);
    expect(component.conversationsTotal).toBe(0);
  });

  it('should set the conversationsLoading value to TRUE when event.loading is true', () => {
    component.onLoad({
      loading: false,
      total: 0,
    });

    expect(component.conversationsLoading).toBe(false);
    expect(component.conversationsTotal).toBe(0);

    component.onLoad({
      loading: true,
      total: 10,
    });

    expect(component.conversationsLoading).toBe(true);
    expect(component.conversationsTotal).toBe(10);
  });

  describe('ngOnInit', () => {
    it('should set connectionError and conversationLoading to FALSE when a EventService.CONNECTION_ERROR is emitted', () => {
      component.ngOnInit();
      eventService.emit(EventService.CONNECTION_ERROR);

      expect(component.connectionError).toBe(true);
      expect(component.conversationsLoading).toBe(false);
    });

    it('should set connectionError to FALSE when a EventService.CONNECTION_RESTORED event is emitted', () => {
      component.ngOnInit();
      eventService.emit(EventService.CONNECTION_RESTORED);

      expect(component.connectionError).toBe(false);
    });

    it('should set currentConversation when a EventService.CURRENT_CONVERSATION_SET is emitted', () => {
      const mockConversation = CREATE_MOCK_INBOX_CONVERSATION();
      component.ngOnInit();


      eventService.emit(EventService.CURRENT_CONVERSATION_SET, mockConversation);

      expect(component.currentConversation).toEqual(mockConversation);
    });
  });

  it('should call stopAdsRefresh when destroy component', () => {
    spyOn(adService, 'stopAdsRefresh');

    component.ngOnDestroy();

    expect(adService.stopAdsRefresh).toHaveBeenCalled();
  });
});
