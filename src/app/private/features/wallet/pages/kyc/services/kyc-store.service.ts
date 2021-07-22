import { Injectable } from '@angular/core';
import { KYCDocumentation } from '@private/features/wallet/interfaces/kyc/kyc-documentation.interface';
import { KYCNationality } from '@private/features/wallet/interfaces/kyc/kyc-nationality.interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class KYCStoreService {
  private readonly _nationality = new BehaviorSubject<KYCNationality>(null);
  private readonly _documentation = new BehaviorSubject<KYCDocumentation>(null);

  get nationality(): KYCNationality {
    return this._nationality.getValue();
  }

  get nationality$(): Observable<KYCNationality> {
    return this._nationality.asObservable();
  }

  set nationality(KYCNationality: KYCNationality) {
    this._nationality.next(KYCNationality);
  }

  get documentation(): KYCDocumentation {
    return this._documentation.getValue();
  }

  get documentation$(): Observable<KYCDocumentation> {
    return this._documentation.asObservable();
  }

  set documentation(KYCDocumentation: KYCDocumentation) {
    this._documentation.next(KYCDocumentation);
  }
}
