import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Location, LocationWithRatio } from '@api/core/model';
import { CarrierOfficeInfo } from '@api/core/model/delivery/carrier-office-info/carrier-office-info.interface';
import { POST_OFFICE_CARRIER } from '@api/core/model/delivery/post-offices-carriers.type';
import { ErrorsService } from '@core/errors/errors.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { SearchableMovableMapComponent } from '../searchable-movable-map/searchable-movable-map.component';
import { DeliveryMapService } from './delivery-map.service';

@Component({
  selector: 'tsl-delivery-map',
  templateUrl: './delivery-map.component.html',
  styleUrls: ['./delivery-map.component.scss'],
})
export class DeliveryMapComponent implements OnInit {
  @Input() fullAddress: string;
  @Input() selectedCarrier: POST_OFFICE_CARRIER;
  @ViewChild(SearchableMovableMapComponent, { static: true }) searchableMovableMap: SearchableMovableMapComponent;
  public initializeOffices$: Observable<CarrierOfficeInfo[]>;
  public initialCenterCoordinates$: Observable<Location>;
  public markers$: Observable<Location[]> = this.deliveryMapService.officeMarkers$;
  public offices$: Observable<CarrierOfficeInfo[]> = this.deliveryMapService.carrierOffices$;
  public selectedOfficeInfo$: Observable<string[]> = this.deliveryMapService.selectedOfficeInformation$;

  constructor(private deliveryMapService: DeliveryMapService, private errorsService: ErrorsService) {}

  ngOnInit(): void {
    this.initializeOffices$ = this.deliveryMapService.initializeOffices(this.fullAddress, this.selectedCarrier).pipe(
      tap(
        () => {},
        () => {
          this.showError();
        }
      )
    );
    this.initialCenterCoordinates$ = this.deliveryMapService.initialCenterCoordinates$(this.fullAddress);
  }

  public selectOffice(officeLocation: Location): void {
    this.deliveryMapService.selectOffice(officeLocation).pipe(take(1)).subscribe();
  }

  public requestOffices(newLocationWithRatio: LocationWithRatio): void {
    this.deliveryMapService
      .getOffices(newLocationWithRatio.latitude, newLocationWithRatio.longitude, newLocationWithRatio.ratioInKm, this.selectedCarrier)
      .pipe(take(1))
      .subscribe(
        () => {},
        () => {
          this.showError();
        }
      );
  }

  public resetSelectedOfficeInformation(): void {
    this.deliveryMapService.resetSelectedOfficeInformation();
  }

  public selectOfficePreference(): void {
    if (!this.fullAddress) {
      // TODO: show modal 		Date: 2022/02/25
      return;
    }

    this.deliveryMapService.selectOfficePreference().subscribe(
      () => {},
      () => {
        this.showError();
      }
    );
  }

  private showError(): void {
    this.errorsService.i18nError(TRANSLATION_KEY.DELIVERY_MAP_GENERIC_ERROR);
  }
}
