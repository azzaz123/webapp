import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SendPhoneComponent } from './send-phone.component';
import { MessageService } from '../../../core/message/message.service';
import { TrackingService } from '../../../core/tracking/tracking.service';
import { ErrorsService } from '../../../core/errors/errors.service';
import { MockTrackingService } from '../../../../tests/tracking.fixtures.spec';
import { MOCK_CONVERSATION } from '../../../../tests/conversation.fixtures.spec';
import { WindowRef } from '../../../core/window/window.service';
import { environment } from '../../../../environments/environment';
import { MOCK_ITEM } from '../../../../tests/item.fixtures.spec';
import { HttpService } from '../../../core/http/http.service';
import { TEST_HTTP_PROVIDERS } from '../../../../tests/utils.spec';
import { By } from '@angular/platform-browser';
import { format } from 'libphonenumber-js';
import { Observable } from 'rxjs';
import { MOCK_INBOX_CONVERSATION } from '../../../../tests/inbox.fixtures.spec';

describe('SendPhoneComponent', () => {
  let component: SendPhoneComponent;
  let fixture: ComponentFixture<SendPhoneComponent>;
  let messageService: MessageService;
  let trackingService: TrackingService;
  let errorsService: ErrorsService;
  let http: HttpService;
  let windowRef: WindowRef;
  let element: DebugElement;
  const phoneNumber = format('+34912345678', 'ES', 'International');
  const API_URL = 'api/v3/conversations';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [NgbActiveModal,
        FormBuilder,
        ...TEST_HTTP_PROVIDERS,
        {
          provide: MessageService, useValue: {
            createPhoneNumberMessage() {
            },
            addPhoneNumberRequestMessage() {
            }
          }
        },
        { provide: TrackingService, useClass: MockTrackingService },
        {
          provide: ErrorsService, useValue: {
            i18nError() {
            }
          }
        },
        {
          provide: WindowRef, useValue: {
            nativeWindow: {
              location: {
                href: environment.siteUrl
              }
            }
          }
        },
      ],
      declarations: [SendPhoneComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendPhoneComponent);
    element = fixture.debugElement.query(By.css('#phone'));
    component = fixture.componentInstance;
    component.phone = phoneNumber;
    messageService = TestBed.get(MessageService);
    trackingService = TestBed.get(TrackingService);
    errorsService = TestBed.get(ErrorsService);
    http = TestBed.get(HttpService);
    windowRef = TestBed.get(WindowRef);
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should set the value of phone to the value of the phone input', () => {
      component.ngOnInit();

      expect(component.sendPhoneForm.controls.phone.value).toBe(phoneNumber);
    });

    it('should set focus after 1 second', fakeAsync(() => {
      component.phoneField = {
        nativeElement: {
          focus() {
          }
        }
      };
      spyOn(component.phoneField.nativeElement, 'focus');

      component.ngOnInit();
      tick(1000);

      expect(component.phoneField.nativeElement.focus).toHaveBeenCalled();
    }));
  });

  describe('createPhoneNumberMessage', () => {
    describe('when the form is valid', () => {
      describe('and required is true', () => {
        beforeEach(() => {
          component.conversation = MOCK_CONVERSATION();
          component.required = true;
          fixture.detectChanges();
        });

        it('should call messageService.addPhoneNumberRequestMessage with the conversation and FALSE', () => {
          spyOn(messageService, 'addPhoneNumberRequestMessage');

          component.createPhoneNumberMessage();

          expect(messageService.addPhoneNumberRequestMessage).toHaveBeenCalledWith(component.conversation, false);
        });

        it('should call trackingService.addTrackingEvent with ITEM_SHAREPHONE_SENDPHONE', () => {
          spyOn(trackingService, 'addTrackingEvent');
          const event = {
            eventData: TrackingService.ITEM_SHAREPHONE_SENDPHONE,
            attributes: { item_id: component.conversation.item.id }
          };

          component.createPhoneNumberMessage();

          expect(trackingService.addTrackingEvent).toHaveBeenCalledWith(event);
        });

      });

      describe('and required is false', () => {
        beforeEach(() => {
          component.conversation = MOCK_CONVERSATION();
          component.required = false;
          fixture.detectChanges();
        });

        it('should call trackingService.addTrackingEvent with CHAT_SHAREPHONE_ACCEPTSHARING', () => {
          spyOn(trackingService, 'addTrackingEvent');

          component.createPhoneNumberMessage();

          expect(trackingService.addTrackingEvent).toHaveBeenCalledWith({ eventData: TrackingService.CHAT_SHAREPHONE_ACCEPTSHARING });
        });
      });

      it('should PUT the phone numberto the relevant API', () => {
        spyOn(http, 'put').and.returnValue(Observable.of(true));
        component.conversation = MOCK_CONVERSATION();

        component.createPhoneNumberMessage();

        expect(http.put).toHaveBeenCalledWith(`${API_URL}/${component.conversation.id}/buyer-phone-number`, {
          phone_number: phoneNumber
        });
      });

      it('should call messageService.createPhoneNumberMessage with the conversation and phoneNumber', () => {
        spyOn(messageService, 'createPhoneNumberMessage');
        component.conversation = MOCK_CONVERSATION();

        component.createPhoneNumberMessage();

        expect(messageService.createPhoneNumberMessage).toHaveBeenCalledWith(component.conversation, phoneNumber);
      });

      it('should close the modal', () => {
        spyOn(component.activeModal, 'close');
        component.conversation = MOCK_CONVERSATION();

        component.createPhoneNumberMessage();

        expect(component.activeModal.close).toHaveBeenCalled();
      });
    });

    describe('when the phone field is empty', () => {
      beforeEach(() => {
        component.sendPhoneForm.get('phone').patchValue('');
        component.conversation = MOCK_CONVERSATION();
      });

      it('should call trackingService.addTrackingEvent with ITEM_SHAREPHONE_WRONGPHONE', () => {
        spyOn(trackingService, 'addTrackingEvent');
        const event = {
          eventData: TrackingService.ITEM_SHAREPHONE_WRONGPHONE,
          attributes: { item_id: component.conversation.item.id, phone_number: component.sendPhoneForm.controls.phone.value }
        };

        component.createPhoneNumberMessage();

        expect(trackingService.addTrackingEvent).toHaveBeenCalledWith(event);
      });

      it('should call markAsDirty', () => {
        spyOn(component.sendPhoneForm.controls.phone, 'markAsDirty');

        component.createPhoneNumberMessage();

        expect(component.sendPhoneForm.controls.phone.markAsDirty).toHaveBeenCalled();
      });

      it('should call errorsService.i18nError if the phone field is empty', () => {
        spyOn(errorsService, 'i18nError');

        component.createPhoneNumberMessage();

        expect(errorsService.i18nError).toHaveBeenCalledWith('formErrors');
      });
    });

    describe('phone number validation', () => {
      beforeEach(() => {
        component.conversation = MOCK_CONVERSATION();
      });

      it('should set controls.phone.valid as TRUE when an invalid input is provided', () => {
        // validator uses isValidNumber provided by libphonenumber-js, validating numbers of ES format
        const validEntries = ['+34 912345678', '+34 612 345 678'];

        validEntries.map(input => {
          component.sendPhoneForm.get('phone').patchValue(input);

          component.createPhoneNumberMessage();

          expect(component.sendPhoneForm.controls.phone.valid).toBe(true);
        });
      });

      it('should set controls.phone.valid as FALSE when an invalid input is provided', () => {
        const invalidEntries = ['+349-has-letters-223', '(349123)45678', '123456789'];

        invalidEntries.map(input => {
          component.sendPhoneForm.get('phone').patchValue(input);

          component.createPhoneNumberMessage();

          expect(component.sendPhoneForm.controls.phone.valid).toBe(false);
        });
      });
    });
  });

  describe('formatNumber', () => {
    const validInputs = ['633333333', '+34 633333333', '912345678'];
    const incompleteInputs = ['6333', '+34 63', '1234567'];

    it('should format the number to Spanish International format when the input has 9 digits, excluding the prefix', () => {
      validInputs.map((phoneValue) => {
        element.nativeElement.value = phoneValue;
        const expectedFormattedNumber = format(phoneValue, 'ES', 'International'); // e.g.: +34 633 33 33 33
        element.triggerEventHandler('keyup', {
          target: element.nativeElement
        });

        expect(element.nativeElement.value).toBe(expectedFormattedNumber);
      });
    });

    it('should make onkeypress return FALSE (disable typing) when the number of digits excluding the prefix is 9', () => {
      validInputs.map((phoneValue) => {
        element.nativeElement.value = phoneValue;
        element.triggerEventHandler('keyup', {
          target: element.nativeElement
        });

        const onkeypressValue = element.nativeElement.onkeypress();

        expect(onkeypressValue).toBe(false);
      });
    });

    it('should make onkeypress return TRUE (enable typing) when the number of digits excluding the prefix is 9', () => {
      incompleteInputs.map((phoneValue) => {
        element.nativeElement.value = phoneValue;
        element.triggerEventHandler('keyup', {
          target: element.nativeElement
        });

        const onkeypressValue = element.nativeElement.onkeypress();

        expect(onkeypressValue).toBe(true);
      });
    });
  });

  describe('dismiss', () => {
    describe('when required is false', () => {
      beforeEach(() => {
        component.required = false;
        fixture.detectChanges();
      });

      it('should call trackingService.addTrackingEvent with CHAT_SHAREPHONE_CANCELSHARING', () => {
        spyOn(trackingService, 'addTrackingEvent');

        component.dismiss();

        expect(trackingService.addTrackingEvent).toHaveBeenCalledWith({ eventData: TrackingService.CHAT_SHAREPHONE_CANCELSHARING });
      });

      it('should call dismiss() on the active modal', () => {
        spyOn(component.activeModal, 'dismiss');

        component.dismiss();

        expect(component.activeModal.dismiss).toHaveBeenCalled();
      });
    });

    describe('when required is true in archive chat', () => {
      beforeEach(() => {
        component.required = true;
        component.conversation = MOCK_CONVERSATION();
        component.conversation.item = MOCK_ITEM;
        fixture.detectChanges();
      });

      it('should call trackingService.track with ITEM_SHAREPHONE_HIDEFORM', () => {
        spyOn(trackingService, 'track');

        component.dismiss();

        expect(trackingService.track).toHaveBeenCalledWith(TrackingService.ITEM_SHAREPHONE_HIDEFORM,
          { item_id: component.conversation.item.id });
      });

      it('should redirect to the item detail page', () => {
        component.dismiss();

        expect(windowRef.nativeWindow.location.href).toEqual(`${environment.siteUrl}item/${component.conversation.item['webSlug']}`);
      });
    });

    describe('when required is true in projection chat', () => {
      beforeEach(() => {
        component.required = true;
        component.conversation = MOCK_INBOX_CONVERSATION;
        component.conversation.item['itemUrl'] = 'URL to Item';
        fixture.detectChanges();
      });

      it('should call trackingService.track with ITEM_SHAREPHONE_HIDEFORM', () => {
        spyOn(trackingService, 'track');

        component.dismiss();

        expect(trackingService.track).toHaveBeenCalledWith(TrackingService.ITEM_SHAREPHONE_HIDEFORM,
          { item_id: component.conversation.item.id });
      });

      it('should redirect to the item detail page', () => {
        component.dismiss();

        expect(windowRef.nativeWindow.location.href).toEqual(component.conversation.item['itemUrl']);
      });
    });
  });
});
