import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbButtonsModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '@shared/shared.module';
import { NotificationsRoutedComponents, NotificationsRoutingModule } from './notifications.routing.module';

@NgModule({
  imports: [SharedModule, FormsModule, ReactiveFormsModule, NgbButtonsModule, NotificationsRoutingModule],
  declarations: [NotificationsRoutedComponents],
})
export class NotificationsModule {}
