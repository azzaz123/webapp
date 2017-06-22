import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoggedGuard } from './login/logged.guard';
import { AppComponent } from './app.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', component: AppComponent, canActivate: [LoggedGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
