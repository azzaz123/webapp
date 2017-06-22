import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserModule } from './user/user.module';
import { ItemModule } from './item/item.module';

@NgModule({
  imports: [
    CommonModule,
    UserModule,
    ItemModule
  ],
  declarations: []
})
export class CoreModule { }
