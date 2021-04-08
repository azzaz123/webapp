import { Story, Meta } from '@storybook/angular/types-6-0';
import { styledWrapperDecorator } from '@stories/decorators/styled-wrapper/styled-wrapper.decorator';
import { ReactivateItemModalComponent } from './reactivate-item-modal.component';
import { HttpClientModule } from '@angular/common/http';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

export default {
  title: 'Webapp/Private/Features/ReactivateItem/Components/ReactivateItemModal',
  component: ReactivateItemModalComponent,
  decorators: [styledWrapperDecorator('max-width: 220px;')],
} as Meta;

const Template: Story<ReactivateItemModalComponent> = (args: ReactivateItemModalComponent) => ({
  component: ReactivateItemModalComponent,
  props: args,
  moduleMetadata: {
    declarations: [ReactivateItemModalComponent],
    imports: [HttpClientModule, SvgIconModule],
    providers: [NgbActiveModal],
  },
  template: '<tsl-reactivate-item-modal></tsl-reactivate-item-modal>',
});

export const Default = Template.bind({});
Default.args = {};
