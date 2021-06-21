import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { UuidService } from '@core/uuid/uuid.service';
import { MOCK_EMPTY_CREDIT_CARD } from '@fixtures/private/delivery/credit-card/credit-card.fixtures.spec';
import { NumbersOnlyDirective } from '@shared/directives/numbers-only/numbers-only.directive';
import { SeparateWordByCharacterPipe } from '@shared/pipes/separate-word-by-character/separate-word-by-character.pipe';
import { ProfileFormComponent } from '@shared/profile/profile-form/profile-form.component';
import { Subject } from 'rxjs';

import { CreditCardComponent } from './credit-card.component';

describe('CreditCreditCardComponent', () => {
  const backAnchorSelector = '.CreditCard__back';
  const routerEvents: Subject<any> = new Subject();

  let component: CreditCardComponent;
  let fixture: ComponentFixture<CreditCardComponent>;
  let el: HTMLElement;

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
        {
          provide: Router,
          useValue: {
            navigate() {},
            events: routerEvents,
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditCardComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement.nativeElement;
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

  describe('when the user come from bank details...', () => {
    it('should show the back anchor', () => {
      routerEvents.next(new NavigationEnd(1, component.BANK_DETAILS_URL, 'url2'));

      component.ngOnInit();
      fixture.detectChanges();

      expect(el.querySelectorAll(backAnchorSelector).length).toBe(1);
    });
  });

  describe(`when the user don't come from bank details...`, () => {
    it('should NOT show the back anchor', () => {
      routerEvents.next(new NavigationEnd(1, '', 'url2'));

      component.ngOnInit();
      fixture.detectChanges();

      expect(el.querySelectorAll(backAnchorSelector).length).not.toBe(1);
    });
  });
});
