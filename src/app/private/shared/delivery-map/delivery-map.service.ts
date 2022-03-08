import { Inject, Injectable, LOCALE_ID } from '@angular/core';
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
import { LabeledSearchLocation } from '@public/features/search/core/services/interfaces/search-location.interface';
import { DEFAULT_LOCATIONS } from '@public/features/search/core/services/constants/default-locations';
import { APP_LOCALE } from '@configs/subdomains.config';
import { UserLocation } from '@core/user/user-response.interface';

@Injectable({
  providedIn: 'root',
})
export class DeliveryMapService {
  private carrierOfficesSubject: ReplaySubject<CarrierOfficeInfo[]> = new ReplaySubject(1);
  private selectedOfficeSubject: ReplaySubject<CarrierOfficeInfo> = new ReplaySubject(1);
  private allCarrierOfficesRequested: CarrierOfficeInfo[] = [];

  constructor(
    @Inject(LOCALE_ID) private locale: APP_LOCALE,
    private carrierOfficeAddressesApiService: CarrierOfficeAddressesApiService,
    private carrierOfficesApiService: CarrierOfficesApiService,
    private userService: UserService,
    private geoLocationService: GeolocationService
  ) {}

  public initializeOffices$(fullAddress: string, selectedCarrier: POST_OFFICE_CARRIER): Observable<CarrierOfficeInfo[]> {
    return this.initialCenterLocation$(fullAddress).pipe(
      take(1),
      switchMap((location: Location) => {
        const radiusInKm: number = getRadiusInKm(DEFAULT_VALUE_ZOOM, location.latitude);
        const locationWithRadius: LocationWithRadius = { ...location, radiusInKm };
        this.resetAllCarrierOffices();
        return this.requestOffices$(locationWithRadius, selectedCarrier);
      })
    );
  }

  public requestOffices$(location: LocationWithRadius, selectedCarrier: POST_OFFICE_CARRIER): Observable<CarrierOfficeInfo[]> {
    return this.carrierOfficesApiService.getCarrierOfficeAddresses(location, selectedCarrier).pipe(
      tap((offices: CarrierOfficeInfo[]) => {
        offices.forEach((office: CarrierOfficeInfo) => this.allCarrierOfficesRequested.push(office));
        this.carrierOffices = this.allCarrierOfficesRequested;
      })
    );
  }

  public selectOfficePreference$(userOfficeId: string): Observable<void> {
    return this.selectedOffice$.pipe(
      take(1),
      switchMap((carrierOfficeInfo: CarrierOfficeInfo) => {
        if (userOfficeId) {
          return this.carrierOfficeAddressesApiService.updateSelectedCarrierOffice(userOfficeId, carrierOfficeInfo);
        }
        return this.carrierOfficeAddressesApiService.createSelectedCarrierOffice(carrierOfficeInfo);
      })
    );
  }

  public initialCenterLocation$(fullAddress: string): Observable<Location> {
    return fullAddress ? this.geocode$(fullAddress) : this.secondaryLocation$;
  }

  public markOffice(selectedOfficeLocation: Location): void {
    this.carrierOffices$
      .pipe(
        take(1),
        tap((offices: CarrierOfficeInfo[]) => {
          const selectedOffice: CarrierOfficeInfo = offices.find(
            (office: CarrierOfficeInfo) =>
              office.latitude === selectedOfficeLocation.latitude && office.longitude === selectedOfficeLocation.longitude
          );
          this.selectedOffice = selectedOffice;
        })
      )
      .subscribe();
  }

  public resetSelectedOffice(): void {
    this.selectedOffice = null;
  }

  public get officeMarkers$(): Observable<Location[]> {
    return this.carrierOffices$.pipe(
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

  private set carrierOffices(newOffices: CarrierOfficeInfo[]) {
    this.carrierOfficesSubject.next(newOffices);
  }

  private set selectedOffice(office: CarrierOfficeInfo) {
    this.selectedOfficeSubject.next(office);
  }

  private geocode$(address: string): Observable<Location> {
    return this.geoLocationService.geocode(address).pipe(
      map((coordinate: Coordinate) => {
        return {
          latitude: coordinate.latitude,
          longitude: coordinate.longitude,
        };
      })
    );
  }

  private get selectedOffice$(): Observable<CarrierOfficeInfo> {
    return this.selectedOfficeSubject.asObservable();
  }

  private get secondaryLocation$(): Observable<Location> {
    return this.userService.getLoggedUserInformation().pipe(
      map((user: User) => {
        const userHasLocation: boolean = this.userHasLocation(user.location);

        if (userHasLocation) {
          return this.getUserLocation(user.location);
        }
        return this.fallbackLocation;
      })
    );
  }

  private get fallbackLocation(): Location {
    const fallbackLocation: LabeledSearchLocation = DEFAULT_LOCATIONS[this.locale] || DEFAULT_LOCATIONS.en;

    return {
      latitude: +fallbackLocation.latitude,
      longitude: +fallbackLocation.longitude,
    };
  }

  private userHasLocation(location: UserLocation): boolean {
    return !!(location?.latitude || location?.approximated_latitude) && !!(location?.longitude || location?.approximated_longitude);
  }

  private getUserLocation(location: UserLocation): Location {
    return {
      latitude: location.latitude || location.approximated_latitude,
      longitude: location.longitude || location.approximated_longitude,
    };
  }

  private resetAllCarrierOffices(): void {
    this.allCarrierOfficesRequested = [];
  }
}
