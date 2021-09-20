import { Component, Input } from '@angular/core';

export interface TranslateButtonCopies {
  showTranslation: string;
  showOriginal: string;
}

@Component({
  selector: 'tsl-translate-button',
  templateUrl: './translate-button.component.html',
  styleUrls: ['./translate-button.component.scss'],
})
export class TranslateButtonComponent {
  @Input() isTranslated: boolean;
  @Input() copies: TranslateButtonCopies;
}
