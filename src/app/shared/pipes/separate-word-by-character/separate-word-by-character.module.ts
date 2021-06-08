import { NgModule } from '@angular/core';
import { SeparateWordByCharacterPipe } from './separate-word-by-character.pipe';

@NgModule({
  declarations: [SeparateWordByCharacterPipe],
  exports: [SeparateWordByCharacterPipe],
})
export class SeparateWordByCharacterModule {}
