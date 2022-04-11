import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { WebViewModalComponent } from './components/web-view-modal.component';
import { WebViewModalService } from './services/web-view-modal.service';

@NgModule({
  declarations: [WebViewModalComponent],
  imports: [CommonModule, SvgIconModule],
  providers: [WebViewModalService],
})
export class WebViewModalModule {}
