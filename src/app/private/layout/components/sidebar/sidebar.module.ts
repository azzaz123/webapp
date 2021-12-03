import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { SharedModule } from '@shared/shared.module';
import { SidebarComponent } from './components/sidebar.component';
import { SidebarService } from './core/services/sidebar.service';

@NgModule({
  declarations: [SidebarComponent],
  imports: [RouterModule, SharedModule, SvgIconModule],
  exports: [SidebarComponent],
  providers: [SidebarService],
})
export class SidebarModule {}
