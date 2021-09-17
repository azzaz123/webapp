import { Component, OnChanges, Input, HostBinding, HostListener } from '@angular/core';
import { Call } from '@core/conversation/calls';
import { CallsService } from '@core/conversation/calls.service';
import { CALENDAR_SPEC_TYPE } from '@core/i18n/moment/enums/calendar-spec-type.enum';
import { MomentCalendarSpecService } from '@core/i18n/moment/moment-calendar-spec.service';
import { Message } from '@core/message/message';
import { Remove } from '@shared/archivable/animations';
import { CalendarSpec } from 'moment';

@Component({
  selector: 'tsl-call-item',
  templateUrl: './call-item.component.html',
  styleUrls: ['./call-item.component.scss'],
  animations: [Remove('0.5s')],
})
export class CallItemComponent implements OnChanges {
  @HostBinding('class.archived') @HostBinding('@remove') archived = false;
  @HostBinding('class.archive') get archive(): boolean {
    return this.call.archived;
  }
  @Input() call: Call;

  public formattedDuration = '-';
  public messages: Message[];
  public momentCalendarSpec: CalendarSpec = this.momentCalendarSpecService.getCalendarSpec(CALENDAR_SPEC_TYPE.DAYS);

  constructor(private momentCalendarSpecService: MomentCalendarSpecService, private callService: CallsService) {}

  @HostListener('@remove.done') onAnimationDone($event: Event) {
    if (this.archived) {
      this.callService.stream();
    }
  }
  ngOnChanges() {
    this.messages = this.call.messages.slice(-4);
    if (this.call instanceof Call) {
      const minutes: number = Math.floor((<Call>this.call).callDuration / 60);
      const seconds: number = (<Call>this.call).callDuration - minutes * 60;
      this.calculateFormattedDuration(minutes, seconds);
    }
  }

  private calculateFormattedDuration(minutes: number, seconds: number) {
    if ((<Call>this.call).callStatus === 'ANSWERED') {
      this.formattedDuration = '';
      if (minutes > 0) {
        this.formattedDuration += `${minutes}m `;
      }
      if (seconds > 0) {
        this.formattedDuration += `${seconds}s`;
      }
    }
  }
}
