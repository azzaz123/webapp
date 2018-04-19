import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CallsComponent } from './calls.component';
import { LoggedGuard } from '../core/user/logged.guard';

const routes: Routes = [
  {
    path: 'calls',
    component: CallsComponent,
    canActivate: [LoggedGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CallsRoutingModule {
}

export const callsRoutedComponents = [CallsComponent];
