import { of } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ButtonComponent } from '@shared/button/button.component';
import { LocationSelectorModal } from './select-location-modal.component';
import { UserService } from '@core/user/user.service';
import { FormBuilder } from '@angular/forms';
import { ErrorsService } from '@core/errors/errors.service';
import { MockErrorService } from '@fixtures/error.fixtures.spec';

describe('BumpSuggestionModalComponent', () => {
  let component: LocationSelectorModal;
  let fixture: ComponentFixture<LocationSelectorModal>;
  let activeModal: NgbActiveModal;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LocationSelectorModal, ButtonComponent],
      providers: [
        FormBuilder,
        {
          provide: UserService,
          useValue: {
            updateLocation() {
              return of({});
            },
            updateSearchLocationCookies() {},
          },
        },
        {
          provide: NgbActiveModal,
          useValue: {
            close() {},
          },
        },
        {
          provide: ErrorsService,
          useClass: MockErrorService,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationSelectorModal);
    component = fixture.componentInstance;
    activeModal = TestBed.inject(NgbActiveModal);
    userService = TestBed.inject(UserService);
    fixture.detectChanges();
  });

  describe('Click on submit', () => {
    beforeEach(() => {
      spyOn(userService, 'updateLocation').and.callThrough();
      fixture.detectChanges();
    });
    describe('and has invalid data', () => {
      it('should not call service', () => {
        spyOn(userService, 'updateLocation').and.callThrough();

        fixture.detectChanges();

        const button: HTMLElement = fixture.debugElement.query(By.directive(ButtonComponent)).nativeElement;
        button.click();

        expect(userService.updateLocation).not.toHaveBeenCalled();
      });
    });
    describe('and is loading', () => {
      it('should not call service', () => {
        spyOn(userService, 'updateLocation').and.callThrough();

        component.locationForm.patchValue({
          address: 'AAA',
          latitud: 1123,
          longitud: 1123,
        });
        component.isLoading = true;
        fixture.detectChanges();

        const button: HTMLElement = fixture.debugElement.query(By.directive(ButtonComponent)).nativeElement;
        button.click();

        expect(userService.updateLocation).not.toHaveBeenCalled();
      });
    });
  });
});
