import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationModalComponent } from './location-modal.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { USER_LOCATION_COORDINATES } from '../../../../../tests/user.fixtures.spec';
import {
  DEFAULT_COORDINATES,
  MAP_ZOOM_GENERAL,
  MAP_ZOOM_MARKER,
} from '../../here-maps/here-maps.component';

describe('LocationModalComponent', () => {
  let component: LocationModalComponent;
  let fixture: ComponentFixture<LocationModalComponent>;
  let activeModal: NgbActiveModal;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LocationModalComponent],
      providers: [
        {
          provide: NgbActiveModal,
          useValue: {
            close() {},
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationModalComponent);
    activeModal = TestBed.inject(NgbActiveModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('close', () => {
    it('should close modal', () => {
      spyOn(activeModal, 'close');
      component.coordinates = USER_LOCATION_COORDINATES;
      component.close();
      expect(activeModal.close).toHaveBeenCalledWith(USER_LOCATION_COORDINATES);
    });
  });

  describe('init', () => {
    it('should set location', () => {
      component.init(USER_LOCATION_COORDINATES);
      expect(component.coordinates).toEqual(USER_LOCATION_COORDINATES);
      expect(component.zoom).toBe(MAP_ZOOM_MARKER);
    });
    it('should set default location', () => {
      component.init();
      expect(component.coordinates).toEqual(DEFAULT_COORDINATES);
      expect(component.zoom).toBe(MAP_ZOOM_GENERAL);
    });
  });

  describe('onCoordinateUpdate', () => {
    it('should set coordinates', () => {
      component.onCoordinateUpdate(USER_LOCATION_COORDINATES);
      expect(component.coordinates).toEqual(USER_LOCATION_COORDINATES);
    });
  });
});
