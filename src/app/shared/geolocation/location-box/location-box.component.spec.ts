import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { LocationBoxComponent } from './location-box.component';
import { UserService } from '../../../core/user/user.service';
import { of } from 'rxjs';
import { USER_LOCATION } from '../../../upload/upload-product/upload-product.component.spec';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MOCK_USER } from '../../../../tests/user.fixtures.spec';

describe('LocationBoxComponent', () => {
  let component: LocationBoxComponent;
  let fixture: ComponentFixture<LocationBoxComponent>;
  let userService: UserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule
      ],
      declarations: [LocationBoxComponent],
      providers: [
        {
          provide: UserService, useValue: {
            me() {
              return of(MOCK_USER);
            }
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationBoxComponent);
    component = fixture.componentInstance;
    component.form = new FormGroup({
      location: new FormGroup({
        address: new FormControl(),
        latitude: new FormControl(),
        longitude: new FormControl(),
      })
    });
    component.name = 'location';
    fixture.detectChanges();
    userService = TestBed.inject(UserService);
  });

  describe('ngOnInit', () => {

    describe('if a location is provided', () => {
      beforeEach(() => {
        component.location = MOCK_USER.location;

        spyOn(userService, 'me').and.callThrough();

        component.ngOnInit();
      });

      it('should not call me', () => {
        expect(userService.me).not.toHaveBeenCalled();
      });

      it('should set coordinates from provided location', () => {
        expect(component.coordinates.latitude).toEqual(MOCK_USER.location.approximated_latitude);
        expect(component.coordinates.longitude).toEqual(MOCK_USER.location.approximated_longitude);
      });
    });

    describe('if a location is not provided', () => {
      it('should call me and set user', () => {
        spyOn(userService, 'me').and.callThrough();

        component.ngOnInit();

        expect(userService.me).toHaveBeenCalled();
        expect(component.user).toEqual(MOCK_USER);
      });

      it('should add user location values', fakeAsync(() => {
        component.ngOnInit();

        tick();

        expect(component.form.get('location.address').value).toBe(USER_LOCATION.title);
        expect(component.form.get('location.latitude').value).toBe(USER_LOCATION.approximated_latitude);
        expect(component.form.get('location.longitude').value).toBe(USER_LOCATION.approximated_longitude);
      }));
    });

  });

  describe('Emit Location', () => {
    it('should emit location updated event', () => {
      spyOn(component.locationSelected, 'emit');

      component.emitLocation();

      expect(component.locationSelected.emit).toHaveBeenCalled();
    });
  });

});
