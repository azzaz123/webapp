import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AcceptScreenProperties } from '../../interfaces';
import { AcceptScreenService } from '../accept-screen/accept-screen.service';

@Injectable()
export class AcceptScreenStoreService {
  private readonly propertiesSubject: ReplaySubject<AcceptScreenProperties> = new ReplaySubject(1);

  constructor(private acceptScreenService: AcceptScreenService) {}

  public initialize(requestId: string): void {
    this.acceptScreenService.getAcceptScreenProperties(requestId).pipe(
      tap((acceptScreenProperties: AcceptScreenProperties) => {
        this.properties = acceptScreenProperties;
      })
    );
  }

  public get properties$(): Observable<AcceptScreenProperties> {
    return this.propertiesSubject.asObservable();
  }

  private set properties(value: AcceptScreenProperties) {
    this.propertiesSubject.next(value);
  }
}
