// TODO: These tests need to be redone (fixed poorly to let Angular update work)

import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  HereMapsComponent,
  MAP_ZOOM_GENERAL,
  MAP_ZOOM_MARKER,
} from './here-maps.component';
import { USER_LOCATION_COORDINATES } from '../../../../tests/user.fixtures.spec';
import { HereMapsService } from './here-maps.service';
import { HereMapServiceMock } from '../../../../tests/here-maps-service.fixtures.spec';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

const ICON = { url: 'icon' };
const MARKER = { marker: 'marker' };
const CIRCLE = { circle: 'circle' };

const MockedMap = {
  setZoom: () => {},
  setCenter: () => {},
  addObject: () => {},
  removeObject: () => {},
};

describe('HereMapsComponent', () => {
  let component: HereMapsComponent;
  let fixture: ComponentFixture<HereMapsComponent>;
  let hereMapsService: HereMapsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HereMapsComponent],
      providers: [
        {
          provide: HereMapsService,
          useClass: HereMapServiceMock,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HereMapsComponent);
    component = fixture.componentInstance;
    component.coordinates = USER_LOCATION_COORDINATES;
    spyOn(component, 'createMap').and.returnValue(MockedMap);
    spyOn(component, 'createIcon').and.returnValue(ICON);
    spyOn(component, 'createCircle').and.returnValue(CIRCLE);
    spyOn(component, 'createMarker').and.returnValue(MARKER);
    spyOn(MockedMap, 'setZoom').and.callThrough();
    spyOn(MockedMap, 'setCenter').and.callThrough();
    spyOn(MockedMap, 'addObject').and.callThrough();
    spyOn(MockedMap, 'removeObject').and.callThrough();

    component.mapEl = {
      nativeElement: {},
    };
    hereMapsService = TestBed.inject(HereMapsService);
  });

  describe('ngAfterViewInit', () => {
    it('should prepare map', () => {
      component.ngAfterViewInit();

      expect(component.createMap).toHaveBeenCalledTimes(1);
      expect(MockedMap.setZoom).toHaveBeenCalledWith(MAP_ZOOM_GENERAL);
      expect(MockedMap.setCenter).toHaveBeenCalledWith({
        lat: USER_LOCATION_COORDINATES.latitude,
        lng: USER_LOCATION_COORDINATES.longitude,
      });
    });

    it('should add marker if zoom is the marker zoom', () => {
      component.zoom = MAP_ZOOM_MARKER;

      component.ngAfterViewInit();

      expect(component.createMarker).toHaveBeenCalledTimes(1);
      expect(MockedMap.addObject).toHaveBeenCalledWith(MARKER);
    });

    it('should add circle if zoom is the marker zoom and isApproximateLocation', () => {
      component.zoom = MAP_ZOOM_MARKER;
      component.isApproximateLocation = true;

      component.ngAfterViewInit();

      expect(component.createCircle).toHaveBeenCalledTimes(1);
      expect(MockedMap.addObject).toHaveBeenCalledWith(CIRCLE);
    });
  });

  describe('ngOnChanges', () => {
    beforeEach(() => {
      component.ngAfterViewInit();
      component.zoom = MAP_ZOOM_MARKER;
    });

    describe('not isApproximateLocation', () => {
      beforeEach(() => {
        component.ngOnChanges();
      });

      it('should add marker with icon', () => {
        expect(MockedMap.addObject).toHaveBeenCalledWith(MARKER);
      });

      it('should remove marker before adding a new one', () => {
        component.ngOnChanges();

        expect(MockedMap.removeObject).toHaveBeenCalledWith(MARKER);
      });
    });

    describe('isApproximateLocation', () => {
      beforeEach(() => {
        component.isApproximateLocation = true;

        component.ngOnChanges();
      });

      it('should add circle', () => {
        expect(MockedMap.addObject).toHaveBeenCalledWith(CIRCLE);
      });

      it('should remove circle before adding a new one', () => {
        component.ngOnChanges();

        expect(MockedMap.removeObject).toHaveBeenCalledWith(CIRCLE);
      });
    });

    describe('update coordinates', () => {
      afterEach(() => {
        it('should set map center and zoom', () => {
          expect(MockedMap.setZoom).toHaveBeenCalledWith(MAP_ZOOM_MARKER);
          expect(MockedMap.setCenter).toHaveBeenCalledWith({
            lat: USER_LOCATION_COORDINATES.latitude,
            lng: USER_LOCATION_COORDINATES.longitude,
          });
        });
      });
    });

    describe('loading map', () => {
      it('should show the spinner', () => {
        spyOn(hereMapsService, 'isLibraryLoading$').and.returnValue(of(true));
        component.ngAfterViewInit();
        fixture.detectChanges();
        const spinner: DebugElement = fixture.debugElement.query(
          By.css('.loading')
        );
        expect(spinner).toBeTruthy();
      });

      it('should not show the spinner', () => {
        spyOn(hereMapsService, 'isLibraryLoading$').and.returnValue(of(false));
        component.ngAfterViewInit();
        fixture.detectChanges();
        const spinner: DebugElement = fixture.debugElement.query(
          By.css('.loading')
        );
        expect(spinner).toBeFalsy();
      });
    });
  });
});
