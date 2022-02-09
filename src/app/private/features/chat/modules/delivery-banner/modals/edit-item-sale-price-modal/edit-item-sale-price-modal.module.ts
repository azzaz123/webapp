import { NgModule } from '@angular/core';
import { ButtonModule } from '@shared/button/button.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { EditItemSalePriceModalComponent } from './edit-item-sale-price-modal.component';

@NgModule({
  imports: [ButtonModule, SvgIconModule],
  declarations: [EditItemSalePriceModalComponent],
})
export class EditItemSalePriceModalModule {}
