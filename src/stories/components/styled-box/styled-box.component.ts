import { Component, DoCheck, Input } from '@angular/core';
import { NgStyle } from '@angular/common';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'stories-styled-box',
  templateUrl: './styled-box.component.html',
})
export class StyledBoxComponent implements DoCheck {
  @Input() style: NgStyle;
  @Input() text?: string;

  public ngDoCheck(): void {
    if (this.text) {
      console.log(this.text);
    }
  }
}
