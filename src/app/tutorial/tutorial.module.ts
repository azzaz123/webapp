import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { tutorialRoutedComponents, TutorialRoutingModule } from './tutorial.routes';
import { MatIconModule } from '@angular/material';
import { TrackingModule } from '../core/tracking/tracking.module';
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
  imports: [
    CommonModule,
    TutorialRoutingModule,
    MatIconModule,
    TrackingModule,
    NgxPermissionsModule
  ],
  declarations: [tutorialRoutedComponents]
})
export class TutorialModule { }
