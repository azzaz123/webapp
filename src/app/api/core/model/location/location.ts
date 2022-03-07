export interface Location {
  latitude: number;
  longitude: number;
}

export interface LocationWithRadius extends Location {
  radiusInKm: number;
}
