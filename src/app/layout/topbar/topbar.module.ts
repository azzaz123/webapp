import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TopbarComponent } from './components/topbar/topbar.component';
import { SuggesterComponent } from './components/suggester/suggester.component';
import { SuggesterService } from './core/services/suggester.service';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '@shared/shared.module';
import { FormsModule } from '@angular/forms';
import { CustomCurrencyModule } from '@shared/pipes/custom-currency/custom-currency.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    RouterModule,
    NgbTypeaheadModule,
    CustomCurrencyModule,
  ],
  exports: [TopbarComponent, SuggesterComponent],
  declarations: [TopbarComponent, SuggesterComponent],
  providers: [SuggesterService],
})
export class TopbarModule {}
