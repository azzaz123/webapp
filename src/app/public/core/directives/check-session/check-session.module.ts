import { NgModule } from '@angular/core';
import { CheckSessionDirective } from './check-session.directive';
import { CheckSessionService } from '@public/core/services/check-session/check-session.service';

@NgModule({
  declarations: [CheckSessionDirective],
  exports: [CheckSessionDirective],
  providers: [CheckSessionService],
})
export class CheckSessionModule {}
