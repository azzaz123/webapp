import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdComponent } from './ad.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    AdComponent
  ],
  declarations: [AdComponent]
})
export class AdModule { }
