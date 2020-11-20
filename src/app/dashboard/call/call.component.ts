import { Component, HostBinding, HostListener, Input } from '@angular/core';
import { Remove } from '../../shared/archivable/animations';
import { Call } from '../../core/conversation/calls';
import { CallsService } from '../../core/conversation/calls.service';

import { CalendarSpec } from 'moment';

@Component({
  selector: 'tsl-call',
  templateUrl: './call.component.html',
  styleUrls: ['./call.component.scss'],
  animations: [Remove('0.5s 0.5s')],
})
export class CallComponent {
  @Input() call: Call;
  @HostBinding('class.archived')
  @HostBinding('@remove')
  archived = false;

  public momentConfig: CalendarSpec = {
    lastDay: 'ddd',
    sameDay: 'HH:mm',
    nextDay: 'ddd',
    lastWeek: 'ddd',
    nextWeek: 'ddd',
    sameElse: 'D MMM',
  };

  constructor(private callService: CallsService) {}

  @HostListener('@remove.done') onAnimationDone($event: Event) {
    if (this.archived) {
      if (this.call instanceof Call) {
        this.callService.stream();
      }
    }
  }
}
