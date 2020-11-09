import { Directive, HostBinding } from '@angular/core';

// declare directives for <ng-content> component

@Directive({
  selector: 'tsl-card-image, [tslCardImage]',
})
export class CardImageDirective {
  @HostBinding('class.tsl-card-image') cardImage = true;
}

@Directive({
  selector: 'tsl-card-content, [tslCardContent]',
})
export class CardContentDirective {
  @HostBinding('class.tsl-card-content') cardContent = true;
}

@Directive({
  selector: 'tsl-card-footer, [tslCardFooter]',
})
export class CardFooterDirective {
  @HostBinding('class.tsl-card-footer') cardFooter = true;
}
