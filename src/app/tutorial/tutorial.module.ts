import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { tutorialRoutedComponents, TutorialRoutingModule } from './tutorial.routes';
import { MdIconModule } from '@angular/material';
import { TrackingModule } from '../core/tracking/tracking.module';

@NgModule({
  imports: [
    CommonModule,
    TutorialRoutingModule,
    MdIconModule,
    TrackingModule
  ],
  declarations: [tutorialRoutedComponents]
})
export class TutorialModule { }
