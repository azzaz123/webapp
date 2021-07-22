import { Injectable } from '@angular/core';
import { KYCDocumentation } from '@private/features/wallet/interfaces/kyc/kyc-documentation.interface';
import { KYCNationality } from '@private/features/wallet/interfaces/kyc/kyc-nationality.interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class KYCStoreService {
  private readonly _KYCNationality = new BehaviorSubject<KYCNationality>(null);
  private readonly _KYCDocumentation = new BehaviorSubject<KYCDocumentation>(null);

  get KYCNationality(): KYCNationality {
    return this._KYCNationality.getValue();
  }

  get KYCNationality$(): Observable<KYCNationality> {
    return this._KYCNationality.asObservable();
  }

  set KYCNationality(KYCNationality: KYCNationality) {
    this._KYCNationality.next(KYCNationality);
  }

  get KYCDocumentation(): KYCDocumentation {
    return this._KYCDocumentation.getValue();
  }

  get KYCDocumentation$(): Observable<KYCDocumentation> {
    return this._KYCDocumentation.asObservable();
  }

  set KYCDocumentation(KYCDocumentation: KYCDocumentation) {
    this._KYCDocumentation.next(KYCDocumentation);
  }
}
