import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { HereMapsComponent, MAP_ZOOM_GENERAL, MAP_ZOOM_MARKER, USER_MARKER } from './here-maps.component';
import { USER_LOCATION_COORDINATES } from '../../../../tests/user.fixtures.spec';

const ICON = {url: 'icon'};
const MARKER = {marker: 'marker'};
const CIRCLE = {circle: 'circle'};

const platform = {
  createDefaultLayers() {
    return {
      normal: {
        map: 'map'
      }
    };
  }
};

const Map = {
  setZoom() {
  },
  setCenter() {
  },
  addObject() {
  },
  removeObject() {
  }
};

const map = {
  Icon: () => {
    return ICON;
  },
  Marker: () => {
    return MARKER;
  },
  Circle: () => {
    return CIRCLE;
  }
};

window['H'] = {
  service: {
    Platform: () => {
      return platform;
    }
  },
  Map: () => {
    return Map;
  },
  map: map
};

describe('HereMapsComponent', () => {
  let component: HereMapsComponent;
  let fixture: ComponentFixture<HereMapsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HereMapsComponent]
    })
    .compileComponents();
  }));

  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(HereMapsComponent);
    component = fixture.componentInstance;
    component.coordinates = USER_LOCATION_COORDINATES;
    fixture.detectChanges();
    spyOn(Map, 'setZoom');
    spyOn(Map, 'setCenter');
    spyOn(map, 'Icon').and.callThrough();
    spyOn(map, 'Marker').and.callThrough();
    spyOn(map, 'Circle').and.callThrough();
    spyOn(Map, 'addObject');
    spyOn(Map, 'removeObject');
    tick();
  }));

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(H, 'Map').and.callThrough();
      spyOn(platform, 'createDefaultLayers').and.callThrough();
      component.mapEl = {
        nativeElement: {}
      };
    });

    it('should instantiate map', fakeAsync(() => {
      component.ngOnInit();
      tick();

      expect(H.Map).toHaveBeenCalledWith(component.mapEl.nativeElement, 'map');
      expect(Map.setZoom).toHaveBeenCalledWith(MAP_ZOOM_GENERAL);
      expect(Map.setCenter).toHaveBeenCalledWith({
        lat: USER_LOCATION_COORDINATES.latitude,
        lng: USER_LOCATION_COORDINATES.longitude
      });
    }));

    it('should add marker if zoom is the marker zoom', fakeAsync(() => {
      component.zoom = MAP_ZOOM_MARKER;

      component.ngOnInit();
      tick();

      expect(map.Icon).toHaveBeenCalledWith(USER_MARKER);
      expect(map.Marker).toHaveBeenCalledWith({
        lat: USER_LOCATION_COORDINATES.latitude,
        lng: USER_LOCATION_COORDINATES.longitude
      }, {icon: ICON});
      expect(Map.addObject).toHaveBeenCalledWith(MARKER);
    }));

    it('should add circle if zoom is the marker zoom and isApproximateLocation', fakeAsync(() => {
      component.zoom = MAP_ZOOM_MARKER;
      component.isApproximateLocation = true;

      component.ngOnInit();
      tick();

      expect(map.Circle).toHaveBeenCalledWith({
        lat: USER_LOCATION_COORDINATES.latitude,
        lng: USER_LOCATION_COORDINATES.longitude
      }, 650, {
        style: {
          fillColor: 'rgba(51, 51, 51, 0.15)',
          lineWidth: 0
        }
      });
      expect(Map.addObject).toHaveBeenCalledWith(CIRCLE);
    }));
  });

  describe('ngOnChanges', () => {

    beforeEach(() => {
      component.zoom = MAP_ZOOM_MARKER;
    });

    describe('not isApproximateLocation', () => {
      beforeEach(() => {
        component.ngOnChanges();
      });

      it('should add marker with icon', () => {
        expect(map.Icon).toHaveBeenCalledWith(USER_MARKER);
        expect(map.Marker).toHaveBeenCalledWith({
          lat: USER_LOCATION_COORDINATES.latitude,
          lng: USER_LOCATION_COORDINATES.longitude
        }, {icon: ICON});
        expect(Map.addObject).toHaveBeenCalledWith(MARKER);
      });

      it('should remove marker before adding a new one', () => {
        component.ngOnChanges();

        expect(Map.removeObject).toHaveBeenCalledWith(MARKER);
      });
    });

    describe('isApproximateLocation', () => {
      beforeEach(() => {
        component.isApproximateLocation = true;

        component.ngOnChanges();
      });

      it('should add circle', () => {
        expect(map.Circle).toHaveBeenCalledWith({
          lat: USER_LOCATION_COORDINATES.latitude,
          lng: USER_LOCATION_COORDINATES.longitude
        }, 650, {
          style: {
            fillColor: 'rgba(51, 51, 51, 0.15)',
            lineWidth: 0
          }
        });
        expect(Map.addObject).toHaveBeenCalledWith(CIRCLE);
      });

      it('should remove circle before adding a new one', () => {
        component.ngOnChanges();

        expect(Map.removeObject).toHaveBeenCalledWith(CIRCLE);
      });
    });

    afterEach(() => {
      it('should set map center and zoom', () => {
        expect(Map.setZoom).toHaveBeenCalledWith(MAP_ZOOM_MARKER);
        expect(Map.setCenter).toHaveBeenCalledWith({
          lat: USER_LOCATION_COORDINATES.latitude,
          lng: USER_LOCATION_COORDINATES.longitude
        });
      });
    });

  });
});
