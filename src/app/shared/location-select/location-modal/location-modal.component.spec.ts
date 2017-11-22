import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { LocationModalComponent } from './location-modal.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MapsAPILoader } from '@agm/core';
import { MAPS_RESULT } from '../../../../../test/fixtures/google-maps.fixtures';
import { USER_ADDRESS, USER_LATITUDE, USER_LONGITUDE } from '../../../../../test/fixtures/user.fixtures';

describe('LocationModalComponent', () => {
  let component: LocationModalComponent;
  let fixture: ComponentFixture<LocationModalComponent>;
  let mapsAPILoader: MapsAPILoader;
  let activeModal: NgbActiveModal;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LocationModalComponent],
      providers: [
        {
          provide: NgbActiveModal, useValue: {
          close() {
          }
        }
        },
        {
          provide: MapsAPILoader, useValue: {
          load() {
            return Promise.resolve();
          }
        }
        }
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationModalComponent);
    mapsAPILoader = TestBed.get(MapsAPILoader);
    activeModal = TestBed.get(NgbActiveModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    describe('with result', () => {
      beforeEach(() => {
        spyOn(window['google'].maps.places, 'Autocomplete').and.returnValue({
          addListener(name, callback) {
            callback();
          },
          getPlace() {
            return MAPS_RESULT;
          }
        });
      });
      it('should focus search element', () => {
        component.ngOnInit();
        expect(component.searchElementRef.nativeElement.hasFocus);
      });
      it('should loads maps api', () => {
        spyOn(mapsAPILoader, 'load').and.callThrough();
        component.ngOnInit();
        expect(mapsAPILoader.load).toHaveBeenCalled();
      });
      it('should set location', fakeAsync(() => {
        component.ngOnInit();
        tick();
        expect(component['result']).toEqual(MAPS_RESULT);
        expect(component.latitude).toBe(USER_LATITUDE);
        expect(component.longitude).toBe(USER_LONGITUDE);
        expect(component.zoom).toBe(16);
      }));
    });
    describe('without result', () => {
      it('should not set location', fakeAsync(() => {
        spyOn(window['google'].maps.places, 'Autocomplete').and.returnValue({
          addListener(name, callback) {
            callback();
          },
          getPlace() {
            return;
          }
        });
        component.ngOnInit();
        tick();
        expect(component['result']).toBeNull();
      }));
    });
  });

  describe('close', () => {
    it('should close modal', () => {
      spyOn(activeModal, 'close');
      component['result'] = MAPS_RESULT;
      component.close();
      expect(activeModal.close).toHaveBeenCalledWith(MAPS_RESULT);
    });
  });

  describe('setLocation', () => {
    it('should set location', () => {
      component.setLocation(USER_ADDRESS, USER_LATITUDE, USER_LONGITUDE);
      expect(component.searchControl.value).toBe(USER_ADDRESS);
      expect(component.latitude).toBe(USER_LATITUDE);
      expect(component.longitude).toBe(USER_LONGITUDE);
      expect(component.zoom).toBe(16);
    });
  });
});
