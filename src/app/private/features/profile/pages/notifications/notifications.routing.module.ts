import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ExitConfirmGuard } from '@core/guards/exit-confirm.guard';
import { NotificationsComponent } from './Notifications.component';

const routes: Route[] = [
  {
    path: '',
    component: NotificationsComponent,
    canDeactivate: [ExitConfirmGuard],
    data: {
      isMyZone: true,
      isProfile: true,
    },
    children: [],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationsRoutingModule {}

export const NotificationsRoutedComponents = [NotificationsComponent];
