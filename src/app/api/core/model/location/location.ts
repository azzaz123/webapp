export interface Location {
  latitude: number;
  longitude: number;
}

export interface LocationWithRatio extends Location {
  ratioInKm: number;
}
