import { NgModule } from '@angular/core';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ReactivateItemModalComponent } from './components/reactivate-item-modal/reactivate-item-modal.component';

@NgModule({
  imports: [SvgIconModule],
  declarations: [ReactivateItemModalComponent],
  providers: [NgbActiveModal],
})
export class ReactivateItemModule {}
