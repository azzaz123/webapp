import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';

import { LOCATION_MODAL_TIMEOUT, LocationSelectComponent } from './location-select.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MOCK_USER, USER_LOCATION, USER_LOCATION_COORDINATES } from '../../../../tests/user.fixtures.spec';
import { UserService } from '../../../core/user/user.service';
import { of } from 'rxjs';

describe('LocationSelectComponent', () => {
  let component: LocationSelectComponent;
  let fixture: ComponentFixture<LocationSelectComponent>;
  let fb: FormBuilder;
  let modalService: NgbModal;
  const componentInstance: any = {
    init: jasmine.createSpy('init'),
  };
  let userService: UserService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [ReactiveFormsModule],
        providers: [
          {
            provide: NgbModal,
            useValue: {
              open() {
                return {
                  componentInstance: componentInstance,
                  result: Promise.resolve(USER_LOCATION_COORDINATES),
                };
              },
            },
          },
          {
            provide: UserService,
            useValue: {
              user: MOCK_USER,
              updateLocation() {
                return of(USER_LOCATION);
              },
            },
          },
        ],
        declarations: [LocationSelectComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationSelectComponent);
    fb = TestBed.inject(FormBuilder);
    modalService = TestBed.inject(NgbModal);
    component = fixture.componentInstance;
    component.form = fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      location: fb.group({
        address: ['', [Validators.required]],
        latitude: ['', [Validators.required]],
        longitude: ['', [Validators.required]],
        approximated_location: false,
      }),
    });
    userService = TestBed.inject(UserService);
    component.name = 'location';
    fixture.detectChanges();
  });

  describe('ngOnChanges', () => {
    it('should set nothing', () => {
      component.form = null;

      component.ngOnChanges();

      expect(component['control']).toBeUndefined();
      expect(component['latitudeControl']).toBeUndefined();
      expect(component['longitudeControl']).toBeUndefined();
    });

    it('should set controls', () => {
      component.ngOnChanges();

      expect(component['control']).not.toBeUndefined();
      expect(component['latitudeControl']).not.toBeUndefined();
      expect(component['longitudeControl']).not.toBeUndefined();
    });

    it('should not mark address as dirty', () => {
      component.ngOnChanges();

      expect(component.form.get('location.address').dirty).toBeFalsy();
    });

    it('should mark address as dirty', () => {
      component.form.get('location.address').setValue('test');

      component.ngOnChanges();

      expect(component.form.get('location.address').dirty).toBeTruthy();
    });
  });

  describe('open', () => {
    let element: any;
    beforeEach(fakeAsync(() => {
      element = {
        blur() {},
      };
      spyOn(element, 'blur');
      component.ngOnChanges();
    }));

    describe('with result', () => {
      beforeEach(fakeAsync(() => {
        spyOn(modalService, 'open').and.callThrough();
        spyOn(userService, 'updateLocation').and.callThrough();
        spyOn(component.locationSelected, 'emit');
      }));

      describe('with updateLocation true', () => {
        beforeEach(fakeAsync(() => {
          component.onFocus(element);
          tick(LOCATION_MODAL_TIMEOUT);
        }));

        it('should blur element', () => {
          expect(element.blur).toHaveBeenCalled();
        });

        it('should mark address as dirty', () => {
          expect(component.form.get('location.address').dirty).toBeTruthy();
        });

        it('should open modal', () => {
          expect(modalService.open).toHaveBeenCalled();
        });

        it('should set location', () => {
          expect(component.form.get('location.address').value).toEqual(USER_LOCATION_COORDINATES.name);
          expect(component.form.get('location.latitude').value).toEqual(USER_LOCATION_COORDINATES.latitude);
          expect(component.form.get('location.longitude').value).toEqual(USER_LOCATION_COORDINATES.longitude);
        });

        it('should call init with no params', () => {
          expect(componentInstance.init).toHaveBeenCalled();
        });

        it('should call updateLocation', () => {
          expect(userService.updateLocation).toHaveBeenCalledWith(USER_LOCATION_COORDINATES);
        });

        it('should set user location', () => {
          expect(userService.user.location).toEqual(USER_LOCATION);
        });

        it('should emit an update location event', () => {
          expect(component.locationSelected.emit).toHaveBeenCalled();
        });
      });

      describe('with updateLocation false', () => {
        beforeEach(fakeAsync(() => {
          component.updateLocation = false;
          component.onFocus(element);
          tick(LOCATION_MODAL_TIMEOUT);
        }));

        it('should blur element', () => {
          expect(element.blur).toHaveBeenCalled();
        });

        it('should mark address as dirty', () => {
          expect(component.form.get('location.address').dirty).toBeTruthy();
        });

        it('should open modal', () => {
          expect(modalService.open).toHaveBeenCalled();
        });

        it('should set location', () => {
          expect(component.form.get('location.address').value).toEqual(USER_LOCATION_COORDINATES.name);
          expect(component.form.get('location.latitude').value).toEqual(USER_LOCATION_COORDINATES.latitude);
          expect(component.form.get('location.longitude').value).toEqual(USER_LOCATION_COORDINATES.longitude);
        });

        it('should call init with no params', () => {
          expect(componentInstance.init).toHaveBeenCalled();
        });

        it('should not call updateLocation', () => {
          expect(userService.updateLocation).not.toHaveBeenCalled();
        });

        it('should emit an update location event', () => {
          expect(component.locationSelected.emit).toHaveBeenCalled();
        });
      });
    });

    describe('with form values', () => {
      it('should set location on modal instance', fakeAsync(() => {
        component.form.get('location.address').setValue(USER_LOCATION_COORDINATES.name);
        component.form.get('location.latitude').setValue(USER_LOCATION_COORDINATES.latitude);
        component.form.get('location.longitude').setValue(USER_LOCATION_COORDINATES.longitude);
        component.form.get('location.approximated_location').setValue(true);

        component.onFocus(element);
        tick(LOCATION_MODAL_TIMEOUT);

        expect(componentInstance.init).toHaveBeenCalledWith(
          {
            ...USER_LOCATION_COORDINATES,
            approximated_location: true,
          },
          true
        );
      }));
    });
  });
});
