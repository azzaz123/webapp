import { APP_BASE_HREF, CommonModule } from '@angular/common';
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
import { RouterTestingModule } from '@angular/router/testing';
import { ShowSlotPipe } from './pipes/show-slot.pipe';

export default {
  title: 'Webapp/Public/Shared/Components/ItemCardList',
  component: ItemCardListComponent,
  decorators: [
    moduleMetadata({
      declarations: [ItemCardListComponent, ShowSlotPipe],
      imports: [
        CommonModule,
        ItemCardModule,
        HttpClientModule,
        CookieModule.forRoot(),
        PublicPipesModule,
        NgxPermissionsModule.forRoot(),
        RouterTestingModule,
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
        { provide: APP_BASE_HREF, useValue: '/' },
      ],
    }),
  ],
} as Meta;

const Template: Story<ItemCardListComponent> = (args: ItemCardListComponent) => ({
  component: ItemCardListComponent,
  props: args,
});

const ITEMS = [MOCK_ITEM_1, MOCK_ITEM_1, MOCK_ITEM_1, MOCK_ITEM_1, MOCK_ITEM_1, MOCK_ITEM_1, MOCK_ITEM_1];

export const ExtraLarge = Template.bind({});
ExtraLarge.args = {
  items: ITEMS,
};
ExtraLarge.parameters = {
  viewport: {
    defaultViewport: CUSTOM_VIEWPORT_NAME.XL,
  },
};

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

export const ColumnsConfig = Template.bind({});
ColumnsConfig.args = {
  items: ITEMS,
  columnsConfig: {
    xl: 5,
    lg: 4,
    md: 3,
    sm: 2,
    xs: 2,
  },
};

export const SlotsConfig = Template.bind({});
SlotsConfig.args = {
  items: ITEMS,
  slotsConfig: {
    start: 3,
    offset: 3,
  },
};
