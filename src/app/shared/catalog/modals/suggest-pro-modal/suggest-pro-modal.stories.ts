import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { SuggestProModalComponent } from './suggest-pro-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ButtonComponent } from '@shared/button/button.component';

export default {
  title: 'Webapp/Shared/Modals/SuggestPro',
  component: SuggestProModalComponent,
} as Meta;

const Template: Story<SuggestProModalComponent> = (args: SuggestProModalComponent) => ({
  component: SuggestProModalComponent,
  props: args,
  moduleMetadata: {
    declarations: [SuggestProModalComponent, ButtonComponent],
    imports: [CommonModule, SvgIconModule, HttpClientModule],
    providers: [NgbActiveModal],
  },
  template: '<tsl-suggest-pro-modal [isFreeTrial]=isFreeTrial [title]=title ></tsl-suggest-pro-modal>',
});

export const Default = Template.bind({});
Default.args = {
  isFreeTrial: false,
  title: 'If you were PRO your items wouldn’t become inactive. Sounds good, right?',
};

export const FreeTrial = Template.bind({});
FreeTrial.args = {
  isFreeTrial: true,
  title: 'If you were PRO your items wouldn’t become inactive. Sounds good, right?',
};
