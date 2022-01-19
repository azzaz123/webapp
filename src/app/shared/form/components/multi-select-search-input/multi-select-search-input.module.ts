import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiselectSearchInputComponent } from './multi-select-search-input.component';
import { FormsModule } from '@angular/forms';
import { HashtagSuggesterApiService } from '@private/features/upload/core/services/hashtag-suggestions/hashtag-suggester-api.service';
import { MultiSelectFormModule } from '@shared/form/components/multi-select-form/multi-select-form.module';

@NgModule({
  exports: [MultiselectSearchInputComponent],
  declarations: [MultiselectSearchInputComponent],
  imports: [CommonModule, FormsModule, MultiSelectFormModule],
  providers: [HashtagSuggesterApiService],
})
export class MultiselectSearchInputModule {}
