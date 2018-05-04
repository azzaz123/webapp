import { Injectable } from '@angular/core';
import { WindowRef } from '../window/window.service';
import { EventService } from '../event/event.service';

@Injectable()
export class ConnectionService {

  constructor(private winRef: WindowRef,
    private eventService: EventService) { }
    public isConnected = true;

    public checkConnection() {
      this.winRef.nativeWindow.addEventListener('offline', () => {
        this.eventService.emit(EventService.CONNECTION_ERROR);
        this.isConnected = false;
      });
      this.winRef.nativeWindow.addEventListener('online', () => {
        this.eventService.emit(EventService.CONNECTION_RESTORED);
        this.isConnected = true;
      });
    }
  }
