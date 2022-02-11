import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovableMapComponent } from './movable-map.component';
import { SpinnerModule } from '@shared/spinner/spinner.module';

@NgModule({
  declarations: [MovableMapComponent],
  imports: [CommonModule, SpinnerModule],
  exports: [MovableMapComponent],
})
export class MovableMapModule {}
