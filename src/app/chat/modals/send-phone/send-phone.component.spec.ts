import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NO_ERRORS_SCHEMA } from '@angular/core';
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

describe('SendPhoneComponent', () => {
  let component: SendPhoneComponent;
  let fixture: ComponentFixture<SendPhoneComponent>;
  let messageService: MessageService;
  let trackingService: TrackingService;
  let errorsService: ErrorsService;
  let windowRef: WindowRef;
  const phoneNumber = '555-3231';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [NgbActiveModal,
        FormBuilder,
        { provide: MessageService, useValue: {
          createPhoneNumberMessage() {},
          addPhoneNumberRequestMessage() {}
        } },
        { provide: TrackingService, useClass: MockTrackingService },
        { provide: ErrorsService, useValue: { i18nError() { } } },
        { provide: WindowRef, useValue: {
          nativeWindow: {
            location: {
              href: environment.siteUrl
            }
          }
        }},
      ],
      declarations: [ SendPhoneComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendPhoneComponent);
    component = fixture.componentInstance;
    component.phone = phoneNumber;
    messageService = TestBed.get(MessageService);
    trackingService = TestBed.get(TrackingService);
    errorsService = TestBed.get(ErrorsService);
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
        nativeElement: { focus() {} }
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

      it('should call messageService.createPhoneNumberMessage with the conversation and phoneNumber', () => {
        spyOn(messageService, 'createPhoneNumberMessage');
        component.conversation = MOCK_CONVERSATION();

        component.createPhoneNumberMessage();

        expect(messageService.createPhoneNumberMessage).toHaveBeenCalledWith(component.conversation, phoneNumber);
      });

      it('should close the modal', () => {
        spyOn(component.activeModal, 'close');

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

    describe('when required is true', () => {
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

        expect(windowRef.nativeWindow.location.href).toEqual(environment.siteUrl + 'item/' + component.conversation.item.webSlug);
      });
    });
  });
});
