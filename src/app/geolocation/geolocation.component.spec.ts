///<reference path="../../tests/address.fixtures.ts"/>
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { GeolocationComponent } from './geolocation.component';
import { Observable } from "rxjs/Observable";
import { GeolocationService } from "../core/geolocation/geolocation.service";
import { EventService } from "../core/event/event.service";
import { GEOLOCATION_DATA_WEB } from "../../tests/geolocation.fixtures";
import { ADDRESS_DATA_WEB } from "../../tests/address.fixtures";

describe('GeolocationComponent', () => {
  let component: GeolocationComponent;
  let fixture: ComponentFixture<GeolocationComponent>;
  let eventService: EventService;
  let geolocationService: GeolocationService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeolocationComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {provide: GeolocationService, useValue: {
        search: () => {
          return Observable.of(GEOLOCATION_DATA_WEB);
        },
        geocode: () => {
          return Observable.of(ADDRESS_DATA_WEB);
        }
      }}, EventService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeolocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    eventService = TestBed.get(EventService);
    geolocationService = TestBed.get(GeolocationService);
  });

  describe('select item', () => {
    it('should emit the event UPDATE_COORDINATE', () => {
      component.selectItem(GEOLOCATION_DATA_WEB);
      eventService.emit(EventService.UPDATE_COORDINATE, {'lat' : 41.38506389999999, 'lng' : 2.1734035});
    });

  });

  describe('search', (): void => {
    beforeEach(() => {
      spyOn(geolocationService, 'search').and.callThrough();
    });
    /*it('should search for locations from input text', () => {
      let input = 'Barcelona';
      component.search(Observable.of(input));
      expect(geolocationService.search).toHaveBeenCalled();
    });*/

    it('should NOT search for locations from input < 3', () => {
      let input = 'Ba';
      component.search(Observable.of(input));
      expect(geolocationService.search).not.toHaveBeenCalled();
    });
  });

});
