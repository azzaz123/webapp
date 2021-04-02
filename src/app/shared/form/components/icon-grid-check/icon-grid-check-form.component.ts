import { Component, Input } from '@angular/core';
import { IconGridOption } from '@shared/form/components/icon-grid-check/interfaces/icon-grid-option';

@Component({
  selector: 'tsl-icon-grid-check-form',
  templateUrl: './icon-grid-check-form.component.html',
  styleUrls: ['./icon-grid-check-form.component.scss'],
})
export class IconGridCheckFormComponent {
  @Input() options: IconGridOption[];
  @Input() columns: number;
  @Input() isBig?: boolean;

  public isActive(value: string): boolean {
    return false;
  }
}
