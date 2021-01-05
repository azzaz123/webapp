import { SharedModule } from '@shared/shared.module';
import { NgModule } from '@angular/core';
import { WallComponent } from './pages/wall.component';
import { WallRoutingModule } from './wall.routing.module';

@NgModule({
  imports: [SharedModule, WallRoutingModule],
  declarations: [WallComponent],
})
export class WallModule {}
