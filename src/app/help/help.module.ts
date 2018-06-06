import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpRoutingModule, helpsRoutedComponents } from './help.routes';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    HelpRoutingModule
  ],
  declarations: [helpsRoutedComponents]
})
export class HelpModule { }
