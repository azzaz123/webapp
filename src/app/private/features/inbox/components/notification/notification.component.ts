import { Component, Input } from '@angular/core';
import { Notification } from '../../core/interfaces/notification.interface';

@Component({
  selector: 'tsl-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent {
  @Input() notification: Notification;
}
