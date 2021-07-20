import { Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { SuggesterInputComponent } from './suggester-input.component';
import { CommonModule } from '@angular/common';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { SelectFormModule } from '@shared/form/components/select/select-form.module';
import { FormsModule } from '@angular/forms';
import { HashtagSuggesterApiService } from '@private/features/upload/core/services/hashtag-suggestions/hashtag-suggester-api.service';
import { MultiSelectFormModule } from '@shared/form/components/multi-select-form/multi-select-form.module';

export default {
  title: 'Webapp/Shared/SuggesterInput',
  component: SuggesterInputComponent,
  decorators: [
    moduleMetadata({
      declarations: [SuggesterInputComponent],
      imports: [CommonModule, NgbTypeaheadModule, HttpClientModule, SelectFormModule, FormsModule, MultiSelectFormModule],
      providers: [HashtagSuggesterApiService],
    }),
  ],
};

const Template: Story<SuggesterInputComponent> = (args) => ({
  props: args,
  template: `
      <tsl-suggester-input></tsl-suggester-input>
    `,
});

export const Default = Template.bind({});
Default.args = {};
