import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class PayDeeplinkService {
  constructor() {}

  public handle(rawDeeplink: string): Observable<''> {
    return of('');
  }
}
