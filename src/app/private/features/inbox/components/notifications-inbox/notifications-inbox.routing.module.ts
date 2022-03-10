import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { NotificationsInboxComponent } from '@private/features/inbox/components/notifications-inbox/notifications-inbox.component';

const routes: Route[] = [
  {
    path: '',
    component: NotificationsInboxComponent,
    data: {
      title: 'Notification',
    },
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationsInboxRoutingModule {}

export const notificationsInboxRoutedComponents = [NotificationsInboxComponent];
