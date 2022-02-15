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
                  normal: {
                    map: 'map',
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
    fixture = TestBed.createComponent(MovableMapComponent);
    component = fixture.componentInstance;
    hereMapsService = TestBed.inject(HereMapsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when initialize component...', () => {
    beforeEach(() => {
      spyOn(hereMapsService, 'isLibraryLoading$').and.callThrough();
      spyOn(hereMapsService, 'initScript').and.callThrough();
      spyOn(hereMapsService.platform, 'createDefaultLayers');
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
        initScriptSubjectMock.next(true);
        isLibraryLoadingSubjectMock.next(false);

        fixture.detectChanges();
      });

      it('should NOT show the loading state', () => {
        shouldShowLoading(false);
      });

      it('should create the map ', () => {
        expect(hereMapsService.platform.createDefaultLayers).toHaveBeenCalledTimes(1);
      });

      it('should create the map behavior', () => {});

      it('should create the map UI', () => {});

      describe('and we make a dragend event on the map', () => {
        it('should emit the updated location', () => {});
      });

      describe('and we receive markers', () => {
        it('should add the markers in the map', () => {});

        describe('and we tap on one marker', () => {
          it('should emit the marker click', () => {});
        });
      });
    });

    describe('and we provide center coordenates', () => {
      beforeEach(() => {
        component.centerCoordinates = MOCK_CENTER_COORDINATES;
        fixture.detectChanges();
      });

      it('should keep the center coordenates provided', () => {
        expect(component.centerCoordinates).toStrictEqual(MOCK_CENTER_COORDINATES);
      });
    });

    describe(`and we DON'T provide center coordenates`, () => {
      beforeEach(() => {
        component.centerCoordinates = null;
        fixture.detectChanges();
      });

      it('should set the fallback center coordenates', () => {
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
