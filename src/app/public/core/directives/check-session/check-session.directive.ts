import { Directive, HostListener } from '@angular/core';
import { CheckSessionService } from '@public/core/services/check-session/check-session.service';

@Directive({
  selector: '[tslCheckSession]',
})
export class CheckSessionDirective {
  constructor(private checkSessionService: CheckSessionService) {}

  @HostListener('click', ['$event']) onClick($event) {
    const loginSource = $event.currentTarget.getAttribute('data-loginsource');
    this.checkSessionService.checkSessionAction(loginSource);
  }
}
