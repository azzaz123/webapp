import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { InboxComponent } from './pages/Inbox.component';

const routes: Route[] = [
  {
    path: '',
    component: InboxComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      // permissions: {
      //   only: PERMISSIONS.professional,
      //   redirectTo: '/catalog/list',
      // },
      // isMyZone: true,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InboxRoutingModule {}

export const InboxRoutedComponents = [InboxComponent];
