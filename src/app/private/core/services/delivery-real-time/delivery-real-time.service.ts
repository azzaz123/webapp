import { Injectable } from '@angular/core';
import { NormalXmppMessage } from '@core/xmpp/xmpp.interface';
import { Subject, Observable } from 'rxjs';
import { DeliveryRealTimeNotification } from './delivery-real-time-notification.interface';

@Injectable()
export class DeliveryRealTimeService {
  private _deliveryRealTimeNotifications$: Subject<DeliveryRealTimeNotification> = new Subject<DeliveryRealTimeNotification>();

  public get deliveryRealTimeNotifications$(): Observable<DeliveryRealTimeNotification> {
    return this._deliveryRealTimeNotifications$.asObservable();
  }

  public check(newMessage: NormalXmppMessage): void {
    const skipMessage: boolean = !this.isPayloadInMessage(newMessage) || !this.isDeliveryMessage(newMessage);
    if (skipMessage) {
      return;
    }

    const notification: DeliveryRealTimeNotification = this.getNotificationFromPayload(newMessage.payload);
    this._deliveryRealTimeNotifications$.next(notification);
  }

  private isDeliveryMessage(message: NormalXmppMessage): boolean {
    return message.payload?.type.startsWith('delivery');
  }

  private isPayloadInMessage(message: NormalXmppMessage): boolean {
    const { payload } = message;
    return !!payload;
  }

  private getNotificationFromPayload(realtimePayload: NormalXmppMessage['payload']): DeliveryRealTimeNotification {
    const { type: id } = realtimePayload;
    if (!realtimePayload.payload) {
      return { id };
    }

    return {
      id,
      payload: { ...realtimePayload.payload },
    };
  }
}
