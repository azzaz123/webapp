import { Location } from '@api/core/model';
import { HttpClientModule } from '@angular/common/http';
import { DebugElement, LOCALE_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HereMapsService } from '@shared/geolocation/here-maps/here-maps.service';
import { SpinnerComponent } from '@shared/spinner/spinner.component';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';
import { BehaviorSubject } from 'rxjs';

import { MovableMapComponent } from './movable-map.component';
import { DEFAULT_LOCATIONS } from '@public/features/search/core/services/constants/default-locations';
import { MOCK_HERE_MAPS } from '@configs/jest/global-mocks.fixtures.spec';

describe('MovableMapComponent', () => {
  const initScriptSubjectMock: BehaviorSubject<boolean> = new BehaviorSubject(false);
  const isLibraryLoadingSubjectMock: BehaviorSubject<boolean> = new BehaviorSubject(true);
  const MOCK_CENTER_COORDINATES: Location = {
    latitude: 12,
    longitude: 11,
  };
  const FALLBACK_CENTER_COORDINATES: Location = {
    latitude: +DEFAULT_LOCATIONS['es'].latitude,
    longitude: +DEFAULT_LOCATIONS['es'].longitude,
  };
  let component: MovableMapComponent;
  let fixture: ComponentFixture<MovableMapComponent>;
  let hereMapsService: HereMapsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [MovableMapComponent, SpinnerComponent, SvgIconComponent],
      providers: [
        { provide: LOCALE_ID, useValue: `es` },
        {
          provide: HereMapsService,
          useValue: {
            platform: {
              createDefaultLayers() {
                return {
                  vector: {
                    normal: {
                      map: 'map',
                    },
                  },
                };
              },
            },
            isLibraryLoading$() {
              return isLibraryLoadingSubjectMock.asObservable();
            },
            initScript() {
              return initScriptSubjectMock.asObservable();
            },
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    window['H'] = MOCK_HERE_MAPS;

    fixture = TestBed.createComponent(MovableMapComponent);
    component = fixture.componentInstance;
    hereMapsService = TestBed.inject(HereMapsService);
    component.markers = [MOCK_CENTER_COORDINATES, MOCK_CENTER_COORDINATES, MOCK_CENTER_COORDINATES];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when initialize component...', () => {
    beforeEach(() => {
      spyOn(hereMapsService, 'isLibraryLoading$').and.callThrough();
      spyOn(hereMapsService, 'initScript').and.callThrough();
      spyOn(hereMapsService.platform, 'createDefaultLayers').and.callThrough();
    });

    it('should init the here maps', () => {
      fixture.detectChanges();

      expect(hereMapsService.initScript).toHaveBeenCalledTimes(1);
    });

    describe('and the map is NOT ready', () => {
      beforeEach(() => {
        initScriptSubjectMock.next(false);
        isLibraryLoadingSubjectMock.next(true);

        fixture.detectChanges();
      });

      it('should show the loading state', () => {
        shouldShowLoading(true);
      });

      it('should NOT create the map ', () => {
        expect(hereMapsService.platform.createDefaultLayers).not.toHaveBeenCalled();
      });
    });

    describe('and the map is ready', () => {
      beforeEach(() => {
        spyOn(H.map, 'Icon').and.callFake(() => {});
        spyOn(H, 'Map').and.callFake(() => {});
        spyOn(H.mapevents, 'Behavior').and.callFake(() => {});
        spyOn(H.mapevents, 'MapEvents').and.callFake(() => {});
        spyOn(H.ui.UI, 'createDefault').and.callFake(() => {});

        initScriptSubjectMock.next(true);
        isLibraryLoadingSubjectMock.next(false);

        fixture.detectChanges();
      });

      it('should NOT show the loading state', () => {
        shouldShowLoading(false);
      });

      it('should create the map ', () => {
        expect(hereMapsService.platform.createDefaultLayers).toHaveBeenCalledTimes(1);
        expect(window['H'].Map).toHaveBeenCalledTimes(1);
      });

      it('should create the map behavior', () => {
        expect(window['H'].mapevents.Behavior).toHaveBeenCalledTimes(1);
      });

      it('should create the map UI', () => {
        expect(window['H'].ui.UI.createDefault).toHaveBeenCalledTimes(1);
      });
    });

    describe('and we provide center coordinates', () => {
      beforeEach(() => {
        component.centerCoordinates = MOCK_CENTER_COORDINATES;
        fixture.detectChanges();
      });

      it('should keep the center coordinates provided', () => {
        expect(component.centerCoordinates).toStrictEqual(MOCK_CENTER_COORDINATES);
      });
    });

    describe(`and we DON'T provide center coordinates`, () => {
      it('should set the fallback center coordinates', () => {
        expect(component.centerCoordinates).toStrictEqual(FALLBACK_CENTER_COORDINATES);
      });
    });
  });

  function shouldShowLoading(isShowed: boolean): void {
    const loading: DebugElement = fixture.debugElement.query(By.directive(SpinnerComponent));
    if (isShowed) {
      expect(loading).toBeTruthy();
    } else {
      expect(loading).toBeFalsy();
    }
  }
});
