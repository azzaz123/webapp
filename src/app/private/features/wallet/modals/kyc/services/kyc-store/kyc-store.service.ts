import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { KYCSpecifications } from '../../interfaces/kyc-specifications.interface';

@Injectable()
export class KYCStoreService {
  private readonly specificationsSubject = new BehaviorSubject<KYCSpecifications>({
    nationality: null,
    documentation: null,
    imageMethod: null,
  });

  get specifications(): KYCSpecifications {
    return this.specificationsSubject.getValue();
  }

  get specifications$(): Observable<KYCSpecifications> {
    return this.specificationsSubject.asObservable();
  }

  set specifications(specifications: KYCSpecifications) {
    this.specificationsSubject.next(specifications);
  }
}
