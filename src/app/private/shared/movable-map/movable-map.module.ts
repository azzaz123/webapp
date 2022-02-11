import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovableMapComponent } from './movable-map.component';

@NgModule({
  declarations: [MovableMapComponent],
  imports: [CommonModule],
  exports: [MovableMapComponent],
})
export class MovableMapModule {}
