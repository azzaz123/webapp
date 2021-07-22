import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { KYCSpecifications } from '../interfaces/kyc-specifications.interface';

@Injectable()
export class KYCStoreService {
  private readonly _specifications = new BehaviorSubject<KYCSpecifications>({
    nationality: null,
    documentation: null,
    imageMethod: null,
  });

  get specifications(): KYCSpecifications {
    return this._specifications.getValue();
  }

  get specifications$(): Observable<KYCSpecifications> {
    return this._specifications.asObservable();
  }

  set specifications(specifications: KYCSpecifications) {
    this._specifications.next(specifications);
  }
}
