import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NOTIFICATION_PRODUCT_STATUS } from '../../core/enums/notification-product-status.enum';
import { NOTIFICATION_VARIANT } from '../../core/enums/notification-variant.enum';
import { Notification } from '../../core/interfaces/notification.interface';
import { NotificationsInboxComponent } from './notifications-inbox.component';

describe('NotificationsInboxComponent', () => {
  let component: NotificationsInboxComponent;
  let fixture: ComponentFixture<NotificationsInboxComponent>;
  let element: HTMLElement;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule, NgxPermissionsModule.forRoot()],
        declarations: [NotificationsInboxComponent],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );
  const notifications: Notification[] = [
    {
      variant: NOTIFICATION_VARIANT.GENERAL,
      productStatus: undefined,
      isRead: true,
      date: new Date(new Date().getTime() - Math.floor(Math.random() * 10 + 1) * 60000),
      title: 'My general notification',
      description: 'Cupidatat ad nostrud cillum',
      image: 'https://picsum.photos/200/300',
    },
  ];

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsInboxComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  describe(`If receive notifications`, () => {
    beforeEach(() => {
      component.notifications = notifications;
      fixture.detectChanges();
    });
    it('should render at least one notification component', () => {
      const notification: DebugElement = fixture.debugElement.query(By.css('tsl-notification'));
      expect(notification).toBeTruthy();
    });
  });
});
