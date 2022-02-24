import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Location } from '@api/core/model';
import { DeliveryAddress } from '@api/core/model/delivery/address/delivery-address.interface';
import { CarrierOfficeInfo } from '@api/core/model/delivery/carrier-office-info/carrier-office-info.interface';
import { POST_OFFICE_CARRIER } from '@api/core/model/delivery/post-offices-carriers.type';
import { Observable } from 'rxjs';
import { SearchableMovableMapComponent } from '../searchable-movable-map/searchable-movable-map.component';
import { DeliveryMapService } from './delivery-map.service';

@Component({
  selector: 'tsl-delivery-map',
  templateUrl: './delivery-map.component.html',
  styleUrls: ['./delivery-map.component.scss'],
})
export class DeliveryMapComponent implements OnInit {
  @Input() deliveryAddress: DeliveryAddress;
  @Input() selectedCarrier: POST_OFFICE_CARRIER;
  @ViewChild(SearchableMovableMapComponent, { static: true }) searchableMovableMap: SearchableMovableMapComponent;
  public initialOffices$: Observable<CarrierOfficeInfo[]>;
  public initialCenterCoordinates$: Observable<Location>;
  public markers$: Observable<Location[]> = this.deliveryMapService.officeMarkers$;

  constructor(private deliveryMapService: DeliveryMapService) {}

  ngOnInit(): void {
    this.initialOffices$ = this.deliveryMapService.getInitialOffices(this.deliveryAddress, this.selectedCarrier);
    this.initialCenterCoordinates$ = this.deliveryMapService.initialCenterCoordinates$(this.deliveryAddress);
  }
}
