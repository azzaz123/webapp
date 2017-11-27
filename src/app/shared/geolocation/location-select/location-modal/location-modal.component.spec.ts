import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationModalComponent } from './location-modal.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { USER_LOCATION_COORDINATES } from '../../../../../tests/user.fixtures';

describe('LocationModalComponent', () => {
  let component: LocationModalComponent;
  let fixture: ComponentFixture<LocationModalComponent>;
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
    activeModal = TestBed.get(NgbActiveModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('close', () => {
    it('should close modal', () => {
      spyOn(activeModal, 'close');
      component.coordinates = USER_LOCATION_COORDINATES;
      component.close();
      expect(activeModal.close).toHaveBeenCalledWith(USER_LOCATION_COORDINATES);
    });
  });

  describe('setLocation', () => {
    it('should set location', () => {
      component.setLocation(USER_LOCATION_COORDINATES.name, USER_LOCATION_COORDINATES.latitude, USER_LOCATION_COORDINATES.longitude);
      expect(component.searchControl.value).toBe(USER_LOCATION_COORDINATES.name);
      expect(component.latitude).toBe(USER_LOCATION_COORDINATES.latitude);
      expect(component.longitude).toBe(USER_LOCATION_COORDINATES.longitude);
      expect(component.zoom).toBe(16);
    });
  });

  describe('onCoordinateUpdate', () => {
    it('should set coordinates', () => {
      component.onCoordinateUpdate(USER_LOCATION_COORDINATES);
      expect(component.coordinates).toEqual(USER_LOCATION_COORDINATES);
    });
  });
});
