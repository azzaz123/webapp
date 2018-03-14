import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SanitizedBackgroundDirective } from './sanitized-background/sanitized-background.directive';
import { StarsComponent } from './stars/stars.component';
import { MatIconModule } from '@angular/material';
import { StarsRateComponent } from './stars-rate/stars-rate.component';
import { SabadellComponent } from './sabadell/sabadell.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  exports: [
    SanitizedBackgroundDirective,
    StarsComponent,
    StarsRateComponent,
    SabadellComponent
  ],
  declarations: [
    SanitizedBackgroundDirective,
    StarsComponent,
    StarsRateComponent,
    SabadellComponent
  ]
})
export class UtilsModule {
}
