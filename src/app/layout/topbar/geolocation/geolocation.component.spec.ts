import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { GeolocationComponent } from './geolocation.component';
import { Observable } from 'rxjs/Observable';
import { GEOLOCATION_DATA_WEB } from '../../../../tests/geolocation.fixtures';
import { COORDINATE_DATA_WEB } from '../../../../tests/address.fixtures';
import { EventService } from '../../../core/event/event.service';
import { GeolocationService } from '../../../core/geolocation/geolocation.service';
import { CookieService } from 'ngx-cookie';

describe('GeolocationComponent', () => {
  let component: GeolocationComponent;
  let fixture: ComponentFixture<GeolocationComponent>;
  let eventService: EventService;
  let geolocationService: GeolocationService;
  let cookieService: CookieService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeolocationComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: GeolocationService, useValue: {
            search: () => {
              return Observable.of(GEOLOCATION_DATA_WEB);
            },
            geocode: () => {
              return Observable.of(COORDINATE_DATA_WEB);
            }
          }
        },
        {
          provide: CookieService, useValue: {
            put(key, value) {
            }
          }
        },
        EventService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeolocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    eventService = TestBed.get(EventService);
    geolocationService = TestBed.get(GeolocationService);
    cookieService = TestBed.get(CookieService);
  });

  describe('search', (): void => {
    beforeEach(() => {
      spyOn(geolocationService, 'search').and.callThrough();
    });
    it('should search for locations from input text', () => {
      let input = 'Barcelona';
      component.search(Observable.of(input)).subscribe();
      expect(geolocationService.search).toHaveBeenCalled();
    });

    it('should NOT search for locations from input < 3', () => {
      let input = 'Ba';
      component.search(Observable.of(input)).subscribe();
      expect(geolocationService.search).not.toHaveBeenCalled();
    });
  });

  describe('select item', (): void => {
    it('should emit an event with the selected item', () => {
      jasmine.clock().install();
      spyOn(component.newCoordinate, 'emit');
      spyOn(cookieService, 'put');
      component.selectItem(GEOLOCATION_DATA_WEB);
      const currentDate = new Date();
      const expirationDate = new Date(currentDate.getTime() + ( 15 * 60 * 1000));

      jasmine.clock().mockDate(currentDate);

      const cookieOptions = {expires: expirationDate, domain: '.wallapop.com'};

      expect(component.newCoordinate.emit).toHaveBeenCalledWith(COORDINATE_DATA_WEB);
      expect(cookieService.put).toHaveBeenCalledWith('searchLat', COORDINATE_DATA_WEB.latitude.toString(), cookieOptions);
      expect(cookieService.put).toHaveBeenCalledWith('searchLng', COORDINATE_DATA_WEB.longitude.toString(), cookieOptions);

      jasmine.clock().uninstall();
    });
  });

});
