import { Injectable } from '@angular/core';
import { CarrierOfficesApiService } from '@api/bff/delivery/carrier-offices/carrier-offices-api.service';
import { Location } from '@api/core/model';
import { CarrierOfficeInfo, CarrierOfficeSchedule } from '@api/core/model/delivery/carrier-office-info/carrier-office-info.interface';
import { POST_OFFICE_CARRIER } from '@api/core/model/delivery/post-offices-carriers.type';
import { CarrierOfficeAddressesApiService } from '@api/delivery/me/carrier-office-addresses/carrier-office-addresses-api.service';
import { Coordinate } from '@core/geolocation/address-response.interface';
import { GeolocationService } from '@core/geolocation/geolocation.service';
import { UserService } from '@core/user/user.service';
import { Observable, ReplaySubject } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { User } from '@core/user/user';
import { LocationWithRadius } from '@api/core/model/location/location';
import { getRadiusInKm, DEFAULT_VALUE_ZOOM } from '../movable-map/constants/map.constants';

@Injectable({
  providedIn: 'root',
})
export class DeliveryMapService {
  private carrierOfficesSubject: ReplaySubject<CarrierOfficeInfo[]> = new ReplaySubject(1);
  private selectedOfficeSubject: ReplaySubject<CarrierOfficeInfo> = new ReplaySubject(1);

  constructor(
    private carrierOfficeAddressesApiService: CarrierOfficeAddressesApiService,
    private carrierOfficesApiService: CarrierOfficesApiService,
    private userService: UserService,
    private geoLocationService: GeolocationService
  ) {}

  public initializeOffices(fullAddress: string, selectedCarrier: POST_OFFICE_CARRIER): Observable<CarrierOfficeInfo[]> {
    return this.initialCenterCoordinates$(fullAddress).pipe(
      take(1),
      switchMap((location: Location) => {
        const radiusInKm: number = getRadiusInKm(DEFAULT_VALUE_ZOOM, location.latitude);
        const locationWithRadius: LocationWithRadius = { ...location, radiusInKm };

        return this.getOffices(locationWithRadius, selectedCarrier);
      }),
      tap((offices: CarrierOfficeInfo[]) => (this.carrierOffices = offices))
    );
  }

  public getOffices(location: LocationWithRadius, selectedCarrier: POST_OFFICE_CARRIER): Observable<CarrierOfficeInfo[]> {
    return this.carrierOfficesApiService
      .getCarrierOfficeAddresses(location, selectedCarrier)
      .pipe(tap((offices: CarrierOfficeInfo[]) => (this.carrierOffices = offices)));
  }

  public selectOfficePreference(userOfficeId: string): Observable<void> {
    return this.selectedOffice$.pipe(
      take(1),
      switchMap((carrierOfficeInfo: CarrierOfficeInfo) => {
        if (userOfficeId) {
          return this.carrierOfficeAddressesApiService.createSelectedCarrierOffice(carrierOfficeInfo);
        }
        return this.carrierOfficeAddressesApiService.updateSelectedCarrierOffice(userOfficeId, carrierOfficeInfo);
      })
    );
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

  public selectOffice(selectedOfficeLocation: Location): Observable<any> {
    return this.carrierOffices$.pipe(
      map((offices: CarrierOfficeInfo[]) => {
        const selectedOffice = offices.find((office) => {
          return office.latitude === selectedOfficeLocation.latitude && office.longitude === selectedOfficeLocation.longitude;
        });

        this.selectedOffice = selectedOffice;
      })
    );
  }

  public resetSelectedOfficeInformation(): void {
    this.selectedOffice = null;
  }

  public get carrierOffices$(): Observable<CarrierOfficeInfo[]> {
    return this.carrierOfficesSubject.asObservable();
  }

  public get selectedOfficeInformation$(): Observable<CarrierOfficeSchedule> {
    return this.selectedOffice$.pipe(
      map((selectedOffice: CarrierOfficeInfo) => {
        if (!selectedOffice) {
          return null;
        }
        return {
          openingHours: selectedOffice.openingHours,
          name: selectedOffice.name,
        };
      })
    );
  }

  private get selectedOffice$(): Observable<CarrierOfficeInfo> {
    return this.selectedOfficeSubject.asObservable();
  }

  private set carrierOffices(newOffices: CarrierOfficeInfo[]) {
    this.carrierOfficesSubject.next(newOffices);
  }

  private set selectedOffice(office: CarrierOfficeInfo) {
    this.selectedOfficeSubject.next(office);
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
