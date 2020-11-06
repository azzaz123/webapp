import { Injectable } from '@angular/core';
import { GeoCoord } from './geo-coord.interface';

@Injectable({
  providedIn: 'root',
})
export class DistanceService {
  private earthRadiusInKilometers = 6371;

  constructor() {}

  public getDistanceInKilometers(coord1: GeoCoord, coord2: GeoCoord): number {
    const distance = this.getDistance(coord1, coord2);
    return this.earthRadiusInKilometers * distance;
  }

  private getDistance(coord1: GeoCoord, coord2: GeoCoord): number {
    const v1 = this.toRadians(coord1.latitude);
    const v2 = this.toRadians(coord2.latitude);
    const s1 = this.toRadians(coord2.latitude - coord1.latitude);
    const s2 = this.toRadians(coord2.longitude - coord1.longitude);
    const a =
      Math.pow(Math.sin(s1 / 2), 2) +
      Math.cos(v1) * Math.cos(v2) * Math.pow(Math.sin(s2 / 2), 2);
    return 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  private toRadians(value: number): number {
    return (value * Math.PI) / 180;
  }
}
