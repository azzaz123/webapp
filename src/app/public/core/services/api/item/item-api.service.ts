import { NgModule } from '@angular/core';
import { ItemApiService } from './item-api.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [HttpClientModule],
  providers: [ItemApiService],
})
export class ItemApiModule {}
