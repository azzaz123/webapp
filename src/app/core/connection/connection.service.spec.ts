import { TestBed } from '@angular/core/testing';
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
    it('should create an instance', () => {
      expect(service).toBeTruthy();
    });
  });
});
