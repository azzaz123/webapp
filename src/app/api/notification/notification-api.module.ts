import { NgModule } from '@angular/core';
import { NotificationApiService } from '@api/notification/notification-api.service';

@NgModule({
  providers: [NotificationApiService],
})
export class NotificationApiModule {}
