import { Component, HostBinding, HostListener, Input, OnChanges } from '@angular/core';
import { Remove } from '../../shared/archivable/animations';
import { InboxConversation } from '../../core/conversation/conversation';
import { ConversationService } from '../../core/conversation/conversation.service';
import { UserService } from '../../core/user/user.service';

@Component({
  selector: 'tsl-inbox-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss'],
  animations: [Remove('1s 1s')]
})
export class InboxConversationComponent implements OnChanges {

  @Input() conversation: InboxConversation;
  @Input() dashboard: boolean;
  @HostBinding('class.archive') archive = false;
  @HostBinding('class.archived') @HostBinding('@remove') archived = false;
  @HostBinding('class.professional') public isProfessional: boolean;

  public momentConfig: any = {
    lastDay: 'ddd',
    sameDay: 'HH:mm',
    nextDay: 'ddd',
    lastWeek: 'ddd',
    nextWeek: 'ddd',
    sameElse: 'D MMM'
  };

  constructor(private conversationService: ConversationService,
              private userService: UserService) {
    this.userService.isProfessional().subscribe((value: boolean) => {
      this.isProfessional = value;
    });
  }

  ngOnChanges(changes?: any) {
    console.log('this.conversation', this.conversation);
    this.archive = this.conversation.archived;
  }

  @HostListener('@remove.done') onAnimationDone($event: Event) {
    if (this.archived) {
      this.conversationService.stream();
    }
  }

}
