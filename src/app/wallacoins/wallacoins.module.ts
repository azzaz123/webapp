import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { wallacoinsRoutedComponents, WallacoinsRoutingModule } from './wallacoins.routes';
import { SharedModule } from '../shared/shared.module';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { BuyWallacoinsModalComponent } from './buy-wallacoins-modal/buy-wallacoins-modal.component';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material';
import { WallacoinsConfirmModalComponent } from './wallacoins-confirm-modal/wallacoins-confirm-modal.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    WallacoinsRoutingModule,
    NgbCarouselModule,
    FormsModule,
    MatIconModule
  ],
  declarations: [
    wallacoinsRoutedComponents,
    BuyWallacoinsModalComponent,
    WallacoinsConfirmModalComponent
  ],
  entryComponents: [BuyWallacoinsModalComponent, WallacoinsConfirmModalComponent]
})
export class WallacoinsModule { }
