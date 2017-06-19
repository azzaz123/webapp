import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { AlreadyLoggedGuard } from "./alreadyLogged.guard";

const routes: Routes = [
    {path: 'login', component: LoginComponent, canActivate: [AlreadyLoggedGuard]},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LoginRoutingModule {
}

export const loginRoutedComponents = [LoginComponent];
