import { Component, EventEmitter, Input, OnDestroy, Output } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Lead } from "../../core/conversation/lead";
import { ConversationService } from "../../core/conversation/conversation.service";

@Component({
  selector: 'tsl-archive-button',
  templateUrl: './archive-button.component.html',
  styleUrls: ['./archive-button.component.scss']
})
export class ArchiveButtonComponent {

  @Input() lead: Lead;
  @Output() click: EventEmitter<any> = new EventEmitter();

  constructor(private conversationService: ConversationService) {
  }

  archive(event: Event) {
    event.stopPropagation();
    this.click.emit();
    this.conversationService.archive(this.lead.id).subscribe();
  }

}
