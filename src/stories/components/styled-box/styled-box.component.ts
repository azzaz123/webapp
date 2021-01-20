import { Component, Input } from '@angular/core';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'stories-styled-box',
  templateUrl: './styled-box.component.html',
})
export class StyledBoxComponent {
  @Input() style: NgStyle;
}
