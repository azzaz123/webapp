import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NavLinksComponent } from './nav-links.component';

@NgModule({
  imports: [CommonModule],
  declarations: [NavLinksComponent],
  exports: [NavLinksComponent],
})
export class NavLinksModule {}
