import { Component, Input } from '@angular/core';

@Component({
  selector: 'tsl-translate-button',
  templateUrl: './translate-button.component.html',
  styleUrls: ['./translate-button.component.scss'],
})
export class TranslateButtonComponent {
  @Input() isTranslated: boolean;
}
