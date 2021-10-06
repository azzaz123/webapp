import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { HistoricList } from '@shared/historic-list/interfaces/historic-list.interface';

@Component({
  selector: 'tsl-historic-list',
  templateUrl: './historic-list.component.html',
  styleUrls: ['./historic-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoricListComponent implements OnChanges {
  @Input() infiniteScrollDisabled: boolean = false;
  @Input() historicList: HistoricList;
  @Input() showTotalBalance: boolean = false;
  @Output() scrolled: EventEmitter<void> = new EventEmitter();

  public isHistoricListEmpty: boolean = true;
  public isTotalBalanceVisible: boolean = false;

  ngOnChanges() {
    this.checkHistoricListEmpty();
    this.checkTotalBalance();
  }

  public handleScrolled(): void {
    this.scrolled.emit();
  }

  private checkTotalBalance(): void {
    this.isTotalBalanceVisible = !!this.historicList?.totalBalance && this.showTotalBalance;
  }

  private checkHistoricListEmpty(): void {
    this.isHistoricListEmpty = this.historicList?.elements.length === 0;
  }
}
