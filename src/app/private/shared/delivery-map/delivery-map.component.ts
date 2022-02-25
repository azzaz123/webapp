import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Location } from '@api/core/model';
import { DeliveryAddress } from '@api/core/model/delivery/address/delivery-address.interface';
import { CarrierOfficeInfo } from '@api/core/model/delivery/carrier-office-info/carrier-office-info.interface';
import { POST_OFFICE_CARRIER } from '@api/core/model/delivery/post-offices-carriers.type';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
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

  constructor(private deliveryMapService: DeliveryMapService) {}

  ngOnInit(): void {
    this.initializeOffices$ = this.deliveryMapService.initializeOffices(this.fullAddress, this.selectedCarrier);
    this.initialCenterCoordinates$ = this.deliveryMapService.initialCenterCoordinates$(this.fullAddress);
  }

  public showSelectedOfficeInfo(officeLocation: Location): void {
    this.deliveryMapService.getSelectedOfficeInformation(officeLocation).pipe(take(1)).subscribe();
  }
}
