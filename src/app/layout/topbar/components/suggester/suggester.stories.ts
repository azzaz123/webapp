import { SuggesterComponent } from '@layout/topbar/components/suggester/suggester.component';
import { Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { SuggesterService } from '@layout/topbar/core/services/suggester.service';
import { HttpClientModule } from '@angular/common/http';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

export default {
  title: 'Webapp/Layout/TopBar/Components/Suggester',
  decorators: [
    moduleMetadata({
      imports: [HttpClientModule, SvgIconModule, NgbTypeaheadModule],
      providers: [SuggesterService],
      declarations: [SuggesterComponent],
    }),
  ],
};

const Template: Story<SuggesterComponent> = (args) => ({
  props: args,
  component: SuggesterComponent,
});

export const Default = Template.bind({});
