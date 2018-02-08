import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoggedGuard } from '../core/user/logged.guard';
import { ProfileComponent } from './profile.component';
import { ExitConfirmGuard } from '../shared/guards/exit-confirm.guard';

const routes: Routes = [
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [LoggedGuard],
    canDeactivate: [ExitConfirmGuard],
    data: {
      isMyZone: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule {
}

export const profileRoutedComponents = [ProfileComponent];
