import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { NotificationsInboxComponent } from './components/notifications-inbox/notifications-inbox.component';
import { InboxPageComponent } from './pages/inbox-page.component';

const routes: Route[] = [
  {
    path: '',
    component: InboxPageComponent,
    canActivate: [NgxPermissionsGuard],
    children: [
      // TODO: Refactor in next tasks of NC
      // {
      //   path: 'messages',
      //   loadChildren: () => null,
      // },
      {
        path: 'notifications',
        component: NotificationsInboxComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InboxPageRoutingModule {}

export const InboxPageRoutedComponents = [InboxPageComponent];
