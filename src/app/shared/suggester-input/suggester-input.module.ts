import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuggesterInputComponent } from './suggester-input.component';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { SelectFormModule } from '@shared/form/components/select/select-form.module';
import { FormsModule } from '@angular/forms';
import { HashtagSuggesterApiService } from '@private/features/upload/core/services/hashtag-suggestions/hashtag-suggester-api.service';

@NgModule({
  exports: [SuggesterInputComponent],
  declarations: [SuggesterInputComponent],
  imports: [CommonModule, NgbTypeaheadModule, SelectFormModule, FormsModule],
  providers: [HashtagSuggesterApiService],
})
export class SuggesterInputModule {}
