import { Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { SuggesterInputComponent } from './suggester-input.component';
import { CommonModule } from '@angular/common';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { SelectFormModule } from '@shared/form/components/select/select-form.module';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HashtagSuggesterApiService } from '@private/features/upload/core/services/hashtag-suggestions/hashtag-suggester-api.service';
import { MultiSelectFormModule } from '@shared/form/components/multi-select-form/multi-select-form.module';
import { CancelBubbleModule } from '@public/shared/components/cancel-bubble/cancel-bubble.module';
import { AfterViewInit, Component } from '@angular/core';
import { SuggesterInputModule } from './suggester-input.module';
@Component({
  selector: 'tsl-story-suggester-input',
  template: `
    <form [formGroup]="formGroup">
      <h4 class="mt-4">Dynamic input: {{ formGroup.value.hashtag }}</h4>
      <div *ngFor="let option of formGroup.value.hashtag">
        <tsl-cancel-bubble [bubbleText]="option"></tsl-cancel-bubble>
      </div>
      dynamic input
      <tsl-suggester-input formControlName="hashtag"></tsl-suggester-input>
    </form>
  `,
})
class StorySuggesterInputFormComponent {
  public formGroup = new FormGroup({
    hashtag: new FormControl(['aa', 'ss', 'design']),
  });
  public options = this.formGroup.value.hashtag;
}
export default {
  title: 'Webapp/Shared/SuggesterInput',
  component: StorySuggesterInputFormComponent,
  decorators: [
    moduleMetadata({
      declarations: [StorySuggesterInputFormComponent],
      imports: [
        CommonModule,
        NgbTypeaheadModule,
        HttpClientModule,
        ReactiveFormsModule,
        SelectFormModule,
        FormsModule,
        MultiSelectFormModule,
        CancelBubbleModule,
        SuggesterInputModule,
      ],
      providers: [HashtagSuggesterApiService],
    }),
  ],
};

const Template: Story<StorySuggesterInputFormComponent> = (args) => ({
  props: args,
  template: `
  <tsl-story-suggester-input></tsl-story-suggester-input>
    `,
});

export const Default = Template.bind({});
Default.args = {};
