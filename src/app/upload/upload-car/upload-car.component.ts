import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { CarSuggestionsService } from './car-suggestions.service';
import { IOption } from 'ng-select';
import { CarKeysService } from './car-keys.service';
import { Router } from '@angular/router';
import { UploadEvent } from '../upload-event.interface';
import { NgbModal, NgbModalRef, NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { PreviewModalComponent } from '../preview-modal/preview-modal.component';
import { TrackingService } from '../../core/tracking/tracking.service';
import { Car } from '../../core/item/car';
import * as _ from 'lodash';
import { ErrorsService } from '../../core/errors/errors.service';
import { CARS_CATEGORY } from '../../core/item/item-categories';
import { ItemService } from '../../core/item/item.service';
import { CarInfo } from '../../core/item/item-response.interface';

@Component({
  selector: 'tsl-upload-car',
  templateUrl: './upload-car.component.html',
  styleUrls: ['./upload-car.component.scss']
})
export class UploadCarComponent implements OnInit {

  @Output() onValidationError: EventEmitter<any> = new EventEmitter();
  @Output() onFormChanged: EventEmitter<boolean> = new EventEmitter();
  @Output() locationSelected: EventEmitter<any> = new EventEmitter();
  @Input() item: Car;
  @Input() urgentPrice: number;
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
  public isUrgent = false;
  public customMake = false;
  public customVersion = false;

  constructor(private fb: FormBuilder,
              private carSuggestionsService: CarSuggestionsService,
              private carKeysService: CarKeysService,
              private router: Router,
              private errorsService: ErrorsService,
              private modalService: NgbModal,
              private itemService: ItemService,
              private trackingService: TrackingService,
              config: NgbPopoverConfig) {
    this.uploadForm = fb.group({
      id: '',
      category_id: CARS_CATEGORY,
      images: [[], [Validators.required]],
      model: [{value: '', disabled: true}, [Validators.required]],
      brand: ['', [Validators.required]],
      title: ['', [Validators.required]],
      year: [{value: '', disabled: true}, [Validators.required]],
      sale_price: ['', [Validators.required, this.min(0), this.max(999999999)]],
      currency_code: ['EUR', [Validators.required]],
      version: [{value: '', disabled: true}, [Validators.required]],
      num_seats: ['', [this.min(0), this.max(99)]],
      num_doors: ['', [this.min(0), this.max(99)]],
      body_type: null,
      km: ['', [this.min(0), this.max(999999999)]],
      storytelling: '',
      engine: null,
      gearbox: null,
      horsepower: ['', [this.min(0), this.max(999)]],
      sale_conditions: fb.group({
        fix_price: false,
        exchange_allowed: false,
        shipping_allowed: false
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
      const carYear: string =  this.item.year ? this.item.year.toString() : '';
      const carCategory: string = this.item.categoryId ? this.item.categoryId.toString() : '';
      this.uploadForm.patchValue({
        id: this.item.id,
        title: this.item.title,
        sale_price: this.item.salePrice,
        currency_code: this.item.currencyCode,
        storytelling: this.item.description,
        sale_conditions: this.item.saleConditions,
        category_id: carCategory,
        num_seats: this.item.numSeats,
        num_doors: this.item.numDoors,
        body_type: this.item.bodyType,
        km: this.item.km,
        engine: this.item.engine,
        gearbox: this.item.gearbox,
        horsepower: this.item.horsepower,
        brand: this.item.brand,
        model: this.item.model,
        year: carYear,
        version: this.item.version
      });
      this.getModels(this.item.brand, true);
      this.getYears(this.item.model, true);
      this.getVersions(carYear, true);
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
      if (this.item) {
        this.customMake = !_.find(this.brands, {value: this.item.brand});
      }
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
      if (models.length <= 0) {
        this.customMake = true;
      }
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
      if (this.item) {
        this.customVersion = !_.find(this.versions, {value: this.item.version});
      }
      this.setTitle();
    });
  }

  public getInfo(version: string) {
    this.itemService.getCarInfo(
      this.uploadForm.get('brand').value,
      this.uploadForm.get('model').value,
      version
    ).subscribe((carInfo: CarInfo) => {
      this.uploadForm.patchValue(carInfo);
    });
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
        type: this.item ? 'update' : 'create',
        values: this.uploadForm.value
      });
    } else {
      for (const control in this.uploadForm.controls) {
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
        this.errorsService.i18nError('formErrors', '', 'formErrorsTitle');
        this.onValidationError.emit();
      }
    }
  }

  onUploaded(uploadEvent: any) {
    this.onFormChanged.emit(false);
    if (this.item) {
      this.trackingService.track(TrackingService.MYITEMDETAIL_EDITITEM_SUCCESS, {category: this.uploadForm.value.category_id});
    } else {
      this.trackingService.track(TrackingService.UPLOADFORM_UPLOADFROMFORM);
    }
    if (this.isUrgent && uploadEvent.action !== 'createdOnHold') {
      this.trackingService.track(TrackingService.UPLOADFORM_CHECKBOX_URGENT, {category: this.uploadForm.value.category_id});
      uploadEvent.action = 'urgent';
      localStorage.setItem('transactionType', 'urgent');
    }
    const params: any = {
      [uploadEvent.action]: true,
      itemId: uploadEvent.response.id || uploadEvent.response
    };
    if (this.item && this.item.flags.onhold) {
      params.onHold = true;
    }
    this.router.navigate(['/catalog/list', params]);
  }

  onError(response: any) {
    this.loading = false;
    if (this.item) {
      this.trackingService.track(TrackingService.MYITEMDETAIL_EDITITEM_ERROR, {category: this.uploadForm.value.category_id});
    } else {
      this.trackingService.track(TrackingService.UPLOADFORM_ERROR);
    }
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
      if (Validators.required(control)) {
        return null;
      }
      const v: number = Number(control.value);
      return v < min ? {'min': {'requiredMin': min, 'actualMin': v}} : null;
    };
  }

  private max(max: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (Validators.required(control)) {
        return null;
      }
      const v: number = Number(control.value);
      return v > max ? {'max': {'requiredMax': max, 'actualMax': v}} : null;
    };
  }

  public selectUrgent(isUrgent: boolean): void {
    this.isUrgent = isUrgent;
  }

  public emitLocation(): void {
    this.locationSelected.emit(100);
  }

  public toggleCustomMakeSelection() {
    if (!this.customMake) {
      this.customMake = true;
      this.uploadForm.get('brand').patchValue('');
      this.toggleField('model', 'enable');
      this.toggleField('year', 'enable');
      this.toggleField('version', 'enable');
    } else {
      this.customMake = false;
      this.uploadForm.get('brand').patchValue('');
      this.toggleField('model', 'disable');
      this.toggleField('year', 'disable');
      this.toggleField('version', 'disable');
    }
  }

  public toggleCustomVersionSelection() {
      this.customVersion = !this.customVersion;
  }

}