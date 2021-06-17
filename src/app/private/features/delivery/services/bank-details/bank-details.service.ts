import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { BankAccountService } from '../bank-account/bank-account.service';

@Injectable()
export class BankDetailsService {
  constructor(private bankAccountService: BankAccountService) {}

  get(): Observable<any[]> {
    return forkJoin([this.bankAccountService.get(), of(null)]);
  }
}
