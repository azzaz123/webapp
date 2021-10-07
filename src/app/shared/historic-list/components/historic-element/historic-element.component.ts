import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { HistoricElement } from '@shared/historic-list/interfaces/historic-element.interface';

@Component({
  selector: 'tsl-historic-element',
  templateUrl: './historic-element.component.html',
  styleUrls: ['./historic-element.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoricElementComponent {
  @Input() historicElement: HistoricElement;
}
