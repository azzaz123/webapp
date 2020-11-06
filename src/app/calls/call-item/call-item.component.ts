import {
  Component,
  OnChanges,
  Input,
  HostBinding,
  HostListener,
} from '@angular/core';
import { Remove } from '../../shared/archivable/animations';
import { Call } from '../../core/conversation/calls';
import { Message } from '../../core/message/message';
import { I18nService } from '../../core/i18n/i18n.service';
import { CallsService } from '../../core/conversation/calls.service';

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

  ngOnChanges(changes?: any) {
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
