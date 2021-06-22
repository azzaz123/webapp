import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { PaymentsCreditCardService } from '@api/payments/cards';
import { I18nService } from '@core/i18n/i18n.service';
import { UuidService } from '@core/uuid/uuid.service';
import { MOCK_EMPTY_CREDIT_CARD_FORM } from '@fixtures/private/delivery/credit-card/credit-card.fixtures.spec';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { NumbersOnlyDirective } from '@shared/directives/numbers-only/numbers-only.directive';
import { SeparateWordByCharacterPipe } from '@shared/pipes/separate-word-by-character/separate-word-by-character.pipe';
import { ProfileFormComponent } from '@shared/profile/profile-form/profile-form.component';
import { of } from 'rxjs';

import { CreditCardComponent } from './credit-card.component';

describe('CreditCreditCardComponent', () => {
  let component: CreditCardComponent;
  let fixture: ComponentFixture<CreditCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule],
      declarations: [CreditCardComponent, ProfileFormComponent, NumbersOnlyDirective, SeparateWordByCharacterPipe],
      providers: [
        FormBuilder,
        ToastService,
        I18nService,
        {
          provide: PaymentsCreditCardService,
          useValue: {
            get() {
              return of(null);
            },
            create() {
              return of(null);
            },
            update() {
              return of(null);
            },
          },
        },
        {
          provide: UuidService,
          useValue: {
            getUUID() {
              return 'FAKE_UUID';
            },
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when we initialize the form...', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should construct the credit card form', () => {
      expect(component.creditCardForm.value).toStrictEqual(MOCK_EMPTY_CREDIT_CARD_FORM);
    });
  });
});
