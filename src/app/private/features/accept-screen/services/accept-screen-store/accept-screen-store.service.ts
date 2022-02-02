import { Injectable } from '@angular/core';
import { CARRIER_DROP_OFF_MODE } from '@api/core/model/delivery';
import { Observable, ReplaySubject } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { AcceptScreenCarrier, AcceptScreenProperties } from '../../interfaces';
import { AcceptScreenService } from '../accept-screen/accept-screen.service';

@Injectable({
  providedIn: 'root',
})
export class AcceptScreenStoreService {
  private readonly propertiesSubject: ReplaySubject<AcceptScreenProperties> = new ReplaySubject(1);
  private readonly selectedDropOffModeByUserSubject: ReplaySubject<CARRIER_DROP_OFF_MODE> = new ReplaySubject(1);

  constructor(private acceptScreenService: AcceptScreenService) {}

  public initialize(requestId: string): void {
    this.acceptScreenService
      .getAcceptScreenProperties(requestId)
      .pipe(
        take(1),
        tap((acceptScreenProperties: AcceptScreenProperties) => {
          this.properties = acceptScreenProperties;
        })
      )
      .subscribe();
  }

  public notifySelectedDropOffModeByUser(selectedDropOffPosition: number, currentProperties: AcceptScreenProperties): void {
    const selectedDropOffMode: CARRIER_DROP_OFF_MODE = currentProperties.carriers[selectedDropOffPosition].type;
    const newCarriers: AcceptScreenCarrier[] = currentProperties.carriers.map((carrier: AcceptScreenCarrier, index: number) => {
      carrier.isSelected = index === selectedDropOffPosition;
      return carrier;
    });

    this.selectedDropOffModeByUser = selectedDropOffMode;
    this.properties = { ...currentProperties, carriers: newCarriers };
  }

  public get properties$(): Observable<AcceptScreenProperties> {
    return this.propertiesSubject.asObservable();
  }

  private set selectedDropOffModeByUser(value: CARRIER_DROP_OFF_MODE) {
    this.selectedDropOffModeByUserSubject.next(value);
  }

  private set properties(value: AcceptScreenProperties) {
    this.propertiesSubject.next(value);
  }
}
