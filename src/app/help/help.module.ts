import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpRoutingModule, helpsRoutedComponents } from './help.routes';
import { SharedModule } from '../shared/shared.module';
import { MatIconModule } from '@angular/material';
import { HelpService } from './help.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    HelpRoutingModule,
    MatIconModule
  ],
  providers: [HelpService],
  declarations: [helpsRoutedComponents]
})
export class HelpModule { }
