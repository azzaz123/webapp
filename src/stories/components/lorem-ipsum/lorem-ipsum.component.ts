import { Component, Input } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'stories-lorem-ipsum',
  templateUrl: './lorem-ipsum.component.html',
})
export class LoremIpsumComponent {
  @Input() style: string;
}
