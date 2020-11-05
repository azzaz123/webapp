import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { format } from 'libphonenumber-js';
import { By } from '@angular/platform-browser';

import { environment } from '../../../../environments/environment';
import { SendPhoneComponent } from './send-phone.component';
import { TrackingService } from '../../../core/tracking/tracking.service';
import { ErrorsService } from '../../../core/errors/errors.service';

import { MockTrackingService } from '../../../../tests/tracking.fixtures.spec';
import { MOCK_CONVERSATION } from '../../../../tests/conversation.fixtures.spec';
import {
  MOCK_INBOX_CONVERSATION,
  CREATE_MOCK_INBOX_CONVERSATION,
} from '../../../../tests/inbox.fixtures.spec';
import { InboxConversationService } from '../../service';
import { InboxConversationServiceMock } from '../../../../tests';
import { empty } from 'rxjs';
import { SharedModule } from '../../../shared/shared.module';
import { RealTimeService } from 'app/core/message/real-time.service';
import { RealTimeServiceMock } from '../../../../tests/real-time.fixtures.spec';

describe('SendPhoneComponent', () => {
  let component: SendPhoneComponent;
  let fixture: ComponentFixture<SendPhoneComponent>;
  let realTimeService: RealTimeService;
  let inboxConversationService: InboxConversationService;
  let trackingService: TrackingService;
  let errorsService: ErrorsService;
  let httpMock: HttpTestingController;
  let element: DebugElement;

  const MOCK_PARSED_PHONE_NUMBER = format(
    '+34912345678',
    'ES',
    'International'
  );
  const MOCK_VALID_SPANISH_PHONES = ['+34 912345678', '+34 612 345 678'];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        NgbActiveModal,
        FormBuilder,
        {
          provide: InboxConversationService,
          useClass: InboxConversationServiceMock,
        },
        { provide: RealTimeService, useClass: RealTimeServiceMock },
        { provide: TrackingService, useClass: MockTrackingService },
        {
          provide: ErrorsService,
          useValue: {
            i18nError() {},
          },
        },
      ],
      declarations: [SendPhoneComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendPhoneComponent);
    element = fixture.debugElement.query(By.css('#phone'));
    component = fixture.componentInstance;
    component.conversation = CREATE_MOCK_INBOX_CONVERSATION();
    realTimeService = TestBed.inject(RealTimeService);
    inboxConversationService = TestBed.inject(InboxConversationService);
    trackingService = TestBed.inject(TrackingService);
    errorsService = TestBed.inject(ErrorsService);
    httpMock = TestBed.inject(HttpTestingController);
    window.location.href = environment.siteUrl;
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should set focus after 1 second', fakeAsync(() => {
      component.phoneField = {
        nativeElement: {
          focus() {},
        },
      };
      spyOn(component.phoneField.nativeElement, 'focus');

      component.ngOnInit();
      tick(1000);

      expect(component.phoneField.nativeElement.focus).toHaveBeenCalled();
    }));
  });

  describe('when user submits the phone input', () => {
    let submitButtonRef;

    beforeEach(() => {
      component.sendPhoneForm.get('phone').setValue(MOCK_PARSED_PHONE_NUMBER);
      submitButtonRef = fixture.debugElement.query(By.css('#send'))
        .nativeElement;
    });

    describe('and when the form is valid', () => {
      it('should track event to analytics', () => {
        spyOn(trackingService, 'track');

        submitButtonRef.click();

        expect(trackingService.track).toHaveBeenCalledWith(
          TrackingService.ITEM_SHAREPHONE_SENDPHONE,
          {
            item_id: component.conversation.item.id,
          }
        );
      });

      it('should save phone number to server', () => {
        spyOn(
          inboxConversationService,
          'addPhoneNumberToConversation$'
        ).and.returnValue(empty());
        component.conversation = MOCK_CONVERSATION();

        component.handleSubmit();

        expect(
          inboxConversationService.addPhoneNumberToConversation$
        ).toHaveBeenCalledWith(
          component.conversation,
          MOCK_PARSED_PHONE_NUMBER
        );
      });

      it('should add the phone number to the conversation', () => {
        spyOn(realTimeService, 'addPhoneNumberMessageToConversation');
        component.conversation = MOCK_CONVERSATION();

        component.handleSubmit();

        expect(
          realTimeService.addPhoneNumberMessageToConversation
        ).toHaveBeenCalledWith(
          component.conversation,
          MOCK_PARSED_PHONE_NUMBER
        );
      });

      it('should close the modal', () => {
        spyOn(component.activeModal, 'close');
        component.conversation = MOCK_CONVERSATION();

        component.handleSubmit();

        expect(component.activeModal.close).toHaveBeenCalled();
      });
    });

    describe('when the phone field is empty', () => {
      beforeEach(() => {
        component.sendPhoneForm.get('phone').patchValue('');
        component.conversation = MOCK_CONVERSATION();
      });

      it('should call trackingService.track with ITEM_SHAREPHONE_WRONGPHONE', () => {
        spyOn(trackingService, 'track');

        component.handleSubmit();

        expect(trackingService.track).toHaveBeenCalledWith(
          TrackingService.ITEM_SHAREPHONE_WRONGPHONE,
          {
            item_id: component.conversation.item.id,
            phone_number: component.sendPhoneForm.controls.phone.value,
          }
        );
      });

      it('should call markAsDirty', () => {
        spyOn(component.sendPhoneForm.controls.phone, 'markAsDirty');

        component.handleSubmit();

        expect(
          component.sendPhoneForm.controls.phone.markAsDirty
        ).toHaveBeenCalled();
      });

      it('should call errorsService.i18nError if the phone field is empty', () => {
        spyOn(errorsService, 'i18nError');

        component.handleSubmit();

        expect(errorsService.i18nError).toHaveBeenCalledWith('formErrors');
      });
    });

    describe('phone number validation', () => {
      beforeEach(() => {
        component.conversation = MOCK_CONVERSATION();
      });

      it('should set controls.phone.valid as TRUE when an invalid input is provided', () => {
        MOCK_VALID_SPANISH_PHONES.map((input) => {
          component.sendPhoneForm.get('phone').patchValue(input);

          component.handleSubmit();

          expect(component.sendPhoneForm.controls.phone.valid).toBe(true);
        });
      });

      it('should set controls.phone.valid as FALSE when an invalid input is provided', () => {
        const invalidEntries = [
          '',
          '+349-has-letters-223',
          '(456456)456',
          '456456456',
          '123456789',
        ];

        invalidEntries.forEach((input) => {
          component.sendPhoneForm.get('phone').patchValue(input);
          component.handleSubmit();
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
        const expectedFormattedNumber = format(
          phoneValue,
          'ES',
          'International'
        ); // e.g.: +34 633 33 33 33
        element.triggerEventHandler('keyup', {
          target: element.nativeElement,
        });

        expect(element.nativeElement.value).toBe(expectedFormattedNumber);
      });
    });

    it('should make onkeypress return FALSE (disable typing) when the number of digits excluding the prefix is 9', () => {
      validInputs.map((phoneValue) => {
        element.nativeElement.value = phoneValue;
        element.triggerEventHandler('keyup', {
          target: element.nativeElement,
        });

        const onkeypressValue = element.nativeElement.onkeypress();

        expect(onkeypressValue).toBe(false);
      });
    });

    it('should make onkeypress return TRUE (enable typing) when the number of digits excluding the prefix is 9', () => {
      incompleteInputs.map((phoneValue) => {
        element.nativeElement.value = phoneValue;
        element.triggerEventHandler('keyup', {
          target: element.nativeElement,
        });

        const onkeypressValue = element.nativeElement.onkeypress();

        expect(onkeypressValue).toBe(true);
      });
    });
  });

  describe('when clicking the cross in the modal', () => {
    let closeButtonRef;

    beforeEach(() => {
      spyOn(trackingService, 'track');
      component.conversation = MOCK_INBOX_CONVERSATION;
      component.conversation.item.itemUrl = `${environment.siteUrl}item/aa-186156806`;
      fixture.detectChanges();
      closeButtonRef = fixture.debugElement.query(By.css('.modal-close'))
        .nativeElement;
    });

    it('should track event to analytics', () => {
      closeButtonRef.click();

      expect(trackingService.track).toHaveBeenCalledWith(
        TrackingService.ITEM_SHAREPHONE_HIDEFORM,
        {
          item_id: component.conversation.item.id,
        }
      );
    });

    it('should redirect to the item detail page', () => {
      closeButtonRef.click();

      expect(window.location.href).toEqual(
        `${component.conversation.item.itemUrl}`
      );
    });
  });
});
