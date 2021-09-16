import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { SubscriptionCardComponent } from './subscription-card.component';
import { SUBSCRIPTIONS } from '@fixtures/subscriptions.fixtures.spec';
import { HttpClientModule } from '@angular/common/http';
import { ButtonComponent } from '@shared/button/button.component';
import { SubscriptionPriceDiscountComponent } from '@private/features/pro/components/subscription-price-discount/subscription-price-discount.component';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { CookieModule } from 'ngx-cookie';
import { NgxPermissionsModule, NgxPermissionsService } from 'ngx-permissions';
import { CategoryService } from '@core/category/category.service';

export default {
  title: 'Webapp/Private/Features/Profile/Components/SubscriptionCard',
  component: SubscriptionCardComponent,
  argTypes: { buttonClick: { action: 'buttonClick' } },
} as Meta;

const Template: Story<SubscriptionCardComponent> = (args: SubscriptionCardComponent) => ({
  component: SubscriptionCardComponent,
  props: args,
  moduleMetadata: {
    declarations: [SubscriptionCardComponent, ButtonComponent, SubscriptionPriceDiscountComponent],
    imports: [CommonModule, SvgIconModule, HttpClientModule, CookieModule.forRoot(), NgxPermissionsModule.forRoot()],
    providers: [SubscriptionsService, CategoryService, NgxPermissionsService, { provide: APP_BASE_HREF, useValue: '/' }],
  },
  template:
    '<tsl-subscription-card [subscription]="subscription" [textButton]="textButton" [hasTrialAvailable]="hasTrialAvailable" [isSubscribed]="isSubscribed" (buttonClick)="buttonClick()"></tsl-subscription-card>',
});

const MOCK_SUBSCRIPTION = { ...SUBSCRIPTIONS[2], category_icon: 'helmet' };

export const NoSubscribedNoTrial = Template.bind({});
NoSubscribedNoTrial.args = {
  subscription: MOCK_SUBSCRIPTION,
  hasTrialAvailable: true,
  textButton: 'Trial available',
  isSubscribed: false,
};

export const NoSubscribedTrial = Template.bind({});
NoSubscribedTrial.args = {
  subscription: MOCK_SUBSCRIPTION,
  hasTrialAvailable: false,
  textButton: 'No trial available',
  isSubscribed: false,
};

export const SubscribedUntil = Template.bind({});
SubscribedUntil.args = {
  subscription: { ...MOCK_SUBSCRIPTION, subscribed_until: 1567675697 },
  hasTrialAvailable: false,
  textButton: 'Edit',
  isSubscribed: true,
};

export const SubscribedFrom = Template.bind({});
SubscribedFrom.args = {
  subscription: MOCK_SUBSCRIPTION,
  hasTrialAvailable: false,
  textButton: 'Cancel',
  isSubscribed: true,
};
