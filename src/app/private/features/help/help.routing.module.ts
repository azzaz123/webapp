import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { PERMISSIONS } from '@core/user/user-constants';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { HelpComponent } from './pages/help.component';

const routes: Route[] = [
  {
    path: '',
    component: HelpComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: PERMISSIONS.professional,
        redirectTo: '/catalog/list',
      },
      isMyZone: true,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HelpRoutingModule {}

export const helpsRoutedComponents = [HelpComponent];
