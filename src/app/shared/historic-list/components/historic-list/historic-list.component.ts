import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'tsl-historic-list',
  templateUrl: './historic-list.component.html',
  styleUrls: ['./historic-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoricListComponent {
  @Input() loading: boolean = true;
  @Input() infiniteScrollDisabled: boolean = false;
  @Output() scrolled: EventEmitter<void> = new EventEmitter();

  public loadingIconSrc: string = '/assets/icons/spinner.svg';
  public loadingIconSizePixels: number = 32;

  public handleScrolled(): void {
    this.scrolled.emit();
  }
}
