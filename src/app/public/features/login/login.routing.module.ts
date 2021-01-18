import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';

import { LoginComponent } from './pages/login.component';

const routes: Route[] = [{ path: '', component: LoginComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginRoutingModule {}

export const loginRoutedComponents = [LoginComponent];
