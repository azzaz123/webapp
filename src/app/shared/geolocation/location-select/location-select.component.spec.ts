import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { LocationSelectComponent } from './location-select.component';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MockModal } from '../../../../test/utils';
import { USER_ADDRESS, USER_LATITUDE, USER_LONGITUDE } from '../../../../test/fixtures/user.fixtures';
import { MAPS_RESULT } from '../../../../test/fixtures/google-maps.fixtures';

describe('LocationSelectComponent', () => {
  let component: LocationSelectComponent;
  let fixture: ComponentFixture<LocationSelectComponent>;
  let fb: FormBuilder;
  let modalService: NgbModal;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule
      ],
      providers: [
        {
          provide: NgbModal, useClass: MockModal
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
    component.name = 'location';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
    it('should not mark address as dirty', () => {
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
        spyOn(modalService, 'open').and.returnValue({
          result: Promise.resolve(MAPS_RESULT)
        });
        component.open(element);
        tick(100);
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
        expect(component.form.get('location.address').value).toEqual(USER_ADDRESS);
        expect(component.form.get('location.latitude').value).toEqual(USER_LATITUDE);
        expect(component.form.get('location.longitude').value).toEqual(USER_LONGITUDE);
      });
    });
    describe('without result', () => {
      beforeEach(fakeAsync(() => {
        spyOn(modalService, 'open').and.returnValue({
          result: Promise.resolve({})
        });
        component.open(element);
        tick(100);
      }));
      it('should NOT set location', () => {
        expect(component.form.get('location.address').value).toEqual('');
        expect(component.form.get('location.latitude').value).toEqual('');
        expect(component.form.get('location.longitude').value).toEqual('');
      });
    });
    describe('with form values', () => {
      it('should set location on modal instance', fakeAsync(() => {
        let spy = jasmine.createSpy('setLocation');
        spyOn(modalService, 'open').and.returnValue({
          result: Promise.resolve({}),
          componentInstance: {
            setLocation: spy
          }
        });
        component.form.get('location.address').setValue(USER_ADDRESS);
        component.form.get('location.latitude').setValue(USER_LATITUDE);
        component.form.get('location.longitude').setValue(USER_LONGITUDE);
        component.open(element);
        tick(100);
        expect(spy).toHaveBeenCalledWith(USER_ADDRESS, USER_LATITUDE, USER_LONGITUDE);
      }));
    });

  });


});
