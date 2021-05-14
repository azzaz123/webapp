import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, DebugElement, Input } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { GeolocationService } from '@core/geolocation/geolocation.service';
import { CoordinateMother, LatitudeMother, LongitudeMother } from '@fixtures/core';
import { MockGeolocationService, MOCK_LOCATION_SUGGESTIONS } from '@fixtures/core/geolocation/geolocation-service.fixtures.spec';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { LocationFilterServiceService } from '@public/features/search/core/services/location-filter-service.service';
import { BubbleComponent } from '@public/shared/components/bubble/bubble.component';
import { SliderFormModule } from '@shared/form/components/slider/slider-form.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { of } from 'rxjs';
import { MockLocationFilterService } from '../../../../../../../../tests/core/geolocation/location-filter-service.fixtures.spec';
import { COMMON_CONFIGURATION_ID } from '../../../core/enums/configuration-ids/common-configuration-ids.enum';
import { FILTER_TYPES } from '../../../core/enums/filter-types/filter-types.enum';
import { FILTER_QUERY_PARAM_KEY } from '../../../enums/filter-query-param-key.enum';
import { FilterParameter } from '../../../interfaces/filter-parameter.interface';
import { FILTER_VARIANT } from '../../abstract-filter/abstract-filter.enum';
import { AbstractFilterModule } from '../../abstract-filter/abstract-filter.module';
import { LocationFilterConfig } from '../interfaces/location-filter-config.interface';
import { LocationFilterComponent, SEARCH_BOX_DEBOUNCE_TIME } from './location-filter.component';

const LATITUDE_MOCK = LatitudeMother.random();
const LONGITUDE_MOCK = LongitudeMother.random();

const MOCK_LOCATION_FILTER_PARAMS: FilterParameter[] = [
  { key: FILTER_QUERY_PARAM_KEY.latitude, value: `${LATITUDE_MOCK}` },
  { key: FILTER_QUERY_PARAM_KEY.longitude, value: `${LONGITUDE_MOCK}` },
  { key: FILTER_QUERY_PARAM_KEY.longitude, value: '500' },
];

@Component({
  selector: 'tsl-location-filter-test-component',
  template: `<tsl-location-filter [config]="config" [value]="value" [variant]="variant"></tsl-location-filter>`,
})
class LocationFilterTestComponent {
  @Input() variant: FILTER_VARIANT = FILTER_VARIANT.BUBBLE;
  @Input() config: LocationFilterConfig;
  @Input() value: FilterParameter[] = [];
}

describe('LocationFilterComponent', () => {
  let component: LocationFilterComponent;
  let testComponent: LocationFilterTestComponent;
  let fixture: ComponentFixture<LocationFilterTestComponent>;
  let debugElement: DebugElement;
  let geolocationService: GeolocationService;
  let locationFilterService: LocationFilterServiceService;

  const config: LocationFilterConfig = {
    id: COMMON_CONFIGURATION_ID.LOCATION,
    type: FILTER_TYPES.LOCATION,
    title: 'Location',
    bubblePlaceholder: 'Location',
    drawerPlaceholder: 'Location',
    icon: '/assets/icons/filters/location.svg',
    mapKey: {
      latitude: FILTER_QUERY_PARAM_KEY.latitude,
      longitude: FILTER_QUERY_PARAM_KEY.longitude,
      distance: FILTER_QUERY_PARAM_KEY.distance,
    },
    units: 'km',
    range: [1, 500],
    stepsArray: [{ value: 1 }, { value: 5 }, { value: 10 }, { value: 30 }, { value: 50 }, { value: 100 }, { value: 200 }, { value: 500 }],
    limitless: true,
    hasContentPlaceholder: true,
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
      declarations: [LocationFilterComponent, LocationFilterTestComponent],
      providers: [
        {
          provide: LocationFilterServiceService,
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
    locationFilterService = TestBed.inject(LocationFilterServiceService);
    testComponent.config = config;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when the component is initialized', () => {
    beforeEach(() => {
      component.onValueChange([], MOCK_LOCATION_FILTER_PARAMS);
    });

    it('should set the initial location value', () => {
      expect(component.currentLocation).toEqual({
        [FILTER_QUERY_PARAM_KEY.longitude]: `${LONGITUDE_MOCK}`,
        [FILTER_QUERY_PARAM_KEY.latitude]: `${LATITUDE_MOCK}`,
      });
    });
  });

  describe('when the user types a location in the search box', () => {
    beforeEach(() => {
      const bubble = fixture.debugElement.query(By.directive(BubbleComponent));

      bubble.nativeNode.click();
      fixture.detectChanges();
    });

    it('should get location suggestions', fakeAsync(() => {
      const searchBoxInput = fixture.debugElement.query(By.css('.LocationFilter__input'));
      spyOn(geolocationService, 'search').and.returnValue(of(MOCK_LOCATION_SUGGESTIONS));

      searchBoxInput.nativeElement.value = 'Rubí';
      searchBoxInput.nativeElement.dispatchEvent(new Event('input'));
      tick(SEARCH_BOX_DEBOUNCE_TIME);

      expect(geolocationService.search).toHaveBeenCalledWith('Rubí');
      flush();
    }));
  });

  // describe('when the user selects a location suggestion', () => {
  //   beforeEach(() => {
  //     const bubble = fixture.debugElement.query(By.directive(BubbleComponent));

  //     bubble.nativeNode.click();
  //     fixture.detectChanges();
  //   });

  //   it('should set the location', fakeAsync(() => {
  //     const MOCK_COORDINATE = CoordinateMother.random();
  //     const searchBoxInput = fixture.debugElement.query(By.css('.LocationFilter__input'));
  //     spyOn(geolocationService, 'search').and.returnValue(of(MOCK_LOCATION_SUGGESTIONS));
  //     spyOn(geolocationService, 'geocode').and.returnValue(of(MOCK_COORDINATE));
  //     spyOn(locationFilterService, 'getLocationLabel').and.callThrough();

  //     searchBoxInput.nativeElement.value = 'Rubí';
  //     searchBoxInput.nativeElement.dispatchEvent(new Event('input'));
  //     tick(SEARCH_BOX_DEBOUNCE_TIME);
  //     fixture.detectChanges();

  //     const suggestion = fixture.debugElement.query(By.css('.SearchBox__suggestion'));
  //     suggestion.nativeNode.click();

  //     expect(component.currentLocation).toEqual(
  //       {
  //         [FILTER_QUERY_PARAM_KEY.latitude]: `${MOCK_COORDINATE.latitude}`,
  //         [FILTER_QUERY_PARAM_KEY.longitude]: `${MOCK_COORDINATE.longitude}`,
  //       }
  //     );
  //     flush();
  //   }));
  // });

  describe('when the user changes the distance', () => {
    it('should set a new distance', (done) => {
      component.currentDistance = 50;

      component.locationMapURL$.subscribe((url) => {
        expect(component.locationMapURL).toEqual('');
        done();
      });
    });
  });
});
