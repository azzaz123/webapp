import { Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { CancelBubbleModule } from '@public/shared/components/cancel-bubble/cancel-bubble.module';
import { Component, Input } from '@angular/core';
import { NotificationComponent } from './notification.component';
import { Notification } from '../../core/interfaces/notification.interface';
import { NOTIFICATION_VARIANT } from '../../core/enums/notification-variant.enum';
import { NOTIFICATION_PRODUCT_STATUS } from '../../core/enums/notification-product-status.enum';
import { GenericImageComponent } from '@shared/generic-image/generic-image.component';
import { SanitizedBackgroundModule } from '@shared/sanitized-background/sanitized-background.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
@Component({
  selector: 'tsl-story-notifications-container',
  template: `
    {{ notifications.length }}
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
      declarations: [StoryNotificationComponent, NotificationComponent, GenericImageComponent],
      imports: [CommonModule],
      providers: [],
    }),
  ],
};

const Template: Story<StoryNotificationComponent> = (args) => ({
  props: args,
  template: `
  <tsl-story-notifications-container [notifications]="notifications"></tsl-story-notifications-container>
    `,
});

export const Default = Template.bind({});

Default.args = {
  notifications: [
    {
      variant: NOTIFICATION_VARIANT.GENERAL,
      productStatus: null,
      isRead: false,
      date: new Date().getTime(),
      title: 'My new notification',
      description: 'Cupidatat ad nostrud cillum',
      image: 'https://picsum.photos/200/300',
    },
    {
      variant: NOTIFICATION_VARIANT.PRODUCT,
      productStatus: NOTIFICATION_PRODUCT_STATUS.LOWERED,
      isRead: false,
      date: new Date().getTime(),
      title: 'My new notification',
      description:
        'Cillum ipsum ullamco adipisicing laborum excepteur id tempor laborum. Aliqua nisi incididunt culpa voluptate culpa minim ad eiusmod. Ad voluptate mollit officia sunt reprehenderit.',
      image: 'https://picsum.photos/200/300',
    },
  ],
};
