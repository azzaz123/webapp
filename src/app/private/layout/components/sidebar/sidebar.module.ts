import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { SharedModule } from '@shared/shared.module';
import { SidebarComponent } from './components/sidebar.component';

@NgModule({
  declarations: [SidebarComponent],
  imports: [RouterModule, SharedModule, SvgIconModule],
  exports: [SidebarComponent],
})
export class SidebarModule {}
