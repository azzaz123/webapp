import { ModuleWithProviders, NgModule } from '@angular/core';
import { MessageService } from '../message/message.service';
import { ConversationService } from './conversation.service';
import { CommonModule } from '@angular/common';
import { ItemModule } from '../item/item.module';
import { MomentModule } from 'angular2-moment';
import { MatIconModule } from '@angular/material';
import { NgbDropdownModule, NgbModalModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CallsService } from './calls.service';
import { CallStatusLabelPipe } from './call-status-label.pipe';

@NgModule({
  imports: [
    CommonModule,
    ItemModule,
    MomentModule,
    MatIconModule,
    NgbTooltipModule,
    NgbDropdownModule,
    NgbModalModule,
  ],
  declarations: [CallStatusLabelPipe],
  exports: [CallStatusLabelPipe]
})
export class ConversationModule {


  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ConversationModule,
      providers: [
        ConversationService,
        MessageService,
        CallsService
      ]
    };
  }
}
