import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { PendingTransaction } from '@api/core/model';
import { WalletPendingTransactionComponent } from '../wallet-pending-transaction/wallet-pending-transaction.component';

const DEFAULT_VISIBLE_PENDING_TRANSACTIONS = 2;

@Component({
  selector: 'tsl-wallet-pending-transactions-list',
  templateUrl: './wallet-pending-transactions-list.component.html',
  styleUrls: ['./wallet-pending-transactions-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletPendingTransactionsListComponent implements AfterViewInit {
  @Input() pendingTransactions: PendingTransaction[];
  @ViewChildren(WalletPendingTransactionComponent, { read: ElementRef }) private pendingTransactionsRef: QueryList<ElementRef>;
  public isExpanded = false;
  public animated = false;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.changeDetectorRef.detectChanges();
    this.activateAnimation();
  }

  public isPendingTransactionVisible(index: number): boolean {
    return this.isExpanded || this.isTransactionVisible(index);
  }

  public toggleShowAllTransactions(): void {
    this.isExpanded = !this.isExpanded;
    this.changeDetectorRef.detectChanges();
  }

  public get tansactionsWrapperStyle(): Object {
    return {
      height: `${this.getTransactionContainerHeight()}px`,
    };
  }

  private activateAnimation(): void {
    this.animated = true;
  }

  private getTransactionContainerHeight(): number {
    const shouldShowAllTransactions = this.isExpanded || this.pendingTransactions.length < DEFAULT_VISIBLE_PENDING_TRANSACTIONS;
    const shouldShowDefaultTransactions = this.pendingTransactions.length > DEFAULT_VISIBLE_PENDING_TRANSACTIONS;

    if (shouldShowAllTransactions) {
      return this.getTransactionHeightByPosition(this.pendingTransactions.length);
    }
    if (shouldShowDefaultTransactions) {
      return this.getTransactionHeightByPosition(DEFAULT_VISIBLE_PENDING_TRANSACTIONS);
    }
    return 0;
  }

  private getTransactionHeightByPosition(position: number): number {
    if (!this.pendingTransactionsRef?.length) {
      return 0;
    }

    const pendingTransactionRef = this.pendingTransactionsRef.get(position - 1);
    const { nativeElement } = pendingTransactionRef;
    const { parentElement } = nativeElement;
    const { offsetTop, offsetHeight, parentElement: pendingTransactionRefParent } = parentElement;

    return offsetTop + offsetHeight - pendingTransactionRefParent.offsetTop;
  }

  private isTransactionVisible(index: number): boolean {
    return index < DEFAULT_VISIBLE_PENDING_TRANSACTIONS;
  }
}
