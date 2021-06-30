import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, DebugElement, Input } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { GeolocationService } from '@core/geolocation/geolocation.service';
import { CoordinateMother, LatitudeMother, LongitudeMother } from '@fixtures/core';
import { MockGeolocationService, MOCK_LOCATION_SUGGESTIONS } from '@fixtures/core/geolocation/geolocation-service.fixtures.spec';
import { MockToastService } from '@fixtures/toast-service.fixtures.spec';
import { Toast } from '@layout/toast/core/interfaces/toast.interface';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchLocation } from '@public/features/search/core/services/interfaces/search-location.interface';
import { BubbleComponent } from '@public/shared/components/bubble/bubble.component';
import { SliderFormModule } from '@shared/form/components/slider/slider-form.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { of } from 'rxjs';
import { MockLocationFilterService } from '../../../../../../../../tests/core/geolocation/location-filter-service.fixtures.spec';
import { COMMON_FILTERS } from '../../../core/constants/filters/common/common-filters';
import { COMMON_CONFIGURATION_ID } from '../../../core/enums/configuration-ids/common-configuration-ids.enum';
import { AvailableFilterConfig } from '../../../core/types/available-filter-config.type';
import { FILTER_QUERY_PARAM_KEY } from '../../../enums/filter-query-param-key.enum';
import { FilterParameter } from '../../../interfaces/filter-parameter.interface';
import { FILTER_VARIANT } from '../../abstract-filter/abstract-filter.enum';
import { AbstractFilterModule } from '../../abstract-filter/abstract-filter.module';
import { DrawerPlaceholderTemplateComponent } from '../../abstract-select-filter/select-filter-template/drawer-placeholder-template.component';
import { GeolocationNotAvailableError } from '../errors/geolocation-not-available.error';
import { LocationFilterService } from '../services/location-filter.service';
import {
  DISTANCE_FACTOR,
  HERE_MAPS_COORDINATES,
  HERE_MAPS_ENDPOINT,
  HERE_MAPS_PARAMS,
  LocationFilterComponent,
  MAX_FILTER_DISTANCE,
  LOCATION_SEARCH_BOX_DEBOUNCE,
} from './location-filter.component';

const LATITUDE_MOCK = LatitudeMother.random();
const LONGITUDE_MOCK = LongitudeMother.random();
const DISTANCE_MOCK = 10000;

const MOCK_CITY_NAME = 'Rubí';

const MOCK_LOCATION_FILTER_PARAMS: FilterParameter[] = [
  { key: FILTER_QUERY_PARAM_KEY.latitude, value: `${LATITUDE_MOCK}` },
  { key: FILTER_QUERY_PARAM_KEY.longitude, value: `${LONGITUDE_MOCK}` },
  { key: FILTER_QUERY_PARAM_KEY.distance, value: `${DISTANCE_MOCK}` },
];

const MOCK_LOCATION_FILTER_PARAMS_WITHOUT_DISTANCE: FilterParameter[] = [
  { key: FILTER_QUERY_PARAM_KEY.latitude, value: `${LATITUDE_MOCK}` },
  { key: FILTER_QUERY_PARAM_KEY.longitude, value: `${LONGITUDE_MOCK}` },
];

const MOCK_SEARCH_LOCATION: SearchLocation = {
  [FILTER_QUERY_PARAM_KEY.latitude]: `${LATITUDE_MOCK}`,
  [FILTER_QUERY_PARAM_KEY.longitude]: `${LONGITUDE_MOCK}`,
};

@Component({
  selector: 'tsl-location-filter-test-component',
  template: `<tsl-location-filter [config]="config" [value]="value" [variant]="variant"></tsl-location-filter>`,
})
class LocationFilterTestComponent {
  @Input() variant: FILTER_VARIANT = FILTER_VARIANT.BUBBLE;
  @Input() config: AvailableFilterConfig;
  @Input() value: FilterParameter[] = [];
}

