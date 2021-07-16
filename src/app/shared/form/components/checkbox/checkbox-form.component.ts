import { ChangeDetectorRef, Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { UuidService } from '@core/uuid/uuid.service';
import { AbstractFormComponent } from '@shared/form/abstract-form/abstract-form-component';

@Component({
  selector: 'tsl-checkbox-form',
  templateUrl: './checkbox-form.component.html',
  styleUrls: ['./checkbox-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxFormComponent),
      multi: true,
    },
  ],
})
export class CheckboxFormComponent extends AbstractFormComponent<boolean> {
  constructor(private uuidService: UuidService, private cdr: ChangeDetectorRef) {
    super();
  }
  public id = this.uuidService.getUUID();

  public writeValue(value: boolean): void {
    super.writeValue(value);
    this.cdr.detectChanges();
  }
}
