export interface Location {
  latitude: number;
  longitude: number;
}

export interface LocationAccuracy extends Location {
  accuracy: number;
}
