import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventService } from '@core/event/event.service';
import { ConnectionAlertComponent } from './connection-alert.component';

describe('Component: ConnectionAlert', () => {
  let component: ConnectionAlertComponent;
  let fixture: ComponentFixture<ConnectionAlertComponent>;
  let eventService: EventService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConnectionAlertComponent],
      providers: [EventService],
    });
    fixture = TestBed.createComponent(ConnectionAlertComponent);
    component = TestBed.createComponent(ConnectionAlertComponent)
      .componentInstance;
    eventService = TestBed.inject(EventService);
  });

  it('should listen to CONNECTION_ERROR', () => {
    component.ngOnInit();
    eventService.emit(EventService.CONNECTION_ERROR);
    expect(component.connected).toBeFalsy();
    expect(component.hide).toBeFalsy();
  });
});
