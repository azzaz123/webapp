import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { wallacoinsRoutedComponents, WallacoinsRoutingModule } from './wallacoins.routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { BuyWallacoinsModalComponent } from './components/buy-wallacoins-modal/buy-wallacoins-modal.component';
import { FormsModule } from '@angular/forms';
import { WallacoinsConfirmModalComponent } from './components/wallacoins-confirm-modal/wallacoins-confirm-modal.component';
import { PackWallacoinsComponent } from './components/pack-wallacoins/pack-wallacoins.component';
import { WallacoinsTutorialComponent } from './components/wallacoins-tutorial/wallacoins-tutorial.component';
import { CustomCurrencyModule } from '@shared/pipes/custom-currency/custom-currency.module';

@NgModule({
  imports: [CommonModule, SharedModule, WallacoinsRoutingModule, NgbCarouselModule, FormsModule, NgbCarouselModule, CustomCurrencyModule],
  declarations: [
    wallacoinsRoutedComponents,
    BuyWallacoinsModalComponent,
    WallacoinsConfirmModalComponent,
    PackWallacoinsComponent,
    WallacoinsTutorialComponent,
  ],
  entryComponents: [BuyWallacoinsModalComponent, WallacoinsConfirmModalComponent, WallacoinsTutorialComponent],
})
export class WallacoinsModule {}
