import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HashtagSuggesterApiService } from '@private/features/upload/core/services/hashtag-suggestions/hashtag-suggester-api.service';
import { MultiselectSearchInputModule } from '@shared/form/components/multiselect-search-input/multiselect-search-input.module';
import { HashtagFieldComponent } from './hashtag-field.component';
import { MultiSelectFormModule } from '@shared/form/components/multi-select-form/multi-select-form.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  exports: [HashtagFieldComponent],
  declarations: [HashtagFieldComponent],
  imports: [CommonModule, ReactiveFormsModule, MultiSelectFormModule, MultiselectSearchInputModule],
  providers: [HashtagSuggesterApiService],
})
export class HashtagFieldModule {}
