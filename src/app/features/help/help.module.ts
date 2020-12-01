import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  HelpRoutingModule,
  helpsRoutedComponents,
} from './help.routing.module';
import { HelpService } from './core/services/help.service';

@NgModule({
  imports: [CommonModule, SharedModule, HelpRoutingModule],
  providers: [HelpService],
  declarations: [helpsRoutedComponents],
})
export class HelpModule {}
