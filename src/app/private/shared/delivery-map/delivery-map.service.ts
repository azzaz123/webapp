import { Injectable } from '@angular/core';
import { CarrierOfficesApiService } from '@api/bff/delivery/carrier-offices/carrier-offices-api.service';
import { Location } from '@api/core/model';
import { DeliveryAddress } from '@api/core/model/delivery/address/delivery-address.interface';
import { CarrierOfficeInfo } from '@api/core/model/delivery/carrier-office-info/carrier-office-info.interface';
import { POST_OFFICE_CARRIER } from '@api/core/model/delivery/post-offices-carriers.type';
import { CarrierOfficeAddressesApiService } from '@api/delivery/me/carrier-office-addresses/carrier-office-addresses-api.service';
import { Coordinate } from '@core/geolocation/address-response.interface';
import { GeolocationService } from '@core/geolocation/geolocation.service';
import { UserService } from '@core/user/user.service';
import { Observable, ReplaySubject } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { User } from '@core/user/user';
import {
  DEFAULT_VALUE_ZOOM,
  HALF_CIRCUMFERENCE_DEGREES,
  METERS_PER_MAP_TILE_AT_THE_SMALLEST_ZOOM_LEVEL,
} from '../movable-map/constants/map.constants';

@Injectable({
  providedIn: 'root',
})
export class DeliveryMapService {
  private carrierOfficesSubject: ReplaySubject<CarrierOfficeInfo[]> = new ReplaySubject(1);
  private selectedOfficeInformationSubject: ReplaySubject<any> = new ReplaySubject(1);

  constructor(
    private carrierOfficeAddressesApiService: CarrierOfficeAddressesApiService,
    private carrierOfficesApiService: CarrierOfficesApiService,
    private userService: UserService,
    private geoLocationService: GeolocationService
  ) {}

  public initializeOffices(fullAddress: string, selectedCarrier: POST_OFFICE_CARRIER): Observable<CarrierOfficeInfo[]> {
    return this.initialCenterCoordinates$(fullAddress).pipe(
      switchMap((location: Location) => {
        const radiusKm: number = Math.round(
          (METERS_PER_MAP_TILE_AT_THE_SMALLEST_ZOOM_LEVEL * Math.cos((location.latitude * Math.PI) / HALF_CIRCUMFERENCE_DEGREES)) /
            Math.pow(2, DEFAULT_VALUE_ZOOM)
        );
        return this.getOffices(location.latitude, location.longitude, radiusKm, selectedCarrier);
      }),
      tap((offices: CarrierOfficeInfo[]) => (this.carrierOffices = offices))
    );
  }

  public getOffices(
    latitude: number,
    longitude: number,
    radiusKm: number,
    selectedCarrier: POST_OFFICE_CARRIER
  ): Observable<CarrierOfficeInfo[]> {
    return this.carrierOfficesApiService
      .getCarrierOfficeAddresses(latitude, longitude, radiusKm, selectedCarrier)
      .pipe(tap((offices: CarrierOfficeInfo[]) => (this.carrierOffices = offices)));
  }

  public selectOffice(carrierOfficeInfo: CarrierOfficeInfo, officeId: string = null): Observable<void> {
    if (officeId) {
      return this.carrierOfficeAddressesApiService.createSelectedCarrierOffice(carrierOfficeInfo);
    }
    return this.carrierOfficeAddressesApiService.updateSelectedCarrierOffice(officeId, carrierOfficeInfo);
  }

  public get officeMarkers$(): Observable<Location[]> {
    return this.carrierOfficesSubject.pipe(
      map((carrierOffices: CarrierOfficeInfo[]) => {
        return carrierOffices.map((carrier: CarrierOfficeInfo) => {
          return {
            latitude: carrier.latitude,
            longitude: carrier.longitude,
          };
        });
      })
    );
  }

  public initialCenterCoordinates$(fullAddress: string): Observable<Location> {
    return fullAddress ? this.getAddressLocation(fullAddress) : this.getUserLocation();
  }

  public getSelectedOfficeInformation(selectedOfficeLocation: Location): Observable<any> {
    return this.carrierOffices$.pipe(
      map((offices: CarrierOfficeInfo[]) => {
        const selectedOffice = offices.find((office) => {
          return office.latitude === selectedOfficeLocation.latitude && office.longitude === selectedOfficeLocation.longitude;
        });

        return {
          openingHours: selectedOffice.openingHours,
          name: selectedOffice.name,
        };
      }),
      tap((openingHours) => {
        this.selectedOfficeInformation = openingHours;
      })
    );
  }

  public get carrierOffices$(): Observable<CarrierOfficeInfo[]> {
    return this.carrierOfficesSubject.asObservable();
  }

  public get selectedOfficeInformation$(): Observable<string[]> {
    return this.selectedOfficeInformationSubject.asObservable();
  }

  private set carrierOffices(newOffices: CarrierOfficeInfo[]) {
    this.carrierOfficesSubject.next(newOffices);
  }

  private set selectedOfficeInformation(info) {
    this.selectedOfficeInformationSubject.next(info);
  }

  private getAddressLocation(address: string): Observable<Location> {
    return this.geoLocationService.geocode(address).pipe(
      map((coordinate: Coordinate) => {
        return {
          latitude: coordinate.latitude,
          longitude: coordinate.longitude,
        };
      })
    );
  }

  private getUserLocation(): Observable<Location> {
    return this.userService.getLoggedUserInformation().pipe(
      map((user: User) => {
        return {
          latitude: user.location.latitude || user.location.approximated_latitude,
          longitude: user.location.longitude || user.location.approximated_longitude,
        };
      })
    );
  }
}
