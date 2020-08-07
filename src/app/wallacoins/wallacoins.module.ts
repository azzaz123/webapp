import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { wallacoinsRoutedComponents, WallacoinsRoutingModule } from './wallacoins.routes';
import { SharedModule } from '../shared/shared.module';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { BuyWallacoinsModalComponent } from './buy-wallacoins-modal/buy-wallacoins-modal.component';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material';
import { WallacoinsConfirmModalComponent } from './wallacoins-confirm-modal/wallacoins-confirm-modal.component';
import { TrackingModule } from '../core/tracking/tracking.module';
import { PackWallacoinsComponent } from './pack-wallacoins/pack-wallacoins.component';
import { NguCarouselModule } from '@ngu/carousel';
import { WallacoinsTutorialComponent } from './wallacoins-tutorial/wallacoins-tutorial.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    WallacoinsRoutingModule,
    NgbCarouselModule,
    FormsModule,
    MatIconModule,
    NguCarouselModule,
    TrackingModule
  ],
  declarations: [
    wallacoinsRoutedComponents,
    BuyWallacoinsModalComponent,
    WallacoinsConfirmModalComponent,
    PackWallacoinsComponent,
    WallacoinsTutorialComponent
  ],
  entryComponents: [BuyWallacoinsModalComponent, WallacoinsConfirmModalComponent, WallacoinsTutorialComponent]
})
export class WallacoinsModule { }
