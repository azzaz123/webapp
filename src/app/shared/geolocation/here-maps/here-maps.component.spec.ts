import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HereMapsComponent } from './here-maps.component';
import { USER_LOCATION_COORDINATES } from '../../../../tests/user.fixtures';

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
  setZoom() {},
  setCenter() {},
  addObject() {}
};

const map = {
  Icon: () => {
    return {url: 'icon'};
  },
  Marker: () => {
    return {marker: 'marker'};
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
      declarations: [ HereMapsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HereMapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should instantiate map', () => {
      spyOn(H, 'Map').and.callThrough();
      spyOn(platform, 'createDefaultLayers').and.callThrough();
      spyOn(Map, 'setZoom');
      spyOn(Map, 'setCenter');
      component.mapEl = {
        nativeElement: {}
      };
      component.ngOnInit();
      expect(H.Map).toHaveBeenCalledWith(component.mapEl.nativeElement, 'map');
      expect(Map.setZoom).toHaveBeenCalledWith(5);
      expect(Map.setCenter).toHaveBeenCalledWith({
        lat: 40.42028,
        lng: -3.70578
      });
    });
  });

  describe('ngOnChanges', () => {
    beforeEach(() => {
      component.coordinates = USER_LOCATION_COORDINATES;
      spyOn(Map, 'setZoom');
      spyOn(Map, 'setCenter');
      spyOn(map, 'Icon').and.callThrough();
      spyOn(map, 'Marker').and.callThrough();
      spyOn(Map, 'addObject');
      component.ngOnChanges();
    });
    it('should set map center and zoom', () => {
      expect(Map.setZoom).toHaveBeenCalledWith(15);
      expect(Map.setCenter).toHaveBeenCalledWith({
        lat: USER_LOCATION_COORDINATES.latitude,
        lng: USER_LOCATION_COORDINATES.longitude
      });
    });
    it('should add marker with icon', () => {
      expect(map.Icon).toHaveBeenCalledWith('/assets/icons/user-marker.svg');
      expect(map.Marker).toHaveBeenCalledWith({
        lat: USER_LOCATION_COORDINATES.latitude,
        lng: USER_LOCATION_COORDINATES.longitude
      }, {icon: {url: 'icon'}});
      expect(Map.addObject).toHaveBeenCalledWith({marker: 'marker'});
    });
  });
});
