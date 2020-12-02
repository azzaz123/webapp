import {
  Component,
  OnChanges,
  Input,
  HostBinding,
  HostListener,
} from '@angular/core';
import { Call } from 'app/core/conversation/calls';
import { CallsService } from 'app/core/conversation/calls.service';
import { I18nService } from 'app/core/i18n/i18n.service';
import { Message } from 'app/core/message/message';
import { Remove } from 'app/shared/archivable/animations';

@Component({
  selector: 'tsl-call-item',
  templateUrl: './call-item.component.html',
  styleUrls: ['./call-item.component.scss'],
  animations: [Remove('0.5s')],
})
export class CallItemComponent implements OnChanges {
  @Input() call: Call;

  @HostBinding('class.archived') @HostBinding('@remove') archived = false;
  @HostBinding('class.archive') get archive(): boolean {
    return this.call.archived;
  }

  public formattedDuration = '-';
  public messages: Message[];
  public momentConfig: any;

  constructor(private i18n: I18nService, private callService: CallsService) {
    this.momentConfig = i18n.getTranslations('daysMomentConfig');
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

  @HostListener('@remove.done') onAnimationDone($event: Event) {
    if (this.archived) {
      this.callService.stream();
    }
  }
}
