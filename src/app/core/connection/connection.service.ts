import { Injectable } from '@angular/core';
import { WindowRef } from '../window/window.service';
import { EventService } from '../event/event.service';

@Injectable()
export class ConnectionService {

  constructor(private winRef: WindowRef,
    private eventService: EventService) { }
    private reconnectInterval: any;
    private event: EventService;
    private connected = true;

    public checkConnection() {
      this.handleConnectionChanges();

      this.winRef.nativeWindow.addEventListener('offline', () => {
        this.eventService.emit(EventService.CONNECTION_ERROR);
      });
      this.winRef.nativeWindow.addEventListener('online', () => {
        this.eventService.emit(EventService.CONNECTION_RESTORED);
      });
    }

    private handleConnectionChanges() {
      this.eventService.subscribe(EventService.CONNECTION_ERROR, () => {
        this.connected = false;
        this.tryToReconnect();
      });

      this.eventService.subscribe(EventService.CONNECTION_RESTORED, () => {
        this.connected = true;
      });
    }

    private tryToReconnect() {
      if (!this.reconnectInterval) {
        this.reconnectInterval = setInterval(() => {
          if (this.connected) {
            clearInterval(this.reconnectInterval);
          }
        }, 1000);
      }
    }
  }

