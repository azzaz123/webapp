import { Component, ElementRef, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { CarSuggestionsService } from './car-suggestions.service';
import { IOption } from 'ng-select';
import { CarKeysService } from './car-keys.service';
import { Router } from '@angular/router';
import { ErrorsService } from 'shield';
import { UploadEvent } from './upload-event.interface';
import { isPresent } from 'ng2-dnd/src/dnd.utils';

@Component({
  selector: 'tsl-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  public uploadForm: FormGroup;
  public models: IOption[];
  public years: IOption[];
  public brands: IOption[];
  public versions: IOption[];
  public carTypes: IOption[];
  public currencies: IOption[] = [
    {value: 'EUR', label: '€'},
    {value: 'USD', label: '$'}
  ];
  public loading: boolean;
  uploadEvent: EventEmitter<UploadEvent> = new EventEmitter();
  @ViewChild('scrollPanel') scrollPanel: ElementRef;

  constructor(private fb: FormBuilder,
              private carSuggestionsService: CarSuggestionsService,
              private carKeysService: CarKeysService,
              private router: Router,
              private errorsService: ErrorsService) {
    this.uploadForm = fb.group({
      images: [[], [Validators.required]],
      model: [{value: '', disabled: true}, [Validators.required]],
      brand: ['', [Validators.required]],
      title: ['', [Validators.required]],
      year: [{value: '', disabled: true}, [Validators.required]],
      sale_price: ['', [Validators.required, this.min(0), this.max(999999999)]],
      currency_code: ['EUR', [Validators.required]],
      version: {value: '', disabled: true},
      num_seats: ['', [this.min(0), this.max(99)]],
      body_type: '',
      km: ['', [this.min(0), this.max(999999999)]],
      storytelling: '',
      engine: '',
      gearbox: '',
      sale_conditions: fb.group({
        fix_price: false,
        exchange_allowed: false
      })
    });
  }

  ngOnInit() {
    this.getBrands();
    this.getCarTypes();
  }

  private getBrands() {
    this.carSuggestionsService.getBrands().subscribe((brands: IOption[]) => {
      this.brands = brands;
      this.markFieldAsPristine('brand');
    });
  }

  private getCarTypes() {
    this.carKeysService.getTypes().subscribe((carTypes: IOption[]) => {
      this.carTypes = carTypes;
      this.markFieldAsPristine('body_type');
    });
  }

  public getModels(brand: string) {
    this.carSuggestionsService.getModels(brand).subscribe((models: IOption[]) => {
      this.models = models;
      this.toggleField('model', 'enable');
      this.toggleField('year', 'disable');
      this.toggleField('version', 'disable');
      this.resetTitle();
    });
  }

  public getYears(model: string) {
    this.carSuggestionsService.getYears(
      this.uploadForm.get('brand').value,
      model
    ).subscribe((years: IOption[]) => {
      this.years = years;
      this.toggleField('year', 'enable');
      this.toggleField('version', 'disable');
      this.resetTitle();
    });
  }

  public getVersions(year: string) {
    this.carSuggestionsService.getVersions(
      this.uploadForm.get('brand').value,
      this.uploadForm.get('model').value,
      year
    ).subscribe((versions: IOption[]) => {
      this.versions = versions;
      this.toggleField('version', 'enable');
    });
    this.setTitle();
  }

  private setTitle() {
    this.uploadForm.get('title').patchValue(
      this.uploadForm.get('brand').value + ' ' +
      this.uploadForm.get('model').value + ' ' +
      this.uploadForm.get('year').value
    );
    this.uploadForm.get('title').markAsDirty();
  }

  private resetTitle() {
    this.uploadForm.get('title').patchValue('');
    this.uploadForm.get('title').markAsPristine();
  }

  onSubmit() {
    if (this.uploadForm.valid) {
      this.loading = true;
      this.uploadEvent.emit({
        type: 'create',
        values: this.uploadForm.value
      });
    } else {
      for (let control in this.uploadForm.controls) {
        if (this.uploadForm.controls.hasOwnProperty(control) && !this.uploadForm.controls[control].valid) {
          this.uploadForm.controls[control].markAsDirty();
        }
      }
      if (!this.uploadForm.get('images').valid) {
        this.errorsService.i18nError('missingImageError');
      } else {
        this.errorsService.i18nError('formErrors');
        this.scrollPanel.nativeElement.scrollTop = 0;
      }
    }
  }

  onUploaded(itemId: string) {
    this.errorsService.i18nSuccess('productCreated');
    this.router.navigate(['/catalog/list', {created: true}]);
  }

  onError(response: any) {
    this.loading = false;
  }

  private markFieldAsPristine(field: string) {
    setTimeout(() => {
      this.uploadForm.get(field).markAsPristine();
    });
  }

  private toggleField(field: string, action: string) {
    this.uploadForm.get(field)[action]();
    this.uploadForm.get(field).setValue('');
    this.markFieldAsPristine(field);
  }

  private min(min: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (isPresent(Validators.required(control))) {
        return null;
      }
      let v: number = Number(control.value);
      return v < min ? {'min': {'requiredMin': min, 'actualMin': v}} : null;
    };
  }

  private max(max: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (isPresent(Validators.required(control))) {
        return null;
      }
      let v: number = Number(control.value);
      return v > max ? {'max': {'requiredMax': max, 'actualMax': v}} : null;
    };
  }

}
