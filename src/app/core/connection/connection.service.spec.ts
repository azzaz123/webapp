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


   describe('checkConnection', () => {
    it('should set connected to false when a CONNECTION_ERROR event is detected', fakeAsync(() => {
      service['connected'] = true;

      service.checkConnection();
      eventService.emit(EventService.CONNECTION_ERROR);
      tick(1000);

      expect(service['connected']).toBe(false);
      discardPeriodicTasks();
    }));

    it('should set connected to true when a CONNECTION_RESTORED event is detected', fakeAsync(() => {
      service['connected'] = false;

      service.checkConnection();
      eventService.emit(EventService.CONNECTION_RESTORED);
      tick(1000);

      expect(service['connected']).toBe(true);
      discardPeriodicTasks();
    }));
  });
});
