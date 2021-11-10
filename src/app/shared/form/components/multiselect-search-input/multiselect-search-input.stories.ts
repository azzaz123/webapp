import { Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HashtagSuggesterApiService } from '@private/features/upload/core/services/hashtag-suggestions/hashtag-suggester-api.service';
import { MultiSelectFormModule } from '@shared/form/components/multi-select-form/multi-select-form.module';
import { CancelBubbleModule } from '@public/shared/components/cancel-bubble/cancel-bubble.module';
import { Component, Input } from '@angular/core';
import { MultiselectSearchInputModule } from './multiselect-search-input.module';
@Component({
  selector: 'tsl-story-multiselect-search-input',
  template: `
    <form [formGroup]="formGroup">
      <h4 class="mt-4">Selected hashtags: {{ formGroup.value.hashtag }}</h4>
      Get your hashtags:
      <tsl-multiselect-search-input
        formControlName="hashtag"
        [disabled]="disabled"
        [categoryId]="categoryId"
        (changeValidStatus)="showMessage($event)"
      ></tsl-multiselect-search-input>
    </form>
    <div *ngIf="showErrorNessage">Our hashtags are good with anything except special characters and spaces of course</div>
  `,
})
class StoryMultiselectSearchInputComponent {
  @Input() disabled: boolean = false;
  @Input() categoryId: string = '1000';
  public formGroup = new FormGroup({
    hashtag: new FormControl(['#aa', '#ss', '#design']),
  });

  public options = this.formGroup.value.hashtag;
  public showErrorNessage: boolean = false;

  public showMessage(event) {
    this.showErrorNessage = event;
  }
}
export default {
  title: 'Webapp/Shared/Form/Components/MultiselectSearchInput',
  component: StoryMultiselectSearchInputComponent,
  decorators: [
    moduleMetadata({
      declarations: [StoryMultiselectSearchInputComponent],
      imports: [
        CommonModule,
        HttpClientModule,
        MultiSelectFormModule,
        CancelBubbleModule,
        ReactiveFormsModule,
        MultiselectSearchInputModule,
      ],
      providers: [HashtagSuggesterApiService],
    }),
  ],
};

const Template: Story<StoryMultiselectSearchInputComponent> = (args) => ({
  props: args,
  template: `
  <tsl-story-multiselect-search-input [disabled]="disabled" [categoryId]="categoryId"></tsl-story-multiselect-search-input>
    `,
});

export const Default = Template.bind({});
Default.args = {
  disabled: false,
  categoryId: '1000',
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
  categoryId: '1000',
};
