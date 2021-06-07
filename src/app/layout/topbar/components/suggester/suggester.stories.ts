import { SuggesterComponent } from '@layout/topbar/components/suggester/suggester.component';
import { Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { SuggesterService } from '@layout/topbar/core/services/suggester.service';
import { HttpClientModule } from '@angular/common/http';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';

export default {
  title: 'Webapp/Layout/TopBar/Components/Suggester',
  decorators: [
    moduleMetadata({
      imports: [HttpClientModule, SvgIconModule, NgbTypeaheadModule, RouterTestingModule],
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
