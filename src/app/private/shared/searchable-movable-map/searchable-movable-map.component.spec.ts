import { ComponentFixture, TestBed, flush, tick, fakeAsync } from '@angular/core/testing';

import { SearchableMovableMapComponent, HALF_SECOND } from './searchable-movable-map.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { GeolocationService } from '@core/geolocation/geolocation.service';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { MockGeolocationService, MOCK_LOCATION_SUGGESTIONS } from '@fixtures/core/geolocation/geolocation-service.fixtures.spec';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { CoordinateMother } from '../../../../tests/core/geolocation/coordinate.mother';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import { DebugElement } from '@angular/core';
import { MovableMapComponent } from '../movable-map/movable-map.component';
import { SpinnerComponent } from '@shared/spinner/spinner.component';

describe('SearchableMovableMapComponent', () => {
  let component: SearchableMovableMapComponent;
  let geoLocationService: GeolocationService;
  let fixture: ComponentFixture<SearchableMovableMapComponent>;

  const searchBoxSelector: string = '.SearchBox';
  const searchBoxInputSelector: string = '.SearchBox__input';
  const searchBoxGlassSelector: string = '.SearchBox__glass';
  const MOCK_CITY_NAME: string = 'Rubí';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule, FormsModule, NgbTypeaheadModule, SvgIconModule],
      declarations: [SearchableMovableMapComponent, MovableMapComponent, SpinnerComponent],
      providers: [
        {
          provide: GeolocationService,
          useClass: MockGeolocationService,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    geoLocationService = TestBed.inject(GeolocationService);
    fixture = TestBed.createComponent(SearchableMovableMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when the search box initializes... ', () => {
    it('should create the search form', () => {
      expect(component.searchLocationForm.contains('searchLocation')).toBeTruthy();
    });

    it('should apply the search box style', () => {
      expect(fixture.debugElement.query(By.css(searchBoxSelector))).toBeTruthy();
    });

    it('should apply the input style', () => {
      expect(fixture.debugElement.query(By.css(searchBoxInputSelector))).toBeTruthy();
    });

    it('should apply the glass style', () => {
      expect(fixture.debugElement.query(By.css(searchBoxGlassSelector))).toBeTruthy();
    });

    it('should render the map', () => {
      expect(fixture.debugElement.query(By.directive(MovableMapComponent))).toBeTruthy();
    });
  });

  describe('when the user types a location in the search box', () => {
    it('should search for location suggestions', fakeAsync(() => {
      const searchBoxInput: DebugElement = fixture.debugElement.query(By.css(searchBoxInputSelector));
      spyOn(geoLocationService, 'search').and.returnValue(of(MOCK_LOCATION_SUGGESTIONS));

      searchBoxInput.nativeElement.value = MOCK_CITY_NAME;
      searchBoxInput.nativeElement.dispatchEvent(new Event('input'));
      tick(HALF_SECOND);

      expect(geoLocationService.search).toHaveBeenCalledWith(MOCK_CITY_NAME);
      flush();
    }));
  });

  describe('when the user selects a location from the search box suggester', () => {
    const MOCK_COORDINATE = CoordinateMother.random();

    beforeEach(fakeAsync(() => {
      const searchBoxInput: DebugElement = fixture.debugElement.query(By.css(searchBoxInputSelector));
      spyOn(geoLocationService, 'search').and.returnValue(of(MOCK_LOCATION_SUGGESTIONS));
      spyOn(geoLocationService, 'geocode').and.returnValue(
        of({
          ...MOCK_COORDINATE,
          name: MOCK_LOCATION_SUGGESTIONS[0].description,
        })
      );
      spyOn(component.selectedLocationCoordinates, 'emit');

      searchBoxInput.nativeElement.value = MOCK_CITY_NAME;
      searchBoxInput.nativeElement.dispatchEvent(new Event('input'));
      tick(HALF_SECOND);
      fixture.detectChanges();

      const suggestion: DebugElement = fixture.debugElement.query(By.css('.SearchBox__suggestion'));
      suggestion.nativeNode.click();
      tick(HALF_SECOND);

      flush();
    }));

    it('should set the latitude and longitude for the selected location', () => {
      expect(component.selectedLocationCoordinates.emit).toHaveBeenCalledWith({
        [FILTER_QUERY_PARAM_KEY.latitude]: MOCK_COORDINATE.latitude,
        [FILTER_QUERY_PARAM_KEY.longitude]: MOCK_COORDINATE.longitude,
      });
    });

    it('should set the location name with country at the end', () => {
      const searchLocationFormValue: string = component.searchLocationForm.controls.searchLocation.value;
      const locationWithCountryAtTheEnd: string = MOCK_LOCATION_SUGGESTIONS[0].description.split(',').reverse().join();

      expect(searchLocationFormValue).toEqual(locationWithCountryAtTheEnd);
    });
  });

  describe('when clicking the reset button', () => {
    beforeEach(() => {
      component.searchLocationForm.controls.searchLocation.setValue(MOCK_CITY_NAME);
      fixture.detectChanges();
    });
    it('should reset the current typed location', fakeAsync(() => {
      const resetElement: DebugElement = fixture.debugElement.query(By.css('.SearchBox__reset'));

      resetElement.triggerEventHandler('click', {});
      tick(HALF_SECOND);

      expect(component.searchLocationForm.controls.searchLocation.value).toBeNull();
      flush();
    }));
  });
});
