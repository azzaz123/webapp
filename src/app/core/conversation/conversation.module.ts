import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from '@features/chat/core/message/message.service';
import { SendPhoneComponent } from '@features/chat/modals';
import {
  NgbDropdownModule,
  NgbModalModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { CallStatusLabelPipe } from '../../shared/pipes';
import { SharedModule } from '../../shared/shared.module';
import { ItemModule } from '../item/item.module';
import { CallsService } from './calls.service';

@NgModule({
  imports: [
    CommonModule,
    ItemModule,
    NgbTooltipModule,
    NgbDropdownModule,
    NgbModalModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
  ],
  declarations: [CallStatusLabelPipe, SendPhoneComponent],
  exports: [CallStatusLabelPipe, SendPhoneComponent],
  entryComponents: [SendPhoneComponent],
})
export class ConversationModule {
  static forRoot(): ModuleWithProviders<ConversationModule> {
    return {
      ngModule: ConversationModule,
      providers: [MessageService, CallsService],
    };
  }
}
