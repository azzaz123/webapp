export const STANDARD_ICON: string = '/assets/icons/map-icons/standard.svg';
export const SELECTED_ICON: string = '/assets/icons/map-icons/selected.svg';

export const METERS_PER_MAP_TILE_AT_THE_SMALLEST_ZOOM_LEVEL: number = 156543.03392;
export const HALF_CIRCUMFERENCE_DEGREES: number = 180;
export const DEFAULT_VALUE_ZOOM: number = 15;

export const getRadiusInKm = (zoom: number, latitude: number): number => {
  return Math.round(
    (METERS_PER_MAP_TILE_AT_THE_SMALLEST_ZOOM_LEVEL * Math.cos((latitude * Math.PI) / HALF_CIRCUMFERENCE_DEGREES)) / Math.pow(2, zoom) / 2
  );
};
