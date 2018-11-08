import { Component, OnInit, Input, AfterContentInit, ViewChild, ElementRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from '../../../core/message/message.service';
import { Conversation } from '../../../core/conversation/conversation';
import { PersistencyService } from '../../../core/persistency/persistency.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ErrorsService } from '../../../core/errors/errors.service';

@Component({
  selector: 'tsl-send-phone',
  templateUrl: './send-phone.component.html',
  styleUrls: ['./send-phone.component.scss']
})
export class SendPhoneComponent implements OnInit, AfterContentInit {

  @Input() conversation: Conversation;
  @ViewChild('phoneInput') phoneField: ElementRef;
  public sendPhoneForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private persistencyService: PersistencyService,
    private errorsService: ErrorsService,
    public activeModal: NgbActiveModal
  ) {
    this.sendPhoneForm = this.fb.group({
      phone: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.persistencyService.getPhoneNumber().subscribe((r) => {
      this.sendPhoneForm.setValue({
        phone: r.phone,
      });
    });
  }

  ngAfterContentInit() {
    this.phoneField.nativeElement.focus();
  }

  public createPhoneNumberMessage() {
    if (this.sendPhoneForm.valid) {
      this.messageService.createPhoneNumberMessage(this.conversation, this.sendPhoneForm.value.phone);
      this.activeModal.close();
    } else if (!this.sendPhoneForm.controls.phone.valid) {
      this.sendPhoneForm.controls.phone.markAsDirty();
      this.errorsService.i18nError('formErrors');
    }
  }
}
