import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BumpTutorialComponent } from './bump-tutorial.component';
import { BumpTutorialService } from './services/bump-tutorial.service';

@NgModule({
  declarations: [BumpTutorialComponent],
  providers: [BumpTutorialService],
  imports: [CommonModule],
  exports: [BumpTutorialComponent],
})
export class BumpTutorialModule {}
