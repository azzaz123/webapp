import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { CarSuggestionsService } from './car-suggestions.service';
import { IOption } from 'ng-select';
import { CarKeysService } from './car-keys.service';
import { Router } from '@angular/router';
import { ErrorsService } from 'shield';
import { UploadEvent } from '../upload-event.interface';
import { isPresent } from 'ng2-dnd/src/dnd.utils';
import { NgbModal, NgbModalRef, NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { PreviewModalComponent } from '../preview-modal/preview-modal.component';
import { TrackingService } from '../../../core/tracking/tracking.service';
import { Car } from '../../../core/item/car';
import * as _ from 'lodash';

@Component({
  selector: 'tsl-upload-car',
  templateUrl: './upload-car.component.html',
  styleUrls: ['./upload-car.component.scss']
})
export class UploadCarComponent implements OnInit {

  @Output() onValidationError: EventEmitter<any> = new EventEmitter();
  @Output() onFormChanged: EventEmitter<boolean> = new EventEmitter();
  @Input() item: Car;
  public uploadForm: FormGroup;
  public models: IOption[];
  public years: IOption[];
  public brands: IOption[];
  public versions: IOption[];
  public carTypes: IOption[];
  public currencies: IOption[] = [
    {value: 'EUR', label: '€'},
    {value: 'GBP', label: '£'}
  ];
  public loading: boolean;
  uploadEvent: EventEmitter<UploadEvent> = new EventEmitter();
  private oldFormValue: any;

  constructor(private fb: FormBuilder,
              private carSuggestionsService: CarSuggestionsService,
              private carKeysService: CarKeysService,
              private router: Router,
              private errorsService: ErrorsService,
              private modalService: NgbModal,
              private trackingService: TrackingService,
              config: NgbPopoverConfig) {
    this.uploadForm = fb.group({
      id: '',
      category_id: '100',
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
      }),
      location: this.fb.group({
        address: ['', [Validators.required]],
        latitude: ['', [Validators.required]],
        longitude: ['', [Validators.required]],
      })
    });
    config.placement = 'right';
    config.triggers = 'focus:blur';
    config.container = 'body';
  }

  ngOnInit() {
    this.getBrands();
    this.getCarTypes();
    this.setItemData();
  }

  private setItemData() {
    if (this.item) {
      this.uploadForm.patchValue({
        id: this.item.id,
        title: this.item.title,
        sale_price: this.item.salePrice,
        currency_code: this.item.currencyCode,
        storytelling: this.item.description,
        sale_conditions: this.item.saleConditions,
        category_id: this.item.categoryId.toString(),
        num_seats: this.item.numSeats,
        body_type: this.item.bodyType,
        km: this.item.km,
        engine: this.item.engine,
        gearbox: this.item.gearbox,
        brand: this.item.brand,
        model: this.item.model,
        year: this.item.year.toString(),
        version: this.item.version
      });
      this.getCarTypes();
      this.getModels(this.item.brand, true);
      this.getYears(this.item.model, true);
      this.getVersions(this.item.year.toString(), true);
      this.detectFormChanges();
    }
  }

  private detectFormChanges() {
    this.uploadForm.valueChanges.subscribe((value) => {
      if (this.brands && this.carTypes && this.models && this.years && this.versions) {
        const oldItemData = _.omit(this.oldFormValue, ['images', 'location']);
        const newItemData = _.omit(value, ['images', 'location']);
        if (!this.oldFormValue) {
          this.oldFormValue = value;
        } else {
          if (!_.isEqual(oldItemData, newItemData)) {
            this.onFormChanged.emit(true);
          }
        }
        this.oldFormValue = value;
      }
    });
  }

  public noop() {
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

  public getModels(brand: string, editMode: boolean = false) {
    this.carSuggestionsService.getModels(brand).subscribe((models: IOption[]) => {
      this.models = models;
      this.toggleField('model', 'enable', !editMode);
      if (!editMode) {
        this.toggleField('year', 'disable');
        this.toggleField('version', 'disable');
      }
      this.resetTitle();
    });
  }

  public getYears(model: string, editMode: boolean = false) {
    this.carSuggestionsService.getYears(
      this.uploadForm.get('brand').value,
      model
    ).subscribe((years: IOption[]) => {
      this.years = years;
      this.toggleField('year', 'enable', !editMode);
      if (!editMode) {
        this.toggleField('version', 'disable');
      }
      this.resetTitle();
    });
  }

  public getVersions(year: string, editMode: boolean = false) {
    this.carSuggestionsService.getVersions(
      this.uploadForm.get('brand').value,
      this.uploadForm.get('model').value,
      year
    ).subscribe((versions: IOption[]) => {
      this.versions = versions;
      this.toggleField('version', 'enable', !editMode);
    });
    this.setTitle();
  }

  private setTitle() {
    if (!this.item) {
      this.uploadForm.get('title').patchValue(
        this.uploadForm.get('brand').value + ' ' +
        this.uploadForm.get('model').value + ' ' +
        this.uploadForm.get('year').value
      );
      this.uploadForm.get('title').markAsDirty();
    }
  }

  private resetTitle() {
    if (!this.item) {
      this.uploadForm.get('title').patchValue('');
      this.uploadForm.get('title').markAsPristine();
    }
  }

  onSubmit() {
    if (this.uploadForm.valid) {
      this.loading = true;
      this.uploadEvent.emit({
        type: this.item ? 'update' : 'create',
        values: this.uploadForm.value
      });
    } else {
      for (let control in this.uploadForm.controls) {
        if (this.uploadForm.controls.hasOwnProperty(control) && !this.uploadForm.controls[control].valid) {
          this.uploadForm.controls[control].markAsDirty();
        }
      }
      if (!this.uploadForm.get('location.address').valid) {
        this.uploadForm.get('location.address').markAsDirty();
      }
      if (!this.uploadForm.get('images').valid) {
        this.errorsService.i18nError('missingImageError');
      } else {
        this.errorsService.i18nError('formErrors');
        this.onValidationError.emit();
      }
    }
  }

  onUploaded(action: string) {
    this.router.navigate(['/catalog/list', {[action]: true}]);
  }

  onError(response: any) {
    this.loading = false;
    this.trackingService.track(TrackingService.UPLOADFORM_ERROR);
  }

  private markFieldAsPristine(field: string) {
    setTimeout(() => {
      this.uploadForm.get(field).markAsPristine();
    });
  }

  private toggleField(field: string, action: string, reset: boolean = true) {
    this.uploadForm.get(field)[action]();
    if (reset) {
      this.uploadForm.get(field).setValue('');
    }
    this.markFieldAsPristine(field);
  }

  preview() {
    const modalRef: NgbModalRef = this.modalService.open(PreviewModalComponent, {
      windowClass: 'preview'
    });
    modalRef.componentInstance.itemPreview = this.uploadForm.value;
    modalRef.componentInstance.getBodyType();
    modalRef.result.then(() => {
      this.onSubmit();
    }, () => {
    });
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
