import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { InboxPageComponent } from './inbox-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { UnreadChatMessagesService } from '@core/unread-chat-messages/unread-chat-messages.service';
import { MockUnreadChatMessagesService } from '@fixtures/chat';
import { NotificationApiService } from '@api/notification/notification-api.service';
import { of } from 'rxjs';

describe('InboxComponent', () => {
  let component: InboxPageComponent;
  let fixture: ComponentFixture<InboxPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [InboxPageComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: UnreadChatMessagesService, useClass: MockUnreadChatMessagesService },
        {
          provide: NotificationApiService,
          useValue: {
            totalUnreadNotifications$: of(0),
            getNotifications: () => {},
            refreshUnreadNotifications: () => {},
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InboxPageComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });
});
