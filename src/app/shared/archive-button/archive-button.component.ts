import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Lead } from '../../core/conversation/lead';
import { Call } from '../../core/conversation/calls';
import { CallsService } from '../../core/conversation/calls.service';

@Component({
  selector: 'tsl-archive-button',
  templateUrl: './archive-button.component.html',
  styleUrls: ['./archive-button.component.scss'],
})
export class ArchiveButtonComponent {
  @Input() lead: Lead;
  @Output() handleClick: EventEmitter<any> = new EventEmitter();

  constructor(private callService: CallsService) {}

  archive(event: Event) {
    event.stopPropagation();
    this.handleClick.emit();
    if (this.lead instanceof Call) {
      this.callService.archive(this.lead.id).subscribe();
    }
  }
}
