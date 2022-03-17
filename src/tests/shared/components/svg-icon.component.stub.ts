import { Component, Input } from '@angular/core';
import { SVG_SIZE_UNIT } from '@shared/svg-icon/svg-icon.component';

@Component({
  selector: 'tsl-svg-icon',
  template: '',
})
export class SvgIconStubComponent {
  @Input() src: string;
  @Input() fill: string;
  @Input() width: number;
  @Input() height: number;
  @Input() sizeUnit: SVG_SIZE_UNIT = SVG_SIZE_UNIT.PIXELS;
}
