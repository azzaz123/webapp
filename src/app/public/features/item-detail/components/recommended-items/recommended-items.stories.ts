import { Story, Meta } from '@storybook/angular/types-6-0';
import { RecommendedItemsComponent } from './recommended-items.component';
import { RECOMMENDED_ITEMS_MOCK } from './constants/recommended-items.fixtures.spec';
import { ItemCardListModule } from '@public/shared/components/item-card-list/item-card-list.module';
import { DeviceDetectorService } from 'ngx-device-detector';
import { CheckSessionModule } from '@public/core/directives/check-session/check-session.module';
import { HttpModule } from '@core/http/http.module';
import { CoreModule } from '@core/core.module';
import { CommonModule } from '@angular/common';
import { CUSTOM_VIEWPORT_NAME } from '@storybook-config/viewports/custom-viewports';
import { RouterTestingModule } from '@angular/router/testing';
import { MapRecommendedItemCardService } from '../../core/services/map-recommended-item-card/map-recommended-item-card.service';
import { ItemDetailTrackEventsService } from '@public/features/item-detail/core/services/item-detail-track-events/item-detail-track-events.service';

export default {
  title: 'Webapp/Public/Features/ItemDetail/Components/RecommendedItems',
  component: RecommendedItemsComponent,
} as Meta;

const Template: Story<RecommendedItemsComponent> = (args: RecommendedItemsComponent) => ({
  component: RecommendedItemsComponent,
  props: args,
  moduleMetadata: {
    declarations: [RecommendedItemsComponent],
    imports: [CoreModule, HttpModule, ItemCardListModule, CheckSessionModule, CommonModule, RouterTestingModule],
    providers: [DeviceDetectorService, MapRecommendedItemCardService, ItemDetailTrackEventsService],
  },
  template: '<tsl-recommended-items [recommendedItems]="recommendedItems" showDescription="false"></tsl-recommended-items>',
});

export const Large = Template.bind({});
Large.args = {
  recommendedItems: RECOMMENDED_ITEMS_MOCK,
};
Large.parameters = {
  viewport: {
    defaultViewport: CUSTOM_VIEWPORT_NAME.LG,
  },
};
export const Medium = Template.bind({});
Medium.args = {
  recommendedItems: RECOMMENDED_ITEMS_MOCK,
};
Medium.parameters = {
  viewport: {
    defaultViewport: CUSTOM_VIEWPORT_NAME.MD,
  },
};
export const Small = Template.bind({});
Small.args = {
  recommendedItems: RECOMMENDED_ITEMS_MOCK,
};
Small.parameters = {
  viewport: {
    defaultViewport: CUSTOM_VIEWPORT_NAME.SM,
  },
};

export const ExtraSmall = Template.bind({});
ExtraSmall.args = {
  recommendedItems: RECOMMENDED_ITEMS_MOCK,
};
ExtraSmall.parameters = {
  viewport: {
    defaultViewport: CUSTOM_VIEWPORT_NAME.XS,
  },
};
