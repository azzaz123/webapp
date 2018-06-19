import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpRoutingModule, helpsRoutedComponents } from './help.routes';
import { SharedModule } from '../shared/shared.module';
import { MatIconModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    HelpRoutingModule,
    MatIconModule
  ],
  declarations: [helpsRoutedComponents]
})
export class HelpModule { }
