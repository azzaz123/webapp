import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SendPhoneComponent } from './send-phone.component';
import { MessageService } from '../../../core/message/message.service';
import { TrackingService } from '../../../core/tracking/tracking.service';
import { PersistencyService } from '../../../core/persistency/persistency.service';
import { ErrorsService } from '../../../core/errors/errors.service';
import { Observable } from 'rxjs/Observable';
import { MockTrackingService } from '../../../../tests/tracking.fixtures.spec';
import { MOCK_CONVERSATION } from '../../../../tests/conversation.fixtures.spec';

describe('SendPhoneComponent', () => {
  let component: SendPhoneComponent;
  let fixture: ComponentFixture<SendPhoneComponent>;
  let messageService: MessageService;
  let trackingService: TrackingService;
  let persistencyService: PersistencyService;
  let errorsService: ErrorsService;
  const phoneNumber = '555-3231';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [NgbActiveModal,
        FormBuilder,
        { provide: MessageService, useValue: { createPhoneNumberMessage() { } } },
        { provide: TrackingService, useClass: MockTrackingService },
        { provide: PersistencyService, useValue: { getPhoneNumber() { return Observable.of({ phone: phoneNumber }); } } },
        { provide: ErrorsService, useValue: { i18nError() { } } },
      ],
      declarations: [ SendPhoneComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendPhoneComponent);
    component = fixture.componentInstance;
    messageService = TestBed.get(MessageService);
    trackingService = TestBed.get(TrackingService);
    persistencyService = TestBed.get(PersistencyService);
    errorsService = TestBed.get(ErrorsService);
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(persistencyService, 'getPhoneNumber').and.callThrough();
      component.ngOnInit();
    });

    it('should call persistencyService.getPhoneNumber when component initialises', () => {
      expect(persistencyService.getPhoneNumber).toHaveBeenCalled();
    });

    it('should set the value of phone to the value returned by the persistencyService', () => {
      expect(component.sendPhoneForm.controls.phone.value).toBe(phoneNumber);
    });

  });

  describe('ngAfterContentInit', () => {
    beforeEach(() => {
      component.phoneField = {
        nativeElement: {
          focus() {
          }
        }
      };
      spyOn(component.phoneField.nativeElement, 'focus');
    });

    it('should set focus', fakeAsync(() => {
      component.ngAfterContentInit();

      expect(component.phoneField.nativeElement.focus).toHaveBeenCalled();
    }));
  });

  describe('createPhoneNumberMessage', () => {
    describe('when the form is valid', () => {
      it('should call messageService.createPhoneNumberMessage with the conversation and phoneNumber', () => {
        spyOn(messageService, 'createPhoneNumberMessage');
        component.conversation = MOCK_CONVERSATION();

        component.createPhoneNumberMessage();

        expect(messageService.createPhoneNumberMessage).toHaveBeenCalledWith(component.conversation, phoneNumber);
      });

      it('should call trackingService.addTrackingEvent with CHAT_SHAREPHONE_ACCEPTSHARING', () => {
        spyOn(trackingService, 'addTrackingEvent');

        component.createPhoneNumberMessage();

        expect(trackingService.addTrackingEvent).toHaveBeenCalledWith({ eventData: TrackingService.CHAT_SHAREPHONE_ACCEPTSHARING });
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
      });

      it('should call markAsDirty', () => {
        spyOn(component.sendPhoneForm.controls.phone, 'markAsDirty');

        component.createPhoneNumberMessage();

        expect(component.sendPhoneForm.controls.phone.markAsDirty).toHaveBeenCalled();
      });

      it('should be invalid if the phone field is empty', () => {
        spyOn(errorsService, 'i18nError');

        component.createPhoneNumberMessage();

        expect(errorsService.i18nError).toHaveBeenCalledWith('formErrors');
      });
    });
  });

  describe('dismiss', () => {
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
});
