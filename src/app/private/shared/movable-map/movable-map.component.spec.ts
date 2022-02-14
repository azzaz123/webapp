import { HttpClientModule } from '@angular/common/http';
import { DebugElement, LOCALE_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HereMapServiceMock } from '@fixtures/here-maps-service.fixtures.spec';
import { HereMapsService } from '@shared/geolocation/here-maps/here-maps.service';
import { SpinnerComponent } from '@shared/spinner/spinner.component';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';
import { BehaviorSubject } from 'rxjs';

import { MovableMapComponent } from './movable-map.component';

describe('MovableMapComponent', () => {
  const initScriptSubjectMock: BehaviorSubject<boolean> = new BehaviorSubject(false);
  const isLibraryLoadingSubjectMock: BehaviorSubject<boolean> = new BehaviorSubject(true);

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
          useClass: HereMapServiceMock,
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
      spyOn(hereMapsService, 'isLibraryLoading$').and.returnValue(isLibraryLoadingSubjectMock.asObservable());
      spyOn(hereMapsService, 'initScript').and.returnValue(initScriptSubjectMock.asObservable());
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
      it('should keep the center coordenates provided', () => {});
    });

    describe(`and we DON'T provide center coordenates`, () => {
      it('should set the fallback center coordenates', () => {});
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
