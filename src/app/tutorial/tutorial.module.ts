import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { tutorialRoutedComponents, TutorialRoutingModule } from './tutorial.routes';

@NgModule({
  imports: [
    CommonModule,
    TutorialRoutingModule
  ],
  declarations: [tutorialRoutedComponents]
})
export class TutorialModule { }
