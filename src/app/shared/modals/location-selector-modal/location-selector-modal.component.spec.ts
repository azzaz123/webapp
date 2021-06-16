import { of, throwError } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ButtonComponent } from '@shared/button/button.component';
import { LocationSelectorModal } from './location-selector-modal.component';
import { UserService } from '@core/user/user.service';
import { FormBuilder } from '@angular/forms';
import { ErrorsService } from '@core/errors/errors.service';
import { MockErrorService } from '@fixtures/error.fixtures.spec';
import { MOCK_USER_NO_LOCATION } from '@private/features/upload/pages/upload-car/upload-car.component.spec';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';

describe('BumpSuggestionModalComponent', () => {
  let component: LocationSelectorModal;
  let fixture: ComponentFixture<LocationSelectorModal>;
  let activeModal: NgbActiveModal;
  let userService: UserService;
  let errorService: ErrorsService;
  let updateLocationSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LocationSelectorModal, ButtonComponent],
      providers: [
        FormBuilder,
        {
          provide: UserService,
          useValue: {
            user: MOCK_USER_NO_LOCATION,
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
    errorService = TestBed.inject(ErrorsService);
    updateLocationSpy = spyOn(userService, 'updateLocation').and.callThrough();
    fixture.detectChanges();
  });

  describe('Click on submit', () => {
    describe('and has invalid data', () => {
      it('should not call service', () => {
        const button: HTMLElement = fixture.debugElement.query(By.directive(ButtonComponent)).nativeElement;
        button.click();

        expect(userService.updateLocation).not.toHaveBeenCalled();
      });
    });
    describe('and is loading', () => {
      it('should not call service', () => {
        component.locationForm.patchValue({
          location: {
            address: 'AAA',
            latitude: 1123,
            longitude: 1123,
          },
        });
        component.isLoading = true;
        fixture.detectChanges();

        const button: HTMLElement = fixture.debugElement.query(By.directive(ButtonComponent)).nativeElement;
        button.click();

        expect(userService.updateLocation).not.toHaveBeenCalled();
      });
    });
    describe('and data is saved sucessfully', () => {
      const lat = 1.485647;
      const long = 4.999445;
      const address = 'address';

      const expectedLocation = {
        latitude: lat,
        longitude: long,
        name: address,
      };
      beforeEach(() => {
        component.locationForm.patchValue({
          location: {
            address: address,
            latitude: lat,
            longitude: long,
          },
        });
        fixture.detectChanges();
      });
      it('should call service', () => {
        const button: HTMLElement = fixture.debugElement.query(By.directive(ButtonComponent)).nativeElement;
        button.click();

        expect(userService.updateLocation).toHaveBeenCalledTimes(1);
        expect(userService.updateLocation).toHaveBeenCalledWith(expectedLocation);
      });
      it('should not show loading', () => {
        const button: HTMLElement = fixture.debugElement.query(By.directive(ButtonComponent)).nativeElement;
        button.click();

        expect(component.isLoading).toBeFalsy();
      });
      it('should close modal', () => {
        spyOn(activeModal, 'close').and.callThrough();
        const button: HTMLElement = fixture.debugElement.query(By.directive(ButtonComponent)).nativeElement;
        button.click();

        expect(activeModal.close).toHaveBeenCalledTimes(1);
        expect(activeModal.close).toHaveBeenCalledWith(true);
      });
      it('should set new location', () => {
        updateLocationSpy.and.returnValue(of(expectedLocation));

        const button: HTMLElement = fixture.debugElement.query(By.directive(ButtonComponent)).nativeElement;
        button.click();

        expect(userService.user.location).toEqual(expectedLocation);
      });
      it('should update location cookies', () => {
        spyOn(userService, 'updateSearchLocationCookies').and.callThrough();

        const button: HTMLElement = fixture.debugElement.query(By.directive(ButtonComponent)).nativeElement;
        button.click();

        expect(userService.updateSearchLocationCookies).toHaveBeenCalledTimes(1);
        expect(userService.updateSearchLocationCookies).toHaveBeenCalledWith(expectedLocation);
      });
    });
    describe('and request fails', () => {
      const lat = 1.485647;
      const long = 4.999445;
      const address = 'address';

      const expectedLocation = {
        latitude: lat,
        longitude: long,
        name: address,
      };
      beforeEach(() => {
        updateLocationSpy.and.returnValue(throwError('error'));

        component.locationForm.patchValue({
          location: {
            address: address,
            latitude: lat,
            longitude: long,
          },
        });
        fixture.detectChanges();
      });
      it('should not close modal', () => {
        spyOn(activeModal, 'close').and.callThrough();
        const button: HTMLElement = fixture.debugElement.query(By.directive(ButtonComponent)).nativeElement;
        button.click();

        expect(activeModal.close).not.toHaveBeenCalled();
      });
      it('should not set new location', () => {
        const button: HTMLElement = fixture.debugElement.query(By.directive(ButtonComponent)).nativeElement;
        button.click();

        expect(userService.user.location).not.toEqual(expectedLocation);
      });
      it('should not update location cookies', () => {
        spyOn(userService, 'updateSearchLocationCookies').and.callThrough();

        const button: HTMLElement = fixture.debugElement.query(By.directive(ButtonComponent)).nativeElement;
        button.click();

        expect(userService.updateSearchLocationCookies).not.toHaveBeenCalled();
      });
      it('should show error', () => {
        spyOn(errorService, 'i18nError').and.callThrough();

        const button: HTMLElement = fixture.debugElement.query(By.directive(ButtonComponent)).nativeElement;
        button.click();

        expect(errorService.i18nError).toHaveBeenCalledTimes(1);
        expect(errorService.i18nError).toHaveBeenCalledWith(TRANSLATION_KEY.DEFAULT_ERROR_MESSAGE);
      });
      it('should not show loading', () => {
        const button: HTMLElement = fixture.debugElement.query(By.directive(ButtonComponent)).nativeElement;
        button.click();

        expect(component.isLoading).toBeFalsy();
      });
    });
  });
});
