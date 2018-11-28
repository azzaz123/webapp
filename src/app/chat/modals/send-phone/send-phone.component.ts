import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from '../../../core/message/message.service';
import { Conversation } from '../../../core/conversation/conversation';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ErrorsService } from '../../../core/errors/errors.service';
import { TrackingService } from '../../../core/tracking/tracking.service';
import { environment } from '../../../../environments/environment';
import { WindowRef } from '../../../core/window/window.service';
import { HttpService } from '../../../core/http/http.service';
import { format, AsYouType } from 'libphonenumber-js';

@Component({
  selector: 'tsl-send-phone',
  templateUrl: './send-phone.component.html',
  styleUrls: ['./send-phone.component.scss']
})
export class SendPhoneComponent implements OnInit {

  @Input() conversation: Conversation;
  @Input() required: boolean;
  @Input() phone: string;
  @ViewChild('phoneInput') phoneField: ElementRef;
  public sendPhoneForm: FormGroup;
  private phonePattern: RegExp = /\s*(?:[0-9]\s*){9}$/;
  protected API_URL = 'api/v3/conversations';

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private http: HttpService,
    private errorsService: ErrorsService,
    private trackingService: TrackingService,
    private windowRef: WindowRef,
    public activeModal: NgbActiveModal) {
    this.trackingService.trackAccumulatedEvents();
    this.sendPhoneForm = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern(this.phonePattern)]]
    });
  }

  ngOnInit() {
    setTimeout(() => this.phoneField.nativeElement.focus(), 1000);
    if (this.phone) {
      this.sendPhoneForm.setValue({
        phone: this.phone
      });
    }
  }

  createPhoneNumberMessage() {
    if (this.sendPhoneForm.valid) {
      const formattedPhoneNumber = format(this.sendPhoneForm.controls.phone.value.toString() , 'ES', 'International');
      if (this.required) {
        this.messageService.addPhoneNumberRequestMessage(this.conversation, false);
        this.trackingService.addTrackingEvent({
          eventData: TrackingService.ITEM_SHAREPHONE_SENDPHONE,
          attributes: { item_id: this.conversation.item.id }
        });
      } else {
        this.trackingService.addTrackingEvent({ eventData: TrackingService.CHAT_SHAREPHONE_ACCEPTSHARING });
      }
      this.http.put(`${this.API_URL}/${this.conversation.id}/buyer-phone-number`, {
        phone_number: formattedPhoneNumber
      }).subscribe();
      this.messageService.createPhoneNumberMessage(this.conversation, formattedPhoneNumber);
      this.activeModal.close();
    } else if (!this.sendPhoneForm.controls.phone.valid) {
      this.trackingService.addTrackingEvent({
        eventData: TrackingService.ITEM_SHAREPHONE_WRONGPHONE,
        attributes: { item_id: this.conversation.item.id, phone_number: this.sendPhoneForm.controls.phone.value }
      });
      this.sendPhoneForm.controls.phone.markAsDirty();
      this.errorsService.i18nError('formErrors');
    }
  }

  checkMaxLength(event: any) {
    const numberOfDigits = event.target.value.split(' ').join('').length;
    event.target.value = new AsYouType('ES').input(event.target.value);
    event.target.onkeypress = () => !(numberOfDigits >= 9);
  }

  dismiss() {
    if (this.required) {
      this.trackingService.track(TrackingService.ITEM_SHAREPHONE_HIDEFORM, { item_id: this.conversation.item.id });
      this.windowRef.nativeWindow.location.href = environment.siteUrl + 'item/' + this.conversation.item.webSlug;
    } else {
      this.trackingService.addTrackingEvent({ eventData: TrackingService.CHAT_SHAREPHONE_CANCELSHARING });
      this.activeModal.dismiss();
    }
  }
}
