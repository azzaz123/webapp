import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { HistoricList } from '@shared/historic-list/interfaces/historic-list.interface';
import { TabsBarElement } from '@shared/tabs-bar/interfaces/tabs-bar-element.interface';
import { WALLET_HISTORY_FILTERS } from '@api/core/model/wallet/history/wallet-history-filters.enum';
import { WalletHistoryMovementsTrackingEventService } from '@private/features/wallet/pages/wallet-history-movements/services/tracking-event/wallet-history-movements-tracking-event.service';
import { WalletHistoryMovementsUIService } from '@private/features/wallet/pages/wallet-history-movements/services/wallet-history-movements-ui/wallet-history-movements-ui.service';

import { Observable } from 'rxjs';

@Component({
  selector: 'tsl-wallet-history-movements',
  templateUrl: './wallet-history-movements.component.html',
  styleUrls: ['./wallet-history-movements.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletHistoryMovementsComponent implements OnInit {
  public tabBarElements: TabsBarElement<WALLET_HISTORY_FILTERS>[] = [
    { value: WALLET_HISTORY_FILTERS.ALL, label: $localize`:@@movements_history_all_users_all_movements_tap_bar_title:All` },
    { value: WALLET_HISTORY_FILTERS.IN, label: $localize`:@@movements_history_all_users_inflows_tap_bar_title:Inflows` },
    { value: WALLET_HISTORY_FILTERS.OUT, label: $localize`:@@movements_history_all_users_outflows_tap_bar_title:Outflows` },
  ];
  public loadingIconSrc: string = '/assets/icons/spinner.svg';
  public loadingIconSizePixels: number = 32;

  private currentFilter: WALLET_HISTORY_FILTERS = WALLET_HISTORY_FILTERS.ALL;

  constructor(
    private walletHistoryMovementsUIService: WalletHistoryMovementsUIService,
    private walletHistoryTrackingEventService: WalletHistoryMovementsTrackingEventService
  ) {}

  public get infiniteScrollDisabled(): boolean {
    return this.walletHistoryMovementsUIService.infiniteScrollDisabled;
  }

  public get loading$(): Observable<boolean> {
    return this.walletHistoryMovementsUIService.loading$;
  }

  public get historicList$(): Observable<HistoricList> {
    return this.walletHistoryMovementsUIService.historicList$;
  }

  public get showTotalBalance(): boolean {
    return this.currentFilter === WALLET_HISTORY_FILTERS.ALL;
  }

  ngOnInit() {
    this.getItems();
    this.sendAnalytics();
  }

  public getItems(): void {
    this.walletHistoryMovementsUIService.getItems(this.currentFilter);
  }

  public onChangeFilter(filter: WALLET_HISTORY_FILTERS) {
    this.currentFilter = filter;
    this.walletHistoryMovementsUIService.reset();
    this.getItems();
  }

  private sendAnalytics(): void {
    this.walletHistoryMovementsUIService.historicList$.subscribe((historicList: HistoricList) => {
      this.walletHistoryTrackingEventService.trackViewWalletHistoryMovement(historicList.elements.length);
    });
  }
}
