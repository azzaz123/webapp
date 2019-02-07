import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { GeolocationComponent } from './geolocation.component';
import { Observable } from 'rxjs';
import { GEOLOCATION_DATA_WEB } from '../../../tests/geolocation.fixtures.spec';
import { COORDINATE_DATA_WEB } from '../../../tests/address.fixtures.spec';
import { EventService } from '../../core/event/event.service';
import { GeolocationService } from '../../core/geolocation/geolocation.service';
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
            },
            get(key) {
              return 'Barcelona, Spain';
            },
            remove(key) {
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
    eventService = TestBed.get(EventService);
    geolocationService = TestBed.get(GeolocationService);
    cookieService = TestBed.get(CookieService);
  });

  describe('ngOnChanges', () => {
    it('should set model.description with value', () => {
      const LOCATION_NAME = 'Barcelona';
      component.value = LOCATION_NAME;
      component.ngOnChanges();
      expect(component.model.description).toBe(LOCATION_NAME);
    });
  });

  describe('search', (): void => {
    beforeEach(() => {
      spyOn(geolocationService, 'search').and.callThrough();
    });
    it('should search for locations from input text', () => {
      const input = 'Barcelona';
      component.search(Observable.of(input)).subscribe();
      expect(geolocationService.search).toHaveBeenCalled();
    });

    it('should NOT search for locations from input < 3', () => {
      const input = 'Ba';
      component.search(Observable.of(input)).subscribe();
      expect(geolocationService.search).not.toHaveBeenCalled();
    });
  });

  describe('select item', (): void => {

    beforeEach(() => {
      spyOn(component.newCoordinate, 'emit');
      spyOn(cookieService, 'put');
    });

    it('should emit an event with the selected item', (done) => {
      jasmine.clock().uninstall();
      jasmine.clock().install();
      const currentDate = new Date();
      const expirationDate = new Date(currentDate.getTime() + ( 15 * 60 * 1000));
      jasmine.clock().mockDate(currentDate);
      const cookieOptions = {expires: expirationDate, domain: '.wallapop.com'};
      done();

      component.selectItem(GEOLOCATION_DATA_WEB[0]);

      expect(component.newCoordinate.emit).toHaveBeenCalledWith(COORDINATE_DATA_WEB);
      expect(cookieService.put).toHaveBeenCalledWith('searchLat', COORDINATE_DATA_WEB.latitude.toString(), cookieOptions);
      expect(cookieService.put).toHaveBeenCalledWith('searchLng', COORDINATE_DATA_WEB.longitude.toString(), cookieOptions);
      expect(cookieService.put).toHaveBeenCalledWith('searchPosName', GEOLOCATION_DATA_WEB[0].item.description, cookieOptions);

      jasmine.clock().uninstall();
    });

    it('should not save cookies if updateLocation false', () => {
      component.updateLocation = false;

      component.selectItem(GEOLOCATION_DATA_WEB[0]);

      expect(cookieService.put).not.toHaveBeenCalled();
    });
  });

  describe('ngOnInit', (): void => {
    describe('when cookie searchPosName is not informed', (): void => {
      it('the location search field should not have any value', () => {
        spyOn(cookieService, 'get').and.returnValue(undefined);
        fixture.detectChanges();
        expect(component.model.description).toBe('');
      });
    });

    describe('when cookie searchPosName is informed', (): void => {
      it('the location search field should have the same value of the cookie', () => {
        fixture.detectChanges();
        expect(component.model.description).toBe('Barcelona, Spain');
      });
    });
  });

});
