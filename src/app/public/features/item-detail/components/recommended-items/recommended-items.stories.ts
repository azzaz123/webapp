import { Story, Meta } from '@storybook/angular/types-6-0';
import { RecommendedItemsComponent } from './recommended-items.component';
import { recommendedItems } from './constants/recommended-items.fixtures.spec';
import { ItemCardListModule } from '@public/features/public-profile/pages/user-published/components/item-card-list/item-card-list.module';
import { DeviceDetectorService } from 'ngx-device-detector';
import { CheckSessionModule } from '@public/core/directives/check-session/check-session.module';
import { HttpModule } from '@core/http/http.module';
import { CoreModule } from '@core/core.module';
import { CommonModule } from '@angular/common';
import { MapItemService } from '@public/features/public-profile/pages/user-published/services/map-item/map-item.service';
import { CUSTOM_VIEWPORT_NAME } from '@storybook-config/viewports/custom-viewports';

export default {
  title: 'Webapp/Public/Features/ItemDetail/Components/RecommendedItems',
  component: RecommendedItemsComponent,
} as Meta;

const Template: Story<RecommendedItemsComponent> = (
  args: RecommendedItemsComponent
) => ({
  component: RecommendedItemsComponent,
  props: args,
  moduleMetadata: {
    declarations: [RecommendedItemsComponent],
    imports: [
      CoreModule,
      HttpModule,
      ItemCardListModule,
      CheckSessionModule,
      CommonModule,
    ],
    providers: [DeviceDetectorService, MapItemService],
  },
  template:
    '<tsl-recommended-items [recommendedItems]="recommendedItems" showDescription="false"></tsl-recommended-items>',
});

export const Large = Template.bind({});
Large.args = {
  recommendedItems: recommendedItems,
};
Large.parameters = {
  viewport: {
    defaultViewport: CUSTOM_VIEWPORT_NAME.LG,
  },
};
export const Medium = Template.bind({});
Medium.args = {
  recommendedItems: recommendedItems,
};
Medium.parameters = {
  viewport: {
    defaultViewport: CUSTOM_VIEWPORT_NAME.MD,
  },
};
export const Small = Template.bind({});
Small.args = {
  recommendedItems: recommendedItems,
};
Small.parameters = {
  viewport: {
    defaultViewport: CUSTOM_VIEWPORT_NAME.SM,
  },
};

export const ExtraSmall = Template.bind({});
ExtraSmall.args = {
  recommendedItems: recommendedItems,
};
ExtraSmall.parameters = {
  viewport: {
    defaultViewport: CUSTOM_VIEWPORT_NAME.XS,
  },
};
