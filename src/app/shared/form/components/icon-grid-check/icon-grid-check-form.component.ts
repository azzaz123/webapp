import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { IconGridOption } from '@shared/form/components/icon-grid-check/interfaces/icon-grid-option';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Subscription } from 'rxjs/internal/Subscription';
import { AbstractFormComponent } from '@shared/form/abstract-form/abstract-form-component';

@Component({
  selector: 'tsl-icon-grid-check-form',
  templateUrl: './icon-grid-check-form.component.html',
  styleUrls: ['./icon-grid-check-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IconGridCheckFormComponent),
      multi: true,
    },
  ],
})
export class IconGridCheckFormComponent extends AbstractFormComponent<string[]> implements OnInit, OnDestroy {
  @Input() options: IconGridOption[];
  @Input() columns: number;
  @Input() isBig?: boolean;
  @Input() isMultiselect?: boolean;

  private subscriptions = new Subscription();
  private optionsSubject = new BehaviorSubject<string[]>([]);

  public writeValue(value: string[]) {
    super.writeValue(value);
    this.onChange(value);
  }

  public ngOnInit(): void {
    const subscription = this.optionsSubject.subscribe((value) => {
      this.writeValue(value);
    });
    this.subscriptions.add(subscription);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public handleOptionClick(value: string): void {
    if (this.isValueActive(value)) {
      return this.cleanValue(value);
    }

    if (this.isMultiselect) {
      this.optionsSubject.next([...this.optionsSubject.value, value]);
    } else {
      this.optionsSubject.next([value]);
    }
  }

  public isValueActive(value: string): boolean {
    return this.optionsSubject.value.includes(value);
  }

  private cleanValue(value: string) {
    this.optionsSubject.next(this.optionsSubject.value.filter((optionValue) => optionValue !== value));
  }
}
