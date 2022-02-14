import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '@shared/button/button.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { EditItemSalePriceModalComponent } from './edit-item-sale-price-modal.component';

@NgModule({
  imports: [CommonModule, ButtonModule, SvgIconModule, ReactiveFormsModule],
  declarations: [EditItemSalePriceModalComponent],
})
export class EditItemSalePriceModalModule {}
