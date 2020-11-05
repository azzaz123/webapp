import { Injectable } from '@angular/core';
import { EventService } from '../event/event.service';

@Injectable()
export class ConnectionService {
  public isConnected = true;

  constructor(private eventService: EventService) {}

  public checkConnection() {
    window.addEventListener('offline', () => {
      this.isConnected = false;
      this.eventService.emit(EventService.CONNECTION_ERROR);
    });
    window.addEventListener('online', () => {
      this.isConnected = true;
      this.eventService.emit(EventService.CONNECTION_RESTORED);
    });
  }
}
