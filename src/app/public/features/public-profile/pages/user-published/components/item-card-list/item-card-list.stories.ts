import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AccessTokenService } from '@core/http/access-token.service';
import { ItemApiService } from '@public/core/services/api/item/item-api.service';
import { CheckSessionService } from '@public/core/services/check-session/check-session.service';
import { ItemCardService } from '@public/core/services/item-card/item-card.service';
import { MOCK_ITEM_1 } from '@public/shared/components/item-card/item-card.mock.stories';
import { ItemCardModule } from '@public/shared/components/item-card/item-card.module';
import { moduleMetadata } from '@storybook/angular';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { CookieModule } from 'ngx-cookie';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ItemCardListComponent } from './item-card-list.component';
import { CUSTOM_VIEWPORT_NAME } from '@storybook-config/viewports/custom-viewports';
import { PublicPipesModule } from '@public/core/pipes/public-pipes.module';
import { EventService } from '@core/event/event.service';
import { I18nService } from '@core/i18n/i18n.service';
import { UserService } from '@core/user/user.service';
import { NgxPermissionsModule, NgxPermissionsService } from 'ngx-permissions';
import { CoreStoreModule } from '@core/store/core-store.module';

export default {
  title:
    'Webapp/Public/Features/PublicProfile/Pages/UserPublished/ItemCardList',
  component: ItemCardListComponent,
  decorators: [
    moduleMetadata({
      declarations: [ItemCardListComponent],
      imports: [
        CommonModule,
        ItemCardModule,
        HttpClientModule,
        CookieModule.forRoot(),
        PublicPipesModule,
        NgxPermissionsModule.forRoot(),
        CoreStoreModule,
      ],
      providers: [
        DeviceDetectorService,
        ItemCardService,
        CheckSessionService,
        ItemApiService,
        AccessTokenService,
        UserService,
        EventService,
        I18nService,
        NgxPermissionsService,
        { provide: 'SUBDOMAIN', useValue: 'es' },
      ],
    }),
  ],
} as Meta;

const Template: Story<ItemCardListComponent> = (
  args: ItemCardListComponent
) => ({
  component: ItemCardListComponent,
  props: args,
});

const ITEMS = [
  MOCK_ITEM_1,
  MOCK_ITEM_1,
  MOCK_ITEM_1,
  MOCK_ITEM_1,
  MOCK_ITEM_1,
  MOCK_ITEM_1,
  MOCK_ITEM_1,
];

export const Large = Template.bind({});
Large.args = {
  items: ITEMS,
};
Large.parameters = {
  viewport: {
    defaultViewport: CUSTOM_VIEWPORT_NAME.LG,
  },
};

export const Medium = Template.bind({});
Medium.args = {
  items: ITEMS,
};
Medium.parameters = {
  viewport: {
    defaultViewport: CUSTOM_VIEWPORT_NAME.MD,
  },
};

export const Small = Template.bind({});
Small.args = {
  items: ITEMS,
};
Small.parameters = {
  viewport: {
    defaultViewport: CUSTOM_VIEWPORT_NAME.SM,
  },
};

export const ExtraSmall = Template.bind({});
ExtraSmall.args = {
  items: ITEMS,
};
ExtraSmall.parameters = {
  viewport: {
    defaultViewport: CUSTOM_VIEWPORT_NAME.XS,
  },
};
