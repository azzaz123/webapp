import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { CountryOptionsAndDefault } from '@private/features/delivery/interfaces/delivery-countries/delivery-countries-api.interface';
import { DeliveryCountriesService } from '@private/features/delivery/services/countries/delivery-countries/delivery-countries.service';
import { StepperComponent } from '@shared/stepper/stepper.component';
import { Observable } from 'rxjs';
import { AcceptScreenProperties } from '../../interfaces';
import { AcceptScreenStoreService } from '../../services/accept-screen-store/accept-screen-store.service';

@Component({
  selector: 'tsl-accept-screen-modal',
  templateUrl: './accept-screen-modal.component.html',
  styleUrls: ['./accept-screen-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AcceptScreenModalComponent implements OnInit {
  @ViewChild(StepperComponent, { static: true }) stepper: StepperComponent;

  public requestId: string;
  public acceptScreenProperties$: Observable<AcceptScreenProperties>;
  public acceptScreenCountries$: Observable<CountryOptionsAndDefault>;

  constructor(private acceptScreenStoreService: AcceptScreenStoreService, private deliveryCountries: DeliveryCountriesService) {}

  ngOnInit(): void {
    this.acceptScreenStoreService.initialize(this.requestId);
    this.acceptScreenProperties$ = this.acceptScreenStoreService.properties$;
    this.acceptScreenCountries$ = this.deliveryCountries.getCountriesAsOptionsAndDefault();
  }

  public goToDeliveryAddress(): void {
    this.stepper.goNext();
  }
}
