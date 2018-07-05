import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { wallacoinsRoutedComponents, WallacoinsRoutingModule } from './wallacoins.routes';

@NgModule({
  imports: [
    CommonModule,
    WallacoinsRoutingModule
  ],
  declarations: [
    wallacoinsRoutedComponents
  ]
})
export class WallacoinsModule { }
