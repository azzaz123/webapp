import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'tsl-historic-list',
  templateUrl: './historic-list.component.html',
  styleUrls: ['./historic-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoricListComponent {
  @Input() loading: boolean;

  public loadingIconSrc: string = '/assets/icons/spinner.svg';
  public loadingIconSizePixels: number = 32;
}
