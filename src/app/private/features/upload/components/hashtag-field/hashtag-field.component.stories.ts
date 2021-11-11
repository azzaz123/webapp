import { Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HashtagSuggesterApiService } from '@private/features/upload/core/services/hashtag-suggestions/hashtag-suggester-api.service';
import { CancelBubbleModule } from '@public/shared/components/cancel-bubble/cancel-bubble.module';
import { Component, Input } from '@angular/core';
import { HashtagFieldModule } from './hashtag-field.module';
@Component({
  selector: 'tsl-story-hashtag-field',
  template: `
    CategoryId: {{ categoryId }}
    <form [formGroup]="formGroup">
      <h4 class="mt-4">Selected hashtags: {{ formGroup.value.hashtag }}</h4>
      <tsl-hashtag-field [categoryId]="categoryId" formControlName="hashtag" [max]="max"></tsl-hashtag-field>
    </form>
  `,
})
class StoryHashtagFieldComponent {
  @Input() disabled: boolean = false;
  public categoryId: string = '12465';
  public formGroup = new FormGroup({
    hashtag: new FormControl(['aa', 'ss', 'design', 'airmax']),
  });

  public options = this.formGroup.value.hashtag;
  public showErrorNessage: boolean = false;

  public showMessage(event) {
    this.showErrorNessage = event;
  }
}
export default {
  title: 'Webapp/Private/Features/Upload/Components/HashtagField',
  component: StoryHashtagFieldComponent,
  decorators: [
    moduleMetadata({
      declarations: [StoryHashtagFieldComponent],
      imports: [CommonModule, HttpClientModule, CancelBubbleModule, ReactiveFormsModule, HashtagFieldModule],
      providers: [HashtagSuggesterApiService],
    }),
  ],
};

const Template: Story<StoryHashtagFieldComponent> = (args) => ({
  props: args,
  template: `
  <tsl-story-hashtag-field [disabled]="disabled" [categoryId]="categoryId"></tsl-story-hashtag-field>
    `,
});

export const Default = Template.bind({});
Default.args = {
  disabled: false,
  max: 5,
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
  max: 5,
};
