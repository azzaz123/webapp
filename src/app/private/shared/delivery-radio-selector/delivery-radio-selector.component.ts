import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList,
} from '@angular/core';
import { DeliveryRadioOptionDirective } from '@private/shared/delivery-radio-selector/delivery-radio-option.directive';

@Component({
  selector: 'tsl-delivery-radio-selector',
  templateUrl: './delivery-radio-selector.component.html',
  styleUrls: ['./delivery-radio-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeliveryRadioSelectorComponent implements AfterContentInit {
  @Input() selectedId: number;
  @Output() selectedIdChanged: EventEmitter<number> = new EventEmitter();

  @ContentChildren(DeliveryRadioOptionDirective)
  rawOptions: QueryList<DeliveryRadioOptionDirective>;
  public options: DeliveryRadioOptionDirective[];

  ngAfterContentInit() {
    this.options = this.rawOptions.toArray();
  }
}
