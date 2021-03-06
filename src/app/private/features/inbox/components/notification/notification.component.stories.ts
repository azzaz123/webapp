import { Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NotificationComponent } from './notification.component';
import { Notification } from '../../../../../api/core/model/notification/notification.interface';
import { NOTIFICATION_VARIANT } from '../../core/enums/notification-variant.enum';
import { NOTIFICATION_PRODUCT_STATUS } from '../../core/enums/notification-product-status.enum';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { HttpClientModule } from '@angular/common/http';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { NotificationImageModule } from '@private/features/inbox/components/notification/notification-image/notification-image.module';
import { UserService } from '@core/user/user.service';
import { BehaviorSubject } from 'rxjs';
import { ExternalCommsService } from '@core/external-comms.service';
import { NotificationApiService } from '@api/notification/notification-api.service';

@Component({
  selector: 'tsl-story-notifications-container',
  template: `
    <div class="container" *ngFor="let notification of notifications">
      <tsl-notification [notification]="notification"></tsl-notification>
    </div>
  `,
})
class StoryNotificationComponent {
  @Input() notifications: Notification[];
}
export default {
  title: 'Webapp/Private/Features/Notification/Components/Notification',
  component: StoryNotificationComponent,
  decorators: [
    moduleMetadata({
      declarations: [StoryNotificationComponent, NotificationComponent],
      imports: [CommonModule, SvgIconModule, HttpClientModule, NotificationImageModule],
      providers: [
        {
          provide: AnalyticsService,
          useClass: MockAnalyticsService,
        },
        NotificationApiService,
        {
          provide: ExternalCommsService,
          useValue: {
            brazeReady$: new BehaviorSubject(true),
          },
        },
        {
          provide: UserService,
          useValue: {
            isLogged: true,
          },
        },
      ],
    }),
  ],
};

const Template: Story<StoryNotificationComponent> = (args) => ({
  props: args,
  template: `
  <tsl-story-notifications-container [notifications]="notifications"></tsl-story-notifications-container>`,
});

export const Default = Template.bind({});

Default.args = {
  notifications: [
    {
      variant: NOTIFICATION_VARIANT.PINNED,
      productStatus: undefined,
      isRead: false,
      date: new Date(new Date().getTime() - Math.floor(Math.random() * 10 + 1) * 60000),
      title: 'Pinned card',
      description:
        'Cillum ipsum ullamco adipisicing laborum excepteur id tempor laborum. Aliqua nisi incididunt culpa voluptate culpa minim ad eiusmod. Ad voluptate mollit officia sunt reprehenderit.',
      image: 'https://picsum.photos/200/300',
    },
    {
      variant: NOTIFICATION_VARIANT.GENERAL,
      productStatus: undefined,
      isRead: true,
      date: new Date(new Date().getTime() - Math.floor(Math.random() * 10 + 1) * 60000),
      title: 'My general notification',
      description: 'Cupidatat ad nostrud cillum',
      image: 'https://picsum.photos/200/300',
    },
    {
      variant: NOTIFICATION_VARIANT.PRODUCT,
      productStatus: NOTIFICATION_PRODUCT_STATUS.LOWERED,
      isRead: false,
      date: new Date(new Date().getTime() - Math.floor(Math.random() * 10 + 1) * 60000),
      title: 'Product price lowered',
      description:
        'Cillum ipsum ullamco adipisicing laborum excepteur id tempor laborum. Aliqua nisi incididunt culpa voluptate culpa minim ad eiusmod. Ad voluptate mollit officia sunt reprehenderit.',
      image: 'https://picsum.photos/200/300',
    },
    {
      variant: NOTIFICATION_VARIANT.PRODUCT,
      productStatus: NOTIFICATION_PRODUCT_STATUS.RESERVED,
      isRead: false,
      date: new Date(new Date().getTime() - Math.floor(Math.random() * 10 + 1) * 600000000),
      title: 'Product reserved',
      description:
        'Cillum ipsum ullamco adipisicing laborum excepteur id tempor laborum. Aliqua nisi incididunt culpa voluptate culpa minim ad eiusmod. Ad voluptate mollit officia sunt reprehenderit.',
      image: 'https://picsum.photos/200/300',
    },
    {
      variant: NOTIFICATION_VARIANT.PRODUCT,
      productStatus: NOTIFICATION_PRODUCT_STATUS.SOLD,
      isRead: true,
      date: new Date(new Date().getTime() - Math.floor(Math.random() * 10 + 1) * 60000),
      title: 'Product sold',
      description:
        'Cillum ipsum ullamco adipisicing laborum excepteur id tempor laborum. Aliqua nisi incididunt culpa voluptate culpa minim ad eiusmod. Ad voluptate mollit officia sunt reprehenderit.',
      image: 'https://picsum.photos/200/300',
    },
    {
      variant: NOTIFICATION_VARIANT.HIGHLIGHTED,
      productStatus: undefined,
      isRead: true,
      date: new Date(new Date().getTime() - Math.floor(Math.random() * 10 + 1) * 6000000),
      title: 'Highlighted card',
      description:
        'Cillum ipsum ullamco adipisicing laborum excepteur id tempor laborum. Aliqua nisi incididunt culpa voluptate culpa minim ad eiusmod. Ad voluptate mollit officia sunt reprehenderit.',
      image: 'https://picsum.photos/200/300',
    },
  ],
};
