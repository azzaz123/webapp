import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { NotificationsInboxComponent } from './components/notifications/notifications-inbox.component';
import { InboxComponent } from './pages/Inbox.component';

const routes: Route[] = [
  {
    path: '',
    component: InboxComponent,
    canActivate: [NgxPermissionsGuard],
    children: [
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
export class InboxRoutingModule {}

export const InboxRoutedComponents = [InboxComponent];
