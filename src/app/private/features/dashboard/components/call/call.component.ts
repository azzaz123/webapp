import { Component, HostBinding, HostListener, Input } from '@angular/core';
import { Call } from '@core/conversation/calls';
import { CallsService } from '@core/conversation/calls.service';
import { CALENDAR_SPEC_TYPE } from '@core/i18n/moment/enums/calendar-spec-type.enum';
import { MomentCalendarSpecService } from '@core/i18n/moment/moment-calendar-spec.service';
import { Remove } from '@shared/archivable/animations';

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

  public momentCalendarSpec: CalendarSpec = this.momentCalendarSpecService.getCalendarSpec(CALENDAR_SPEC_TYPE.DAYS);

  constructor(private callService: CallsService, private momentCalendarSpecService: MomentCalendarSpecService) {}

  @HostListener('@remove.done') onAnimationDone($event: Event) {
    if (this.archived) {
      if (this.call instanceof Call) {
        this.callService.stream();
      }
    }
  }
}
