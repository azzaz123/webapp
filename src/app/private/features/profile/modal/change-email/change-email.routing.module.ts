import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ChangeEmailComponent } from './change-email.component';

const routes: Route[] = [
  {
    path: '',
    component: ChangeEmailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChangeEmailRoutingModule {}

export const ChangeEmailRoutedComponents = [ChangeEmailComponent];
