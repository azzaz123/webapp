import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRouteDirective } from '../directives/home-route.directive';

@NgModule({
  declarations: [HomeRouteDirective],
  exports: [HomeRouteDirective],
  imports: [CommonModule],
})
export class HomeRouteModule {}
