import { Injectable } from '@angular/core';
import { CARRIER_DROP_OFF_MODE } from '@api/core/model/delivery';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { AcceptScreenCarrier, AcceptScreenProperties } from '../../interfaces';
import { AcceptScreenService } from '../accept-screen/accept-screen.service';

@Injectable({
  providedIn: 'root',
})
export class AcceptScreenStoreService {
  private readonly propertiesSubject: BehaviorSubject<AcceptScreenProperties> = new BehaviorSubject(null);
  private readonly selectedDropOffModeByUserSubject: ReplaySubject<CARRIER_DROP_OFF_MODE> = new ReplaySubject(1);

  constructor(private acceptScreenService: AcceptScreenService) {}

  public initialize$(requestId: string): Observable<AcceptScreenProperties> {
    return this.requestProperties(requestId);
  }

  public update(requestId: string): Observable<AcceptScreenProperties> {
    return this.selectedDropOffModeByUser$.pipe(
      switchMap((selectedDropOffModeByUser: CARRIER_DROP_OFF_MODE) => this.requestProperties(requestId, selectedDropOffModeByUser))
    );
  }

  public notifySelectedDropOffModeByUser(selectedDropOffPosition: number): void {
    const currentProperties: AcceptScreenProperties = this.propertiesSubject.value;
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

  public get selectedDropOffModeByUser$(): Observable<CARRIER_DROP_OFF_MODE> {
    return this.selectedDropOffModeByUserSubject.asObservable();
  }

  private set selectedDropOffModeByUser(value: CARRIER_DROP_OFF_MODE) {
    this.selectedDropOffModeByUserSubject.next(value);
  }

  private set properties(value: AcceptScreenProperties) {
    this.propertiesSubject.next(value);
  }

  private requestProperties(
    requestId: string,
    selectedDropOffModeByUser: CARRIER_DROP_OFF_MODE = null
  ): Observable<AcceptScreenProperties> {
    return this.acceptScreenService.getAcceptScreenProperties(requestId).pipe(
      take(1),
      tap((acceptScreenProperties: AcceptScreenProperties) => {
        this.properties = acceptScreenProperties;
      })
    );
  }
}
