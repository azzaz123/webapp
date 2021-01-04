import { Directive, HostListener } from '@angular/core';
import { CheckSessionService } from '@public/core/services/check-session/check-session.service';

@Directive({
  selector: '[tslCheckSession]',
})
export class CheckSessionDirective {
  constructor(private checkSessionService: CheckSessionService) {}

  @HostListener('click') onClick() {
    this.checkSessionService.checkSessionAction();
  }
}
