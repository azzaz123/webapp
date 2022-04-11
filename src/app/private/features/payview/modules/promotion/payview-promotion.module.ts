import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { ButtonModule } from '@shared/button/button.module';
import { PayviewPromotionEditorComponent } from '@private/features/payview/modules/promotion/components/editor/payview-promotion-editor.component';
import { PayviewPromotionOverviewComponent } from '@private/features/payview/modules/promotion/components/overview/payview-promotion-overview.component';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';

@NgModule({
  imports: [ButtonModule, CommonModule, FormsModule, SvgIconModule],
  declarations: [PayviewPromotionEditorComponent, PayviewPromotionOverviewComponent],
  providers: [],
  exports: [PayviewPromotionEditorComponent, PayviewPromotionOverviewComponent],
})
export class PayviewPromotionModule {}
