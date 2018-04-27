import { TestBed, inject, fakeAsync, tick, discardPeriodicTasks } from '@angular/core/testing';
import { ConnectionService } from './connection.service';
import { WindowRef } from '../window/window.service';
import { EventService } from '../event/event.service';

let service: ConnectionService;
let winRef: WindowRef;
let eventService: EventService;

describe('ConnectionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ ConnectionService, WindowRef, EventService ]
    });
    service = TestBed.get(ConnectionService);
    winRef = TestBed.get(WindowRef);
    eventService = TestBed.get(EventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('tryToReconnect', () => {
    it('should emit a CONNECTION_RESTORED event when connected is true', fakeAsync(() => {
      spyOn(eventService, 'emit');
      service['reconnectInterval'] = null;
      service.connected = true;

      service.tryToReconnect();
      tick(1000);

      expect(eventService.emit).toHaveBeenCalledWith(EventService.CONNECTION_RESTORED);
      discardPeriodicTasks();
    }));

    it('should emit a CONNECTION_ERROR event when connected is false', fakeAsync(() => {
      spyOn(eventService, 'emit');
      service['reconnectInterval'] = null;
      service.connected = false;

      service.tryToReconnect();
      tick(1000);

      expect(eventService.emit).toHaveBeenCalledWith(EventService.CONNECTION_ERROR);
      discardPeriodicTasks();
    }));
  });
});
