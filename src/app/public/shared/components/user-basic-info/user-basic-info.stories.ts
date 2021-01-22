import {
  MOCK_FULL_USER_FEATURED,
  MOCK_USER_STATS,
} from '@fixtures/user.fixtures.spec';
import { SIZE } from '@public/shared/constants/user-basic-info-constants';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { UserBasicInfoComponent } from './user-basic-info.component';
import { UserBasicInfoModule } from './user-basic-info.module';

export default {
  title: 'Webapp/Public/Shared/UserBasicInfo',
  component: UserBasicInfoComponent,
  decorators: [
    (storyFunc) => {
      const story = storyFunc();

      return {
        ...story,
        template: `<div style="width:500px;">${story.template}</div>`,
      };
    },
  ],
} as Meta;

const Template: Story<UserBasicInfoComponent> = (
  args: UserBasicInfoComponent
) => ({
  component: UserBasicInfoComponent,
  props: args,
  moduleMetadata: {
    imports: [UserBasicInfoModule],
  },
  template:
    '<tsl-user-basic-info [userStats]="userStats" [userInfo]="userInfo" [styleSize]="styleSize"></tsl-user-basic-info>',
});

export const Small = Template.bind({});
Small.args = {
  userStats: MOCK_USER_STATS,
  userInfo: MOCK_FULL_USER_FEATURED,
  styleSize: SIZE.SMALL,
};

export const Big = Template.bind({});
Big.args = {
  userStats: MOCK_USER_STATS,
  userInfo: MOCK_FULL_USER_FEATURED,
  styleSize: SIZE.BIG,
};
