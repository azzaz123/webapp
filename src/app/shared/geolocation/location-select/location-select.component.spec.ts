import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { LOCATION_MODAL_TIMEOUT, LocationSelectComponent } from './location-select.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { USER_LOCATION_COORDINATES } from '../../../../tests/user.fixtures.spec';
import { CookieService } from 'ngx-cookie';
import { UserService } from '../../../core/user/user.service';
import { Observable } from 'rxjs/Observable';
import { USER_LOCATION, MOCK_USER } from 'shield';

describe('LocationSelectComponent', () => {
  let component: LocationSelectComponent;
  let fixture: ComponentFixture<LocationSelectComponent>;
  let fb: FormBuilder;
  let modalService: NgbModal;
  const componentInstance: any = {
    init: jasmine.createSpy('init')
  };
  let cookieService: CookieService;
  let userService: UserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule
      ],
      providers: [
        {
          provide: NgbModal, useValue: {
          open() {
            return {
              componentInstance: componentInstance,
              result: Promise.resolve(USER_LOCATION_COORDINATES)
            }
          }
        }
        },
        {
          provide: CookieService, useValue: {
          get() {
          }
        }
        },
        {
          provide: UserService, useValue: {
          user: MOCK_USER,
          updateLocation() {
            return Observable.of(USER_LOCATION);
          }
        }
        }
      ],
      declarations: [LocationSelectComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationSelectComponent);
    fb = TestBed.get(FormBuilder);
    modalService = TestBed.get(NgbModal);
    component = fixture.componentInstance;
    component.form = fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      location: fb.group({
        address: ['', [Validators.required]],
        latitude: ['', [Validators.required]],
        longitude: ['', [Validators.required]],
      })
    });
    cookieService = TestBed.get(CookieService);
    userService = TestBed.get(UserService);
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
        blur() {
        }
      };
      spyOn(element, 'blur');
      component.ngOnChanges();
    }));

    describe('with result', () => {
      beforeEach(fakeAsync(() => {
        spyOn(modalService, 'open').and.callThrough();
        spyOn(userService, 'updateLocation').and.callThrough();

        component.open(element);
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
    });

    describe('with form values', () => {
      it('should set location on modal instance', fakeAsync(() => {
        component.form.get('location.address').setValue(USER_LOCATION_COORDINATES.name);
        component.form.get('location.latitude').setValue(USER_LOCATION_COORDINATES.latitude);
        component.form.get('location.longitude').setValue(USER_LOCATION_COORDINATES.longitude);

        component.open(element);
        tick(LOCATION_MODAL_TIMEOUT);

        expect(componentInstance.init).toHaveBeenCalledWith(USER_LOCATION_COORDINATES);
      }));
    });

    describe('with cookies', () => {
      it('should set coordinates from cookie', fakeAsync(() => {
        spyOn(cookieService, 'get').and.returnValues(
          USER_LOCATION_COORDINATES.latitude,
          USER_LOCATION_COORDINATES.longitude,
          USER_LOCATION_COORDINATES.name);

        component.open(element);
        tick(LOCATION_MODAL_TIMEOUT);

        expect(componentInstance.init).toHaveBeenCalledWith(USER_LOCATION_COORDINATES);
      }));
    });
  });
});
