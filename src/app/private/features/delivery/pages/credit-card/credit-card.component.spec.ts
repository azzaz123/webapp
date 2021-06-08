import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UuidService } from '@core/uuid/uuid.service';
import { MOCK_EMPTY_CREDIT_CARD } from '@fixtures/private/delivery/credit-card/credit-card.fixtures.spec';
import { NumbersOnlyDirective } from '@shared/directives/numbers-only/numbers-only.directive';
import { SeparateWordByCharacterPipe } from '@shared/pipes/separate-word-by-character/separate-word-by-character.pipe';
import { ProfileFormComponent } from '@shared/profile/profile-form/profile-form.component';

import { CreditCardComponent } from './credit-card.component';

describe('CreditCreditCardComponent', () => {
  let component: CreditCardComponent;
  let fixture: ComponentFixture<CreditCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [CreditCardComponent, ProfileFormComponent, NumbersOnlyDirective, SeparateWordByCharacterPipe],
      providers: [
        FormBuilder,
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
      expect(component.cardForm.value).toStrictEqual(MOCK_EMPTY_CREDIT_CARD);
    });
  });
});
