import { Component, EventEmitter, Input, OnDestroy, Output } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Lead } from "../../core/conversation/lead";
import { ConversationService } from "../../core/conversation/conversation.service";

@Component({
  selector: 'tsl-archive-button',
  templateUrl: './archive-button.component.html',
  styleUrls: ['./archive-button.component.scss']
})
export class ArchiveButtonComponent implements OnDestroy {

  @Input() lead: Lead;
  @Output() click: EventEmitter<any> = new EventEmitter();
  private active: boolean = true;

  constructor(private conversationService: ConversationService) {
  }

  ngOnDestroy() {
    this.active = false;
  }

  archive(event: Event) {
    event.stopPropagation();
    this.click.emit();
    let observable: Observable<any>;
    observable = this.conversationService.archive(this.lead.id);
    observable.takeWhile(() => {
      return this.active;
    }).subscribe();
  }

}
