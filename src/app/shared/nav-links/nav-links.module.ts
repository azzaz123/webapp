import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { NavLinksComponent } from './nav-links.component';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [NavLinksComponent],
  exports: [NavLinksComponent],
})
export class NavLinksModule {}
