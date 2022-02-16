import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NOTIFICATION_PRODUCT_STATUS } from '../../core/enums/notification-product-status.enum';
import { NOTIFICATION_VARIANT } from '../../core/enums/notification-variant.enum';
import { Notification } from '../../core/interfaces/notification.interface';
import { NotificationComponent } from './notification.component';

describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;
  let element: HTMLElement;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule, NgxPermissionsModule.forRoot()],
        declarations: [NotificationComponent],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  const highlightedNotification: Notification = {
    variant: NOTIFICATION_VARIANT.HIGHLIGHTED,
    productStatus: undefined,
    isRead: true,
    date: new Date(new Date().getTime() - Math.floor(Math.random() * 10 + 1) * 6000000),
    title: 'Highlighted card',
    description:
      'Cillum ipsum ullamco adipisicing laborum excepteur id tempor laborum. Aliqua nisi incididunt culpa voluptate culpa minim ad eiusmod. Ad voluptate mollit officia sunt reprehenderit.',
    image: 'https://picsum.photos/200/300',
  };

  const pinnedNotification: Notification = {
    variant: NOTIFICATION_VARIANT.PINNED,
    productStatus: undefined,
    isRead: false,
    date: new Date(new Date().getTime() - Math.floor(Math.random() * 10 + 1) * 60000),
    title: 'Pinned card',
    description:
      'Cillum ipsum ullamco adipisicing laborum excepteur id tempor laborum. Aliqua nisi incididunt culpa voluptate culpa minim ad eiusmod. Ad voluptate mollit officia sunt reprehenderit.',
    image: 'https://picsum.photos/200/300',
  };

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  describe(`If receive highlighted notification`, () => {
    beforeEach(() => {
      component.notification = highlightedNotification;
      fixture.detectChanges();
    });
    it('should render a highlighted notification', () => {
      const highlightedNotification: DebugElement = fixture.debugElement.query(By.css('.Notification--highlighted'));
      expect(highlightedNotification).toBeTruthy();
    });
  });

  describe(`If receive pinned notification`, () => {
    beforeEach(() => {
      component.notification = pinnedNotification;
      fixture.detectChanges();
    });
    it('should render a highlighted notification', () => {
      const pinnedNotification: DebugElement = fixture.debugElement.query(By.css('.Notification--pinned'));
      expect(pinnedNotification).toBeTruthy();
    });
  });

  describe(`If  pinned notification is not readed`, () => {
    beforeEach(() => {
      component.notification = pinnedNotification;
      fixture.detectChanges();
    });
    it('should render red bullet', () => {
      const notificationBullet: DebugElement = fixture.debugElement.query(By.css('.Notification__bullet'));
      expect(notificationBullet).toBeTruthy();
    });
  });
});
