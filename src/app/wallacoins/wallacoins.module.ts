import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { wallacoinsRoutedComponents, WallacoinsRoutingModule } from './wallacoins.routes';
import { SharedModule } from '../shared/shared.module';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    WallacoinsRoutingModule,
    NgbCarouselModule
  ],
  declarations: [
    wallacoinsRoutedComponents
  ]
})
export class WallacoinsModule { }
