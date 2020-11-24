import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  wallacoinsRoutedComponents,
  WallacoinsRoutingModule,
} from './wallacoins.routing.module';
import { SharedModule } from '../../shared/shared.module';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { BuyWallacoinsModalComponent } from './components/buy-wallacoins-modal/buy-wallacoins-modal.component';
import { FormsModule } from '@angular/forms';
import { WallacoinsConfirmModalComponent } from './components/wallacoins-confirm-modal/wallacoins-confirm-modal.component';
import { TrackingModule } from '../../core/tracking/tracking.module';
import { PackWallacoinsComponent } from './components/pack-wallacoins/pack-wallacoins.component';
import { WallacoinsTutorialComponent } from './components/wallacoins-tutorial/wallacoins-tutorial.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    WallacoinsRoutingModule,
    NgbCarouselModule,
    FormsModule,
    TrackingModule,
    NgbCarouselModule,
  ],
  declarations: [
    wallacoinsRoutedComponents,
    BuyWallacoinsModalComponent,
    WallacoinsConfirmModalComponent,
    PackWallacoinsComponent,
    WallacoinsTutorialComponent,
  ],
  entryComponents: [
    BuyWallacoinsModalComponent,
    WallacoinsConfirmModalComponent,
    WallacoinsTutorialComponent,
  ],
})
export class WallacoinsModule {}
