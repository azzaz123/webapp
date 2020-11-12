import { TestBed } from '@angular/core/testing';
import { ConnectionService } from './connection.service';
import { EventService } from '../event/event.service';

let service: ConnectionService;
let eventService: EventService;

describe('ConnectionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConnectionService, EventService],
    });
    service = TestBed.inject(ConnectionService);
    eventService = TestBed.inject(EventService);
  });

  describe('checkConnection', () => {
    it('should create an instance', () => {
      expect(service).toBeTruthy();
    });
  });
});
