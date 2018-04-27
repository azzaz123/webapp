import { Injectable } from '@angular/core';
import { WindowRef } from '../window/window.service';
import { EventService } from '../event/event.service';

@Injectable()
export class ConnectionService {

  constructor(private winRef: WindowRef,
    private eventService: EventService) { }
    private reconnectInterval: any;
    private event: EventService;
    public connected = true;

    public checkConnection() {
      this.winRef.nativeWindow.addEventListener('offline', () => {
        this.eventService.emit(EventService.CONNECTION_ERROR);
      });
      this.winRef.nativeWindow.addEventListener('online', () => {
        this.eventService.emit(EventService.CONNECTION_RESTORED);
      });
    }

    public tryToReconnect() {
      if (!this.reconnectInterval) {
        this.reconnectInterval = setInterval(() => {
          if (this.connected) {
            this.eventService.emit(EventService.CONNECTION_RESTORED);
            clearInterval(this.reconnectInterval);
          } else {
            this.eventService.emit(EventService.CONNECTION_ERROR);
          }
        }, 1000);
      }
    }
  }

