import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerComponent } from './spinner/spinner.component';
import { MatIconModule } from '@angular/material';
import { AdComponent } from './ad/ad.component';
import { CustomCurrencyPipe } from './custom-currency/custom-currency.pipe';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { CardModule } from './card/card.module';
import { ReactiveFormsModule } from '@angular/forms';
import { GeolocationModule } from './geolocation/geolocation.module';
import { ExitConfirmGuard } from './guards/exit-confirm.guard';
import { RestrictInputDirective } from './restrict-input/restrict-input.directive';
import { TutorialGuard } from './guards/tutorial.guard';
import { HeaderComponent } from './header/header.component';
import { UrgentCheckboxComponent } from './urgent-checkbox/urgent-checkbox.component';
import { ButtonComponent } from './button/button.component';

@NgModule({
  imports: [
    CardModule,
    CommonModule,
    MatIconModule,
    NgbModule.forRoot(),
    ReactiveFormsModule,
    GeolocationModule
  ],
  exports: [
    CardModule,
    CommonModule,
    SpinnerComponent,
    AdComponent,
    CustomCurrencyPipe,
    RestrictInputDirective,
    HeaderComponent,
    ButtonComponent,
    UrgentCheckboxComponent
  ],
  declarations: [
    AdComponent,
    ConfirmationModalComponent,
    SpinnerComponent,
    CustomCurrencyPipe,
    RestrictInputDirective,
    HeaderComponent,
    ButtonComponent,
    UrgentCheckboxComponent
  ],
  providers: [
    DecimalPipe,
    ExitConfirmGuard,
    TutorialGuard
  ],
  entryComponents: [
    ConfirmationModalComponent
  ]
})
export class SharedModule { }
