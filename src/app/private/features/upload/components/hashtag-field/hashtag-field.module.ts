import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HashtagSuggesterApiService } from '@private/features/upload/core/services/hashtag-suggestions/hashtag-suggester-api.service';
import { MultiselectSearchInputModule } from '@shared/form/components/multi-select-search-input/multi-select-search-input.module';
import { HashtagFieldComponent } from './hashtag-field.component';
import { MultiSelectFormModule } from '@shared/form/components/multi-select-form/multi-select-form.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CancelBubbleModule } from '@public/shared/components/cancel-bubble/cancel-bubble.module';
import { ScrollModule } from '@shared/scroll/scroll.module';

@NgModule({
  exports: [HashtagFieldComponent],
  declarations: [HashtagFieldComponent],
  imports: [CommonModule, ReactiveFormsModule, MultiSelectFormModule, MultiselectSearchInputModule, CancelBubbleModule, ScrollModule],
  providers: [HashtagSuggesterApiService],
})
export class HashtagFieldModule {}
