import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { EventService } from '@core/event/event.service';

@Component({
  selector: 'tsl-connection-alert',
  templateUrl: './connection-alert.component.html',
  styleUrls: ['./connection-alert.component.scss'],
  animations: [
    trigger('visibilityChanged', [
      state('true', style({ opacity: 1, transform: 'translateY(0)' })),
      state('false', style({ opacity: 0, transform: 'translateY(-100%)' })),
      transition('* => *', animate('500ms')),
    ]),
  ],
})
export class ConnectionAlertComponent implements OnInit {
  public connected = true;
  public hide = true;

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.eventService.subscribe(EventService.CONNECTION_ERROR, () => {
      this.connected = false;
      this.hide = false;
    });
    this.eventService.subscribe(EventService.CONNECTION_RESTORED, () => {
      this.connected = true;
      setTimeout(() => {
        this.hide = true;
      }, 500);
    });
  }
}
