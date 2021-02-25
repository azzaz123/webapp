import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SendPhoneComponent } from '@private/features/chat/modals';
import { NgbDropdownModule, NgbModalModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CallStatusLabelPipe } from '../../shared/pipes';
import { SharedModule } from '../../shared/shared.module';
import { CallsService } from './calls.service';

@NgModule({
  imports: [CommonModule, NgbTooltipModule, NgbDropdownModule, NgbModalModule, ReactiveFormsModule, FormsModule, SharedModule],
  declarations: [CallStatusLabelPipe, SendPhoneComponent],
  exports: [CallStatusLabelPipe, SendPhoneComponent],
  entryComponents: [SendPhoneComponent],
})
export class ConversationModule {
  static forRoot(): ModuleWithProviders<ConversationModule> {
    return {
      ngModule: ConversationModule,
      providers: [CallsService],
    };
  }
}
