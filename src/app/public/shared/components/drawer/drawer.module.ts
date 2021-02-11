import { NgModule } from '@angular/core';
import { DrawerComponent } from './drawer.component';
import { CommonModule } from '@angular/common';
import { ScrollLockService } from '@public/shared/services/scroll-lock.service';
import { ButtonModule } from '@shared/button/button.module';

@NgModule({
  declarations: [DrawerComponent],
  imports: [CommonModule, ButtonModule],
  providers: [ScrollLockService],
})
export class DrawerModule {}