describe('LocationFilterComponent', () => {
  let component: LocationFilterComponent;
  let testComponent: LocationFilterTestComponent;
  let fixture: ComponentFixture<LocationFilterTestComponent>;
  let debugElement: DebugElement;
  let geolocationService: GeolocationService;
  let locationFilterService: LocationFilterService;
  let toastService: ToastService;

  const config = COMMON_FILTERS.find((config) => config.id === COMMON_CONFIGURATION_ID.LOCATION);
  const openFilterContent = () => {
    const bubble = fixture.debugElement.query(By.directive(BubbleComponent));

    bubble.nativeNode.click();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AbstractFilterModule,
        SvgIconModule,
        HttpClientTestingModule,
        SliderFormModule,
        NgbTypeaheadModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      declarations: [LocationFilterComponent, LocationFilterTestComponent, DrawerPlaceholderTemplateComponent],
      providers: [
        {
          provide: ToastService,
          useClass: MockToastService,
        },
        {
          provide: LocationFilterService,
          useClass: MockLocationFilterService,
        },
        {
          provide: GeolocationService,
          useClass: MockGeolocationService,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationFilterTestComponent);
    testComponent = fixture.componentInstance;
    debugElement = fixture.debugElement;
    component = debugElement.query(By.directive(LocationFilterComponent)).componentInstance;
    geolocationService = TestBed.inject(GeolocationService);
    locationFilterService = TestBed.inject(LocationFilterService);
    toastService = TestBed.inject(ToastService);
    testComponent.config = config;
    fixture.detectChanges();
  });

  describe('when the component is initialized', () => {
    beforeEach(() => {
      component.onValueChange([], MOCK_LOCATION_FILTER_PARAMS);
    });

    it('should set the initial location coordinates', () => {
      component.onValueChange([], MOCK_LOCATION_FILTER_PARAMS);

      expect(component.componentLocation).toEqual({
        [FILTER_QUERY_PARAM_KEY.longitude]: `${LONGITUDE_MOCK}`,
        [FILTER_QUERY_PARAM_KEY.latitude]: `${LATITUDE_MOCK}`,
      });
    });

    describe('if a distance is already provided in query params', () => {
      it('should set the distance value in km', () => {
        component.onValueChange([], MOCK_LOCATION_FILTER_PARAMS);

        expect(component.componentDistance).toEqual(DISTANCE_MOCK / DISTANCE_FACTOR);
      });
    });

    describe('if any distance is provided in query params', () => {
      it('should set the maximum distance value', () => {
        component.onValueChange([], MOCK_LOCATION_FILTER_PARAMS_WITHOUT_DISTANCE);

        expect(component.componentDistance).toEqual(MAX_FILTER_DISTANCE);
      });
    });
  });

  describe('when the user types a location in the search box', () => {
    beforeEach(() => openFilterContent());

    it('should search for location suggestions', fakeAsync(() => {
      const searchBoxInput = fixture.debugElement.query(By.css('.LocationFilter__input'));
      spyOn(geolocationService, 'search').and.returnValue(of(MOCK_LOCATION_SUGGESTIONS));

      searchBoxInput.nativeElement.value = MOCK_CITY_NAME;
      searchBoxInput.nativeElement.dispatchEvent(new Event('input'));
      tick(LOCATION_SEARCH_BOX_DEBOUNCE);

      expect(geolocationService.search).toHaveBeenCalledWith(MOCK_CITY_NAME);
      flush();
    }));
  });

  describe('when the user selects a location from the search box suggester', () => {
    const MOCK_COORDINATE = CoordinateMother.random();

    beforeEach(fakeAsync(() => {
      openFilterContent();
      const searchBoxInput = fixture.debugElement.query(By.css('.LocationFilter__input'));
      spyOn(geolocationService, 'search').and.returnValue(of(MOCK_LOCATION_SUGGESTIONS));
      spyOn(geolocationService, 'geocode').and.returnValue(of(MOCK_COORDINATE));
      spyOn(locationFilterService, 'getLocationLabel').and.callThrough();

      searchBoxInput.nativeElement.value = 'Sant Cugat';
      searchBoxInput.nativeElement.dispatchEvent(new Event('input'));
      tick(LOCATION_SEARCH_BOX_DEBOUNCE);
      fixture.detectChanges();

      const suggestion = fixture.debugElement.query(By.css('.SearchBox__suggestion'));
      suggestion.nativeNode.click();

      flush();
    }));

    it('should set the latitude and longitude for the selected location', () => {
      expect(component.componentLocation).toEqual({
        [FILTER_QUERY_PARAM_KEY.latitude]: `${MOCK_COORDINATE.latitude}`,
        [FILTER_QUERY_PARAM_KEY.longitude]: `${MOCK_COORDINATE.longitude}`,
      });
    });

    it('should set the location name', () => {
      expect(component.locationName).toEqual(MOCK_LOCATION_SUGGESTIONS[0].description);
    });

    it('should update the map image with the selected location', () => {
      const { latitude, longitude } = MOCK_COORDINATE;

      expect(component.mapURL).toEqual(
        `${HERE_MAPS_ENDPOINT}${HERE_MAPS_PARAMS(6, MAX_FILTER_DISTANCE)}${HERE_MAPS_COORDINATES(latitude, longitude)}`
      );
    });
  });

  describe('when the user changes the distance', () => {
    it('should update the map image with the selected distance', () => {
      const { latitude, longitude } = MOCK_SEARCH_LOCATION;

      component.componentLocation = MOCK_SEARCH_LOCATION;
      component.componentDistance = 10;

      expect(component.mapURL).toEqual(`${HERE_MAPS_ENDPOINT}${HERE_MAPS_PARAMS(10, 10)}${HERE_MAPS_COORDINATES(latitude, longitude)}`);
    });
  });

  describe('when clicking on the apply button', () => {
    it('should apply the selected location', () => {
      spyOn(component.valueChange, 'emit');

      component.componentLocation = MOCK_SEARCH_LOCATION;
      component.handleApply();

      expect(component.valueChange.emit).toHaveBeenCalledWith([
        { key: FILTER_QUERY_PARAM_KEY.latitude, value: `${MOCK_SEARCH_LOCATION.latitude}` },
        { key: FILTER_QUERY_PARAM_KEY.longitude, value: `${MOCK_SEARCH_LOCATION.longitude}` },
        { key: FILTER_QUERY_PARAM_KEY.distance, value: null },
      ]);
    });

    it('should save the location for future searches', () => {
      spyOn(locationFilterService, 'setUserLocation').and.callThrough();

      component.componentLocation = MOCK_SEARCH_LOCATION;
      component.locationName = MOCK_CITY_NAME;
      component.handleApply();

      expect(locationFilterService.setUserLocation).toHaveBeenCalledWith({
        ...MOCK_SEARCH_LOCATION,
        label: MOCK_CITY_NAME,
      });
    });

    it('should update the bubble label with the new location', (done) => {
      component.componentLocation = MOCK_SEARCH_LOCATION;
      component.locationName = MOCK_CITY_NAME;
      component.handleApply();

      component.onApplyLocation().subscribe(() => {
        expect(component.label).toEqual(MOCK_CITY_NAME);
      });
      done();
    });

    it('should not mark the bubble as active', (done) => {
      component.componentLocation = MOCK_SEARCH_LOCATION;
      component.locationName = MOCK_CITY_NAME;
      component.handleApply();

      component.onApplyLocation().subscribe(() => {
        expect(component.bubbleActive).toBe(false);
      });
      done();
    });

    describe('if the distance filter is already applied', () => {
      const MOCK_DISTANCE = 5;

      it('should apply the distance filter sending the distance in meters', () => {
        spyOn(component.valueChange, 'emit');
        component.componentLocation = MOCK_SEARCH_LOCATION;
        component.locationName = MOCK_CITY_NAME;
        component.componentDistance = MOCK_DISTANCE;

        component.handleApply();

        expect(component.valueChange.emit).toHaveBeenCalledWith([
          { key: FILTER_QUERY_PARAM_KEY.latitude, value: `${MOCK_SEARCH_LOCATION.latitude}` },
          { key: FILTER_QUERY_PARAM_KEY.longitude, value: `${MOCK_SEARCH_LOCATION.longitude}` },
          { key: FILTER_QUERY_PARAM_KEY.distance, value: `${MOCK_DISTANCE * DISTANCE_FACTOR}` },
        ]);
      });

      it('should mark the bubble as active', (done) => {
        component.componentLocation = MOCK_SEARCH_LOCATION;
        component.locationName = MOCK_CITY_NAME;
        component.componentDistance = MOCK_DISTANCE;

        component.handleApply();

        component.onApplyLocation().subscribe(() => {
          expect(component.bubbleActive).toBe(true);
        });
        done();
      });
    });
  });

  describe('when the user clicks on the button for retrieving browser location', () => {
    beforeEach(() => openFilterContent());

    describe('and the location from the browser can be retrieved', () => {
      it('should set the retrieved location', async () => {
        spyOn(locationFilterService, 'getLocationFromBrowserAPI').and.returnValue(Promise.resolve(MOCK_SEARCH_LOCATION));
        spyOn(locationFilterService, 'getLocationLabel').and.returnValue(MOCK_CITY_NAME);
        const geolocationRequestBtn = fixture.debugElement.query(By.css('.LocationFilter__geolocation'));

        component.onGeolocationChange().subscribe(() => {
          expect(locationFilterService.getLocationFromBrowserAPI).toHaveBeenCalled();
          expect(locationFilterService.getLocationLabel).toHaveBeenCalledWith(MOCK_SEARCH_LOCATION);
          expect(component.locationName).toEqual(MOCK_CITY_NAME);
          expect(component.componentLocation).toEqual(MOCK_SEARCH_LOCATION);
        });

        await geolocationRequestBtn.nativeNode.click();
      });
    });

    describe('and the location from the browser can`t be retreived', () => {
      it('should show a toast indicating the error', async () => {
        const errorMessage = `Can't retrieve geolocation`;
        const toast: Toast = { text: errorMessage, type: 'error' };
        const geolocationRequestBtn = fixture.debugElement.query(By.css('.LocationFilter__geolocation'));
        spyOn(locationFilterService, 'getLocationFromBrowserAPI').and.returnValue(
          Promise.reject(new GeolocationNotAvailableError(errorMessage))
        );
        spyOn(toastService, 'show').and.callThrough();

        await geolocationRequestBtn.nativeNode.click();

        expect(toastService.show).toHaveBeenCalledWith(toast);
      });
    });
  });
});
