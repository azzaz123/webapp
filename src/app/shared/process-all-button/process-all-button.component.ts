import { Component, Input, OnDestroy } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ConversationService } from "../../core/conversation/conversation.service";

@Component({
  selector: 'tsl-process-all-button',
  templateUrl: './process-all-button.component.html',
  styleUrls: ['./process-all-button.component.scss']
})
export class ProcessAllButtonComponent implements OnDestroy {

  @Input() type: string;
  private active: boolean = true;

  constructor(private conversationService: ConversationService,
              private modalService: NgbModal) {
  }

  ngOnDestroy() {
    this.active = false;
  }

  public open(targetModal: string) {
    this.modalService.open(targetModal).result.then(() => {
        this.conversationService.archiveAll().subscribe();
    });
  }

}
