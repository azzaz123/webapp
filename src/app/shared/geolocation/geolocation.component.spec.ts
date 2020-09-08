import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { GeolocationComponent } from './geolocation.component';
import { Observable, of } from 'rxjs';
import { GEOLOCATION_DATA_WEB } from '../../../tests/geolocation.fixtures.spec';
import { COORDINATE_DATA_WEB } from '../../../tests/address.fixtures.spec';
import { EventService } from '../../core/event/event.service';
import { GeolocationService } from '../../core/geolocation/geolocation.service';
import { CookieService } from 'ngx-cookie';
import { UserService } from '../../core/user/user.service';

describe('GeolocationComponent', () => {
  let component: GeolocationComponent;
  let fixture: ComponentFixture<GeolocationComponent>;
  let eventService: EventService;
  let geolocationService: GeolocationService;
  let cookieService: CookieService;
  let userService: UserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeolocationComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: GeolocationService, useValue: {
            search: () => {
              return of(GEOLOCATION_DATA_WEB);
            },
            geocode: () => {
              return of(COORDINATE_DATA_WEB);
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
        {
          provide: UserService, useValue: {
            updateSearchLocationCookies() {
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
    eventService = TestBed.inject(EventService);
    geolocationService = TestBed.inject(GeolocationService);
    cookieService = TestBed.inject(CookieService);
    userService = TestBed.inject(UserService);
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
      component.search(of(input)).subscribe();
      expect(geolocationService.search).toHaveBeenCalled();
    });

    it('should NOT search for locations from input < 3', () => {
      const input = 'Ba';
      component.search(of(input)).subscribe();
      expect(geolocationService.search).not.toHaveBeenCalled();
    });
  });

  describe('select item', (): void => {

    beforeEach(() => {
      spyOn(component.newCoordinate, 'emit');
      spyOn(userService, 'updateSearchLocationCookies').and.callThrough();
    });

    it('should emit an event with the selected item', (done) => {
      const currentDate = new Date();
      const newLocation = {
        latitude: COORDINATE_DATA_WEB.latitude,
        longitude: COORDINATE_DATA_WEB.longitude,
        name: GEOLOCATION_DATA_WEB[0].item.description
      };
      done();

      component.selectItem(GEOLOCATION_DATA_WEB[0]);

      expect(component.newCoordinate.emit).toHaveBeenCalledWith(COORDINATE_DATA_WEB);
      expect(userService.updateSearchLocationCookies).toHaveBeenCalledWith(newLocation);
    });

    it('should not save cookies if updateLocation false', () => {
      component.updateLocation = false;

      component.selectItem(GEOLOCATION_DATA_WEB[0]);

      expect(userService.updateSearchLocationCookies).toHaveBeenCalledTimes(0);
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
