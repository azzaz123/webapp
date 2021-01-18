import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ItemFlagModule } from './components/item-flag/item-flag.module';

@NgModule({
  imports: [CommonModule, ItemFlagModule],
  exports: [ItemFlagModule],
})
export class PublicSharedModule {}
