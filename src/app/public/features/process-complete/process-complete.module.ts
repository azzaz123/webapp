import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { processCompleteRoutedComponents, ProcessCompleteRoutingModule } from './process-complete.routing.module';

@NgModule({
  declarations: [processCompleteRoutedComponents],
  imports: [CommonModule, ProcessCompleteRoutingModule],
})
export class ProcessCompleteModule {}
