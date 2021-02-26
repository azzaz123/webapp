import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { UuidService } from '@core/uuid/uuid.service';
import { AbstractFormComponent } from '@shared/form/abstract-form/abstract-form-component';

@Component({
  selector: 'tsl-toggle-form',
  templateUrl: './toggle-form.component.html',
  styleUrls: ['./toggle-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleFormComponent),
      multi: true,
    },
  ],
})
export class ToggleFormComponent extends AbstractFormComponent<boolean> {
  constructor(private uuidService: UuidService) {
    super();
  }
  public id = this.uuidService.getUUID();
}
