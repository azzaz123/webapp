import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NOTIFICATION_PRODUCT_STATUS } from '@private/features/inbox/core/enums/notification-product-status.enum';
import { NOTIFICATION_VARIANT } from '@private/features/inbox/core/enums/notification-variant.enum';
import { Notification } from '@api/core/model/notification/notification.interface';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NotificationImageComponent } from './notification-image.component';

describe('NotificationImageComponent', () => {
  let component: NotificationImageComponent;
  let fixture: ComponentFixture<NotificationImageComponent>;
  let element: HTMLElement;

  const srcReservedBadge = '/assets/icons/item-card/reserved.svg';
  const srcSoldBadge = '/assets/icons/item-card/sold.svg';
  const srcSaveMoneyBadge = '/assets/icons/save_money.svg';

  const notificationProductStatusReserved: Notification = {
    variant: NOTIFICATION_VARIANT.PRODUCT,
    productStatus: NOTIFICATION_PRODUCT_STATUS.RESERVED,
    isRead: false,
    date: new Date(new Date().getTime() - Math.floor(Math.random() * 10 + 1) * 600000000),
    title: 'Product reserved',
    description:
      'Cillum ipsum ullamco adipisicing laborum excepteur id tempor laborum. Aliqua nisi incididunt culpa voluptate culpa minim ad eiusmod. Ad voluptate mollit officia sunt reprehenderit.',
    image: 'https://picsum.photos/200/300',
    url: 'es.wallapop.com',
  };

  const notificationProductStatusSold: Notification = {
    variant: NOTIFICATION_VARIANT.PRODUCT,
    productStatus: NOTIFICATION_PRODUCT_STATUS.SOLD,
    isRead: false,
    date: new Date(new Date().getTime() - Math.floor(Math.random() * 10 + 1) * 600000000),
    title: 'Product reserved',
    description:
      'Cillum ipsum ullamco adipisicing laborum excepteur id tempor laborum. Aliqua nisi incididunt culpa voluptate culpa minim ad eiusmod. Ad voluptate mollit officia sunt reprehenderit.',
    image: 'https://picsum.photos/200/300',
    url: 'es.wallapop.com',
  };

  const notificationProductStatusLowered: Notification = {
    variant: NOTIFICATION_VARIANT.PRODUCT,
    productStatus: NOTIFICATION_PRODUCT_STATUS.LOWERED,
    isRead: false,
    date: new Date(new Date().getTime() - Math.floor(Math.random() * 10 + 1) * 600000000),
    title: 'Product reserved',
    description:
      'Cillum ipsum ullamco adipisicing laborum excepteur id tempor laborum. Aliqua nisi incididunt culpa voluptate culpa minim ad eiusmod. Ad voluptate mollit officia sunt reprehenderit.',
    image: 'https://picsum.photos/200/300',
    url: 'es.wallapop.com',
  };

  const generalNotification: Notification = {
    variant: NOTIFICATION_VARIANT.GENERAL,
    productStatus: undefined,
    isRead: true,
    date: new Date(new Date().getTime() - Math.floor(Math.random() * 10 + 1) * 60000),
    title: 'My general notification',
    description: 'Cupidatat ad nostrud cillum',
    image: 'https://picsum.photos/200/300',
    url: 'es.wallapop.com',
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

    it('badge src should be reserved badge', () => {
      const highlightedSvgNotification: DebugElement = fixture.debugElement.query(By.css('tsl-svg-icon'));
      expect(highlightedSvgNotification.attributes.src).toEqual(srcReservedBadge);
    });
  });

  describe(`If receive a notification about reserved product`, () => {
    beforeEach(() => {
      component.notification = notificationProductStatusSold;
      fixture.detectChanges();
    });

    it('should render a rounded image', () => {
      const soldProductNotification: DebugElement = fixture.debugElement.query(By.css('.NotificationImage--rounded'));
      expect(soldProductNotification).toBeTruthy();
    });

    it('badge src should be sold badge', () => {
      const notificationSvgProductStatusSold: DebugElement = fixture.debugElement.query(By.css('tsl-svg-icon'));
      expect(notificationSvgProductStatusSold.attributes.src).toEqual(srcSoldBadge);
    });
  });

  describe(`If receive a notification about reserved product`, () => {
    beforeEach(() => {
      component.notification = notificationProductStatusLowered;
      fixture.detectChanges();

      it('should render a rounded image', () => {
        const loweredProductNotification: DebugElement = fixture.debugElement.query(By.css('.NotificationImage--rounded'));
        expect(loweredProductNotification).toBeTruthy();
      });

      it('badge src should be save money badge', () => {
        const notificationSvgProductStatusLowered: DebugElement = fixture.debugElement.query(By.css('tsl-svg-icon'));
        expect(notificationSvgProductStatusLowered.attributes.src).toEqual(srcSaveMoneyBadge);
      });
    });
  });
});
