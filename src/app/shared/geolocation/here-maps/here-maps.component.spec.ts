import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HereMapsComponent, MAP_ZOOM_GENERAL, MAP_ZOOM_MARKER, USER_MARKER } from './here-maps.component';
import { USER_LOCATION_COORDINATES } from '../../../../tests/user.fixtures';

const ICON = {url: 'icon'};
const MARKER = {marker: 'marker'};

const platform = {
  createDefaultLayers() {
    return {
      normal: {
        map: 'map'
      }
    }
  }
};

const Map = {
  setZoom() {
  },
  setCenter() {
  },
  addObject() {
  }
};

const map = {
  Icon: () => {
    return ICON;
  },
  Marker: () => {
    return MARKER;
  }
};

window['H'] = {
  service: {
    Platform: () => {
      return platform
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

  beforeEach(() => {
    fixture = TestBed.createComponent(HereMapsComponent);
    component = fixture.componentInstance;
    component.coordinates = USER_LOCATION_COORDINATES;
    fixture.detectChanges();
    spyOn(Map, 'setZoom');
    spyOn(Map, 'setCenter');
    spyOn(map, 'Icon').and.callThrough();
    spyOn(map, 'Marker').and.callThrough();
    spyOn(Map, 'addObject');
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(H, 'Map').and.callThrough();
      spyOn(platform, 'createDefaultLayers').and.callThrough();
      component.mapEl = {
        nativeElement: {}
      };
    });

    it('should instantiate map', () => {
      component.ngOnInit();

      expect(H.Map).toHaveBeenCalledWith(component.mapEl.nativeElement, 'map');
      expect(Map.setZoom).toHaveBeenCalledWith(MAP_ZOOM_GENERAL);
      expect(Map.setCenter).toHaveBeenCalledWith({
        lat: USER_LOCATION_COORDINATES.latitude,
        lng: USER_LOCATION_COORDINATES.longitude
      });
    });

    it('should add marker if zoom is the marker zoom', () => {
      component.zoom = MAP_ZOOM_MARKER;

      component.ngOnInit();

      expect(map.Icon).toHaveBeenCalledWith(USER_MARKER);
      expect(map.Marker).toHaveBeenCalledWith({
        lat: USER_LOCATION_COORDINATES.latitude,
        lng: USER_LOCATION_COORDINATES.longitude
      }, {icon: ICON});
      expect(Map.addObject).toHaveBeenCalledWith(MARKER);
    });
  });

  describe('ngOnChanges', () => {
    beforeEach(() => {
      component.zoom = MAP_ZOOM_MARKER;
      component.ngOnChanges();
    });

    it('should set map center and zoom', () => {
      expect(Map.setZoom).toHaveBeenCalledWith(MAP_ZOOM_MARKER);
      expect(Map.setCenter).toHaveBeenCalledWith({
        lat: USER_LOCATION_COORDINATES.latitude,
        lng: USER_LOCATION_COORDINATES.longitude
      });
    });

    it('should add marker with icon', () => {
      expect(map.Icon).toHaveBeenCalledWith(USER_MARKER);
      expect(map.Marker).toHaveBeenCalledWith({
        lat: USER_LOCATION_COORDINATES.latitude,
        lng: USER_LOCATION_COORDINATES.longitude
      }, {icon: ICON});
      expect(Map.addObject).toHaveBeenCalledWith(MARKER);
    });
  });
});
