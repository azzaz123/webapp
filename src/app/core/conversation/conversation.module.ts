import { ModuleWithProviders, NgModule } from '@angular/core';
import { MessageService } from '../../chat/service';
import { CommonModule } from '@angular/common';
import { ItemModule } from '../item/item.module';
import { MatIconModule } from '@angular/material';
import { NgbDropdownModule, NgbModalModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CallsService } from './calls.service';
import { CallStatusLabelPipe } from '../../shared/pipes';
import { SendPhoneComponent } from '../../chat/modals/send-phone';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        ItemModule,
        MatIconModule,
        NgbTooltipModule,
        NgbDropdownModule,
        NgbModalModule,
        ReactiveFormsModule,
        FormsModule,
        SharedModule
    ],
  declarations: [CallStatusLabelPipe, SendPhoneComponent],
  exports: [CallStatusLabelPipe, SendPhoneComponent],
  entryComponents: [SendPhoneComponent]
})
export class ConversationModule {

  static forRoot(): ModuleWithProviders<ConversationModule> {
    return {
      ngModule: ConversationModule,
      providers: [
        MessageService,
        CallsService
      ]
    };
  }
}
