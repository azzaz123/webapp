import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { tutorialRoutedComponents, TutorialRoutingModule } from './tutorial.routes';
import { MdIconModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    TutorialRoutingModule,
    MdIconModule
  ],
  declarations: [tutorialRoutedComponents]
})
export class TutorialModule { }
