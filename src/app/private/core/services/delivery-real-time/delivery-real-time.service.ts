import { Injectable } from '@angular/core';
import { NormalXmppMessage } from '@core/xmpp/xmpp.interface';
import { Subject, Observable } from 'rxjs';
import { DeliveryRealTimeNotification } from './delivery-real-time-notification.interface';

@Injectable({
  providedIn: 'root',
})
export class DeliveryRealTimeService {}
