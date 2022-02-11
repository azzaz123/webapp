import { Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HashtagSuggesterApiService } from '@private/features/upload/core/services/hashtag-suggestions/hashtag-suggester-api.service';
import { CancelBubbleModule } from '@public/shared/components/cancel-bubble/cancel-bubble.module';
import { Component, Input } from '@angular/core';
import { NotificationComponent } from './notification.component';
import { Notification } from '../../core/interfaces/notification.interface';
import { NOTIFICATION_VARIANT } from '../../core/enums/notification-variant.enum';
import { NOTIFICATION_PRODUCT_STATUS } from '../../core/enums/notification-product-status.enum';
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
      declarations: [StoryNotificationComponent, NotificationComponent],
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
      description: 'Notification description',
      photo: 'https://picsum.photos/200/300',
    },
    {
      variant: NOTIFICATION_VARIANT.PRODUCT,
      productStatus: NOTIFICATION_PRODUCT_STATUS.LOWERED,
      isRead: false,
      date: new Date().getTime(),
      title: 'My new notification',
      description: 'Notification description',
      photo: 'https://picsum.photos/200/300',
    },
  ],
};
