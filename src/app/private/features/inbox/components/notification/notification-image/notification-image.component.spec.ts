import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NOTIFICATION_PRODUCT_STATUS } from '@private/features/inbox/core/enums/notification-product-status.enum';
import { NOTIFICATION_VARIANT } from '@private/features/inbox/core/enums/notification-variant.enum';
import { Notification } from '@private/features/inbox/core/interfaces/notification.interface';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NotificationImageComponent } from './notification-image.component';

describe('NotificationImageComponent', () => {
  let component: NotificationImageComponent;
  let fixture: ComponentFixture<NotificationImageComponent>;
  let element: HTMLElement;

  const notificationProductStatusReserved: Notification = {
    variant: NOTIFICATION_VARIANT.PRODUCT,
    productStatus: NOTIFICATION_PRODUCT_STATUS.RESERVED,
    isRead: false,
    date: new Date(new Date().getTime() - Math.floor(Math.random() * 10 + 1) * 600000000),
    title: 'Product reserved',
    description:
      'Cillum ipsum ullamco adipisicing laborum excepteur id tempor laborum. Aliqua nisi incididunt culpa voluptate culpa minim ad eiusmod. Ad voluptate mollit officia sunt reprehenderit.',
    image: 'https://picsum.photos/200/300',
  };

  const generalNotification = {
    variant: NOTIFICATION_VARIANT.GENERAL,
    productStatus: undefined,
    isRead: true,
    date: new Date(new Date().getTime() - Math.floor(Math.random() * 10 + 1) * 60000),
    title: 'My general notification',
    description: 'Cupidatat ad nostrud cillum',
    image: 'https://picsum.photos/200/300',
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule, NgxPermissionsModule.forRoot()],
        declarations: [NotificationImageComponent],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationImageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  describe(`If receive a general notification`, () => {
    beforeEach(() => {
      component.notification = generalNotification;
      fixture.detectChanges();
    });

    it('should render a circle image', () => {
      const highlightedNotification: DebugElement = fixture.debugElement.query(By.css('.NotificationImage--circle'));
      expect(highlightedNotification).toBeTruthy();
    });
  });

  describe(`If receive a notification about reserved product`, () => {
    beforeEach(() => {
      component.notification = notificationProductStatusReserved;
      fixture.detectChanges();
    });

    it('should render a rounded image', () => {
      const highlightedNotification: DebugElement = fixture.debugElement.query(By.css('.NotificationImage--rounded'));
      expect(highlightedNotification).toBeTruthy();
    });

    it('should render a reserved badge with icon', () => {
      const highlightedNotification: DebugElement = fixture.debugElement.query(By.css('tsl-svg-icon'));
      expect(highlightedNotification).toBeTruthy();
    });
  });
});
