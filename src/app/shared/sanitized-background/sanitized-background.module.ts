import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SanitizedBackgroundDirective } from './sanitized-background.directive';

@NgModule({
  exports: [SanitizedBackgroundDirective],
  declarations: [SanitizedBackgroundDirective],
})
export class SanitizedBackgroundModule {}
