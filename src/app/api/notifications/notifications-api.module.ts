import { NgModule } from '@angular/core';
import { NotificationsApiService } from '@api/notifications/notifications-api.service';

@NgModule({
  providers: [NotificationsApiService],
})
export class NotificationsApiModule {}
