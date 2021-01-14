import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemCardListComponent } from './item-card-list.component';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ItemCardModule } from '@public/shared/components/item-card/item-card.module';
import { ItemApiModule } from '@public/core/services/api/item/item-api.module';
import { ItemCardService } from '@public/core/services/item-card/item-card.service';
import { PublicPipesModule } from '@public/core/pipes/public-pipes.module';

@NgModule({
  declarations: [ItemCardListComponent],
  imports: [CommonModule, ItemCardModule, ItemApiModule, PublicPipesModule],
  exports: [ItemCardListComponent],
  providers: [DeviceDetectorService, ItemCardService],
})
export class ItemCardListModule {}
