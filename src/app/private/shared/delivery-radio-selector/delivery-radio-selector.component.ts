import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  QueryList,
} from '@angular/core';
import { DeliveryRadioOptionDirective } from '@private/shared/delivery-radio-selector/delivery-radio-option.directive';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tsl-delivery-radio-selector',
  templateUrl: './delivery-radio-selector.component.html',
  styleUrls: ['./delivery-radio-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeliveryRadioSelectorComponent implements OnDestroy, AfterContentInit {
  @Input() isChecked: boolean;
  @Input() selectedId: number;
  @Output() changed: EventEmitter<number> = new EventEmitter();

  @ContentChildren(DeliveryRadioOptionDirective)
  options: QueryList<DeliveryRadioOptionDirective>;
  private optionsSubscription: Subscription = new Subscription();
  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterContentInit(): void {
    this.optionsSubscription.add(this.options.changes.subscribe(() => this.cdr.markForCheck()));
  }

  ngOnDestroy(): void {
    this.optionsSubscription.unsubscribe();
  }
}
