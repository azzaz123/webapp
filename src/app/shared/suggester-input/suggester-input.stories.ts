import { Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HashtagSuggesterApiService } from '@private/features/upload/core/services/hashtag-suggestions/hashtag-suggester-api.service';
import { MultiSelectFormModule } from '@shared/form/components/multi-select-form/multi-select-form.module';
import { CancelBubbleModule } from '@public/shared/components/cancel-bubble/cancel-bubble.module';
import { Component, Input } from '@angular/core';
import { SuggesterInputModule } from './suggester-input.module';
@Component({
  selector: 'tsl-story-suggester-input',
  template: `
    <form [formGroup]="formGroup">
      <h4 class="mt-4">Dynamic input: {{ formGroup.value.hashtag }}</h4>
      <div *ngFor="let option of formGroup.value.hashtag" style="margin:35px">
        <tsl-cancel-bubble [bubbleText]="option"></tsl-cancel-bubble>
      </div>
      dynamic input
      <tsl-suggester-input
        formControlName="hashtag"
        [disabled]="disabled"
        [categoryId]="categoryId"
        (showInvalidMessage)="showMessage($event)"
      ></tsl-suggester-input>
    </form>
    <div *ngIf="showErrorNessage">
      <div i18n="@@web_upload_hashtag_invalid_error_message">
        Our hashtags are good with anything except special characters and spaces of course.
      </div>
    </div>
  `,
})
class StorySuggesterInputFormComponent {
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
  title: 'Webapp/Shared/SuggesterInput',
  component: StorySuggesterInputFormComponent,
  decorators: [
    moduleMetadata({
      declarations: [StorySuggesterInputFormComponent],
      imports: [CommonModule, HttpClientModule, MultiSelectFormModule, CancelBubbleModule, ReactiveFormsModule, SuggesterInputModule],
      providers: [HashtagSuggesterApiService],
    }),
  ],
};

const Template: Story<StorySuggesterInputFormComponent> = (args) => ({
  props: args,
  template: `
  <tsl-story-suggester-input [disabled]="disabled" [categoryId]="categoryId"></tsl-story-suggester-input>
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
