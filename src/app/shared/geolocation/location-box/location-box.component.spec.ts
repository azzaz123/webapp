import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MOCK_USER } from 'shield';
import { LocationBoxComponent } from './location-box.component';
import { UserService } from '../../../core/user/user.service';
import { Observable } from 'rxjs/Observable';
import { USER_LOCATION } from '../../../catalog/upload/upload-product/upload-product.component.spec';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

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
            return Observable.of(MOCK_USER);
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
    userService = TestBed.get(UserService);
  });

  describe('ngOnInit', () => {

    it('should call me and set user', () => {
      spyOn(userService, 'me').and.callThrough();

      component.ngOnInit();

      expect(userService.me).toHaveBeenCalled();
      expect(component.user).toEqual(MOCK_USER);
    });

    it('should add user location values', () => {
      component.ngOnInit();

      expect(component.form.get('location.address').value).toBe(USER_LOCATION.full_address);
      expect(component.form.get('location.latitude').value).toBe(USER_LOCATION.approximated_latitude);
      expect(component.form.get('location.longitude').value).toBe(USER_LOCATION.approximated_longitude);
    });
  });
});
