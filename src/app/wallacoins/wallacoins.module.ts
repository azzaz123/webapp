import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { wallacoinsRoutedComponents, WallacoinsRoutingModule } from './wallacoins.routes';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    WallacoinsRoutingModule
  ],
  declarations: [
    wallacoinsRoutedComponents
  ]
})
export class WallacoinsModule { }
