import { NgModule } from '@angular/core';
import { DrawerComponent } from './drawer.component';
import { CommonModule } from '@angular/common';
import { ScrollLockService } from '@public/shared/services/scroll-lock.service';

@NgModule({
  declarations: [DrawerComponent],
  imports: [CommonModule],
  providers: [ScrollLockService],
})
export class DrawerModule {}
