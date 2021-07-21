import { Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { SuggesterInputComponent } from './suggester-input.component';
import { CommonModule } from '@angular/common';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { SelectFormModule } from '@shared/form/components/select/select-form.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HashtagSuggesterApiService } from '@private/features/upload/core/services/hashtag-suggestions/hashtag-suggester-api.service';
import { MultiSelectFormModule } from '@shared/form/components/multi-select-form/multi-select-form.module';

export default {
  title: 'Webapp/Shared/SuggesterInput',
  component: SuggesterInputComponent,
  decorators: [
    moduleMetadata({
      declarations: [SuggesterInputComponent],
      imports: [
        CommonModule,
        NgbTypeaheadModule,
        HttpClientModule,
        ReactiveFormsModule,
        SelectFormModule,
        FormsModule,
        MultiSelectFormModule,
      ],
      providers: [HashtagSuggesterApiService],
    }),
  ],
};

const Template: Story<SuggesterInputComponent> = (args) => ({
  props: args,
  template: `
  <div>
    dynamic input
    <div *ngFor="let option of options"><tsl-cancel-bubble [bubbleText]="option" (clear)="clear($event)"></tsl-cancel-bubble></div>
  <tsl-suggester-input [form]="uploadForm" name="hashtag" (onChangeHashtag)="onChangeHashtag($event)"></tsl-suggester-input>
</div>
      
    `,
});

export const Default = Template.bind({});
Default.args = {};
