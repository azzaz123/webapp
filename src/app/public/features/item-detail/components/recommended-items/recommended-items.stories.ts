import { CommonModule } from '@angular/common';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { RecommendedItemsComponent } from './recommended-items.component';
import { recommendedItems } from './constants/recommended-items.fixtures.spec';
import { ItemCardListModule } from '@public/features/public-profile/pages/user-published/components/item-card-list/item-card-list.module';
import { DeviceDetectorService } from 'ngx-device-detector';
import { CheckSessionModule } from '@public/core/directives/check-session/check-session.module';
import { HttpModule } from '@core/http/http.module';
import { CoreModule } from '@core/core.module';

export default {
  title: 'Webapp/Public/Features/ItemDetail/Components/RecommendedItems',
  component: RecommendedItemsComponent,
  decorators: [
    (storyFunc) => {
      const story = storyFunc();

      return {
        ...story,
        template: `<div style="max-width: 600px;">${story.template}</div>`,
      };
    },
  ],
} as Meta;

const Template: Story<RecommendedItemsComponent> = (
  args: RecommendedItemsComponent
) => ({
  component: RecommendedItemsComponent,
  props: args,
  moduleMetadata: {
    declarations: [RecommendedItemsComponent],
    imports: [CoreModule, HttpModule, ItemCardListModule, CheckSessionModule],
    providers: [DeviceDetectorService],
  },
  template:
    '<tsl-recommended-items [recommendedItems]="recommendedItems" showDescription="false"></tsl-recommended-items>',
});

export const Default = Template.bind({});
Default.args = {
  recommendedItems: recommendedItems,
};
