import { Injectable } from '@angular/core';
import { WindowRef } from '../window/window.service';
import { EventService } from '../event/event.service';

@Injectable()
export class ConnectionService {

  public isConnected = true;

  constructor(private winRef: WindowRef,
    private eventService: EventService) { }

    public checkConnection() {
      this.winRef.nativeWindow.addEventListener('offline', () => {
        this.isConnected = false;
        this.eventService.emit(EventService.CONNECTION_ERROR);
      });
      this.winRef.nativeWindow.addEventListener('online', () => {
        this.isConnected = true;
        this.eventService.emit(EventService.CONNECTION_RESTORED);
      });
    }
  }
