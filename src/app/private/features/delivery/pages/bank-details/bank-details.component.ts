import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { BankAccount } from '../../interfaces/bank-account/bank-account-api.interface';
import { BankDetailsService } from '../../services/bank-details/bank-details.service';

@Component({
  selector: 'tsl-bank-details',
  templateUrl: './bank-details.component.html',
  styleUrls: ['./bank-details.component.scss'],
})
export class BankDetailsComponent implements OnInit {
  public bankAccount: BankAccount;
  public creditCard: any;
  public loading = true;

  constructor(private bankDetailsService: BankDetailsService) {}

  ngOnInit(): void {
    this.requestBankDetailsInfo();
  }

  private requestBankDetailsInfo(): void {
    this.bankDetailsService
      .get()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(([bankAccount, creditCard]: [BankAccount, any]) => {
        (this.bankAccount = bankAccount), (this.creditCard = creditCard);
      });
  }
}
