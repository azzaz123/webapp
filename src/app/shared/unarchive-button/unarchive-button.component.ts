import { Component, Input } from '@angular/core';
import { Lead } from '../../core/conversation/lead';
import { Observable } from 'rxjs';
import { Call } from '../../core/conversation/calls';
import { CallsService } from '../../core/conversation/calls.service';

@Component({
  selector: 'tsl-unarchive-button',
  templateUrl: './unarchive-button.component.html',
  styleUrls: ['./unarchive-button.component.scss'],
})
export class UnarchiveButtonComponent {
  @Input() lead: Lead;

  constructor(private callService: CallsService) {}

  unarchive(event: Event) {
    event.stopPropagation();
    if (this.lead instanceof Call) {
      this.callService.unarchive(this.lead.id).subscribe();
    }
  }
}
