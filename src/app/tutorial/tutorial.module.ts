import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { tutorialRoutedComponents, TutorialRoutingModule } from './tutorial.routes';
import { MatIconModule } from '@angular/material';
import { TrackingModule } from '../core/tracking/tracking.module';

@NgModule({
  imports: [
    CommonModule,
    TutorialRoutingModule,
    MatIconModule,
    TrackingModule
  ],
  declarations: [tutorialRoutedComponents]
})
export class TutorialModule { }
