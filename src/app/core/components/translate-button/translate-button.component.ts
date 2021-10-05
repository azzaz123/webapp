import { Component, Input } from '@angular/core';
import { TranslateButtonCopies } from '@core/components/translate-button/interfaces';

@Component({
  selector: 'tsl-translate-button',
  templateUrl: './translate-button.component.html',
  styleUrls: ['./translate-button.component.scss'],
})
export class TranslateButtonComponent {
  @Input() isTranslated: boolean;
  @Input() copies: TranslateButtonCopies;
  @Input() disabled: boolean;
}
