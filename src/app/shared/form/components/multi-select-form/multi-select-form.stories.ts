import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { moduleMetadata, Story } from '@storybook/angular';
import { SelectFormOption } from '../select/interfaces/select-form-option.interface';
import { SelectFormModule } from '../select/select-form.module';
import { MultiSelectOptionModule } from './multi-select-option/multi-select-option/multi-select-option.module';

@Component({
  selector: 'tsl-story-multi-select-form',
  template: `
    <div>
      <h4>Hashtag field</h4>
      <tsl-multi-select-form formControlName="hashtagSuggestors" [options]="options"></tsl-multi-select-form>
    </div>
  `,
})
class StoryMultiSelectFormFormComponent {
  @Input() options: SelectFormOption<string>[];
}

export default {
  title: 'Webapp/Shared/Form/Components/MultiSelectForm',
  component: StoryMultiSelectFormFormComponent,
  decorators: [
    moduleMetadata({
      declarations: [StoryMultiSelectFormFormComponent],
      imports: [CommonModule, FormsModule, SelectFormModule, MultiSelectOptionModule],
    }),
  ],
};

const Template: Story<StoryMultiSelectFormFormComponent> = (args) => ({
  props: args,
  template: `
        <tsl-story-multi-select-form [options]="options"></multi-select-form>
      `,
});

export const Default = Template.bind({});
Default.args = {
  options: [
    { label: 'aa', sublabel: 1, value: 'aa' },
    { label: 'bb', sublabel: 2, value: 'bb' },
    { label: 'cc', sublabel: 1, value: 'cc' },
    { label: 'dd', sublabel: 2, value: 'dd' },
  ],
};
