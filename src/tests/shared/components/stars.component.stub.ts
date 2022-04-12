import { Component, Input } from '@angular/core';

@Component({
  selector: 'tsl-stars',
  template: '',
})
export class StarsStubComponent {
  @Input() stars: number;
  @Input() normalized;
  @Input() width;
  @Input() height;
}
