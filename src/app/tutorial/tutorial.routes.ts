import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoggedGuard } from '../core/user/logged.guard';
import { TutorialComponent } from './tutorial.component';

const routes: Routes = [
  {
    path: '',
    component: TutorialComponent,
    canActivate: [LoggedGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TutorialRoutingModule { }

export const tutorialRoutedComponents = [
  TutorialComponent
];
