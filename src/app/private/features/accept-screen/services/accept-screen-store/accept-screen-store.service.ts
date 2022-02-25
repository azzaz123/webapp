import { Injectable } from '@angular/core';
import { CARRIER_DROP_OFF_MODE } from '@api/core/model/delivery';
import { POST_OFFICE_CARRIER } from '@api/core/model/delivery/post-offices-carriers.type';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { AcceptScreenCarrier, AcceptScreenProperties } from '../../interfaces';
import { AcceptScreenService } from '../accept-screen/accept-screen.service';

@Injectable({
  providedIn: 'root',
})
export class AcceptScreenStoreService {
  private readonly propertiesSubject: BehaviorSubject<AcceptScreenProperties> = new BehaviorSubject(null);
  constructor(private acceptScreenService: AcceptScreenService) {}

  public async initialize(requestId: string): Promise<void> {
    const properties: AcceptScreenProperties = await this.acceptScreenService.getAcceptScreenProperties(requestId).toPromise();
    this.properties = properties;
  }

  public async update(requestId: string): Promise<void> {
    const selectedCarrierMode: CARRIER_DROP_OFF_MODE = this.propertiesSubject.value.carriers.find(
      (carrier: AcceptScreenCarrier) => carrier.isSelected
    ).type;
    const newProperties: AcceptScreenProperties = await this.acceptScreenService
      .getAcceptScreenProperties(requestId, selectedCarrierMode)
      .toPromise();

    this.properties = newProperties;
  }

  public selectNewDropOffMode(carrierPosition: number): void {
    const currentProperties: AcceptScreenProperties = this.properties;
    const newCarriers: AcceptScreenCarrier[] = currentProperties.carriers.map((carrier: AcceptScreenCarrier, index: number) => {
      carrier.isSelected = index === carrierPosition;
      return carrier;
    });

    this.properties = { ...currentProperties, carriers: newCarriers };
  }

  public rejectRequest(requestId: string): Observable<void> {
    return this.acceptScreenService.rejectRequest(requestId);
  }

  public get properties$(): Observable<AcceptScreenProperties> {
    return this.propertiesSubject.pipe(filter((properties: AcceptScreenProperties) => !!properties));
  }

  public get carrierSelectedIndex$(): Observable<number> {
    return this.properties$.pipe(
      map((properties: AcceptScreenProperties) => properties.carriers.findIndex((carrier: AcceptScreenCarrier) => carrier.isSelected))
    );
  }

  public get carrierSelectedName$(): Observable<POST_OFFICE_CARRIER> {
    return this.properties$.pipe(
      map((properties: AcceptScreenProperties) => properties.carriers.find((carrier: AcceptScreenCarrier) => carrier.isSelected).name)
    );
  }

  private get properties(): AcceptScreenProperties {
    return this.propertiesSubject.value;
  }

  private set properties(value: AcceptScreenProperties) {
    this.propertiesSubject.next(value);
  }
}
