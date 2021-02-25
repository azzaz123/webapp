import { Component, Input } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'stories-lorem-ipsum',
  templateUrl: './lorem-ipsum.component.html',
})
export class LoremIpsumComponent {
  @Input() style: string;
}
