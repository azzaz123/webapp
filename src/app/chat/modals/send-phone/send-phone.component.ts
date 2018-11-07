import { Component, OnInit, Input, AfterContentInit, ViewChild, ElementRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from '../../../core/message/message.service';
import { Conversation } from '../../../core/conversation/conversation';
import { PersistencyService } from '../../../core/persistency/persistency.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'tsl-send-phone',
  templateUrl: './send-phone.component.html',
  styleUrls: ['./send-phone.component.scss']
})
export class SendPhoneComponent implements OnInit, AfterContentInit {

  @Input() conversation: Conversation;
  @ViewChild('phoneInput') phoneField: ElementRef;
  private phone: Observable<string>;

  constructor(
    public activeModal: NgbActiveModal,
    private messageService: MessageService,
    private persistencyService: PersistencyService
  ) { }

  ngOnInit() {
    this.persistencyService.getPhoneNumber().subscribe((r) => this.phone = r.phone);
  }

  ngAfterContentInit() {
    this.phoneField.nativeElement.focus();
  }

  public createPhoneNumberMessage(phone) {
    this.messageService.createPhoneNumberMessage(this.conversation, phone);
    this.activeModal.close();
  }

}
