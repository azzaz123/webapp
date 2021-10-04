import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { HistoricList } from '@shared/historic-list/interfaces/historic-list.interface';

@Component({
  selector: 'tsl-historic-list',
  templateUrl: './historic-list.component.html',
  styleUrls: ['./historic-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoricListComponent {
  @Input() loading: boolean = true;
  @Input() infiniteScrollDisabled: boolean = false;
  @Input() historicList: HistoricList;
  @Output() scrolled: EventEmitter<void> = new EventEmitter();

  public loadingIconSrc: string = '/assets/icons/spinner.svg';
  public loadingIconSizePixels: number = 32;

  public handleScrolled(): void {
    this.scrolled.emit();
  }

  public isHistoricListEmpty(): boolean {
    return this.historicList.elements.length === 0;
  }
}
