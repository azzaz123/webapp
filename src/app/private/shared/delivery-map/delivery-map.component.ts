import { Component, Input, ViewChild, Output, EventEmitter, OnDestroy, SimpleChanges, OnChanges } from '@angular/core';
import { Location, LocationWithRadius } from '@api/core/model';
import { CarrierOfficeInfo, CarrierOfficeSchedule } from '@api/core/model/delivery/carrier-office-info/carrier-office-info.interface';
import { POST_OFFICE_CARRIER } from '@api/core/model/delivery/post-offices-carriers.type';
import { ErrorsService } from '@core/errors/errors.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { SearchableMovableMapComponent } from '../searchable-movable-map/searchable-movable-map.component';
import { DeliveryMapService } from './delivery-map.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '@shared/confirmation-modal/confirmation-modal.component';
import { COLORS } from '@core/colors/colors-constants';
import { I18nService } from '@core/i18n/i18n.service';

@Component({
  selector: 'tsl-delivery-map',
  templateUrl: './delivery-map.component.html',
  styleUrls: ['./delivery-map.component.scss'],
})
export class DeliveryMapComponent implements OnChanges, OnDestroy {
  @Input() userOfficeId: string;
  @Input() fullAddress: string;
  @Input() selectedCarrier: POST_OFFICE_CARRIER;
  @Output() goToDeliveryAddress: EventEmitter<void> = new EventEmitter();
  @Output() selectedOfficeSucceeded: EventEmitter<void> = new EventEmitter();
  @ViewChild(SearchableMovableMapComponent, { static: true }) searchableMovableMap: SearchableMovableMapComponent;
  public initializeOffices$: Observable<CarrierOfficeInfo[]>;
  public centerLocation$: Observable<Location>;
  public markers$: Observable<Location[]> = this.deliveryMapService.officeMarkers$;
  public offices$: Observable<CarrierOfficeInfo[]> = this.deliveryMapService.carrierOffices$;
  public selectedOfficeInfo$: Observable<CarrierOfficeSchedule> = this.deliveryMapService.selectedOfficeInformation$;

  constructor(
    private deliveryMapService: DeliveryMapService,
    private errorsService: ErrorsService,
    private modalService: NgbModal,
    private i18nService: I18nService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.fullAddress) {
      this.initializeOffices$ = this.deliveryMapService.initializeOffices$(this.fullAddress, this.selectedCarrier).pipe(
        tap(
          () => {},
          () => {
            this.showError();
          }
        )
      );
      this.centerLocation$ = this.deliveryMapService.initialCenterLocation$(this.fullAddress);
    }
  }

  ngOnDestroy(): void {
    this.resetSelectedOffice();
  }

  public markOffice(officeLocation: Location): void {
    this.deliveryMapService.markOffice(officeLocation);
  }

  public requestOffices(newLocationWithRadius: LocationWithRadius): void {
    this.deliveryMapService
      .requestOffices$(newLocationWithRadius, this.selectedCarrier)
      .pipe(take(1))
      .subscribe(
        () => {},
        () => {
          this.showError();
        }
      );
  }

  public resetSelectedOffice(): void {
    this.deliveryMapService.resetSelectedOffice();
  }

  public selectOfficePreference(): void {
    if (!this.fullAddress) {
      return this.openDeliveryAddressWarning();
    }

    this.deliveryMapService.selectOfficePreference$(this.userOfficeId).subscribe(
      () => {
        this.selectedOfficeSucceeded.emit();
      },
      () => {
        this.showError();
      }
    );
  }

  private openDeliveryAddressWarning(): void {
    const modalRef: NgbModalRef = this.modalService.open(ConfirmationModalComponent);
    modalRef.componentInstance.properties = {
      description: this.i18nService.translate(TRANSLATION_KEY.DELIVERY_MAP_LOCATION_POP_UP_DESCRIPTION),
      confirmMessage: this.i18nService.translate(TRANSLATION_KEY.DELIVERY_MAP_LOCATION_POP_UP_ADD_BUTTON),
      cancelMessage: this.i18nService.translate(TRANSLATION_KEY.DELIVERY_MAP_LOCATION_POP_UP_CANCEL_BUTTON),
      confirmColor: COLORS.WALLA_MAIN,
      cancelColor: COLORS.WALLA_MAIN,
    };

    modalRef.result.then(
      () => {
        this.goToDeliveryAddress.emit();
      },
      () => {}
    );
  }

  private showError(): void {
    this.errorsService.i18nError(TRANSLATION_KEY.DELIVERY_MAP_GENERIC_ERROR);
  }
}
