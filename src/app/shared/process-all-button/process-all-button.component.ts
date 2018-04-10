import { Component, Input, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConversationService } from '../../core/conversation/conversation.service';

@Component({
  selector: 'tsl-process-all-button',
  templateUrl: './process-all-button.component.html',
  styleUrls: ['./process-all-button.component.scss']
})
export class ProcessAllButtonComponent {

  @Input() type: string;

  constructor(private conversationService: ConversationService,
              private modalService: NgbModal) {
  }

  public open(targetModal: string) {
    this.modalService.open(targetModal).result.then(() => {
      this.conversationService.archiveAll().subscribe();
    });
  }

}
