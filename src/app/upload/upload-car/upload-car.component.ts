import { forkJoin, Observable } from 'rxjs';
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
import { omit, isEqual } from 'lodash-es';
import { ErrorsService } from '../../core/errors/errors.service';
import { CARS_CATEGORY } from '../../core/item/item-categories';
import { ItemService } from '../../core/item/item.service';
import { CarInfo, CarContent } from '../../core/item/item-response.interface';
import { AnalyticsService } from '../../core/analytics/analytics.service';
import { UserService } from '../../core/user/user.service';
import { SubscriptionsService } from '../../core/subscriptions/subscriptions.service';
import { tap, finalize } from 'rxjs/operators';
import {
  ANALYTIC_EVENT_TYPES,
  ANALYTICS_EVENT_NAMES,
  SCREEN_IDS,
  AnalyticsEvent,
  EditItemCar,
  ListItemCar
} from '../../core/analytics/analytics-constants';

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
    { value: 'EUR', label: '€' },
    { value: 'GBP', label: '£' }
  ];
  public loading: boolean;
  uploadEvent: EventEmitter<UploadEvent> = new EventEmitter();
  private oldFormValue: any;
  public isUrgent = false;
  public customMake = false;
  public customVersion = false;
  public uploadCompletedPercentage = 0;

  constructor(private fb: FormBuilder,
    private carSuggestionsService: CarSuggestionsService,
    private carKeysService: CarKeysService,
    private router: Router,
    private errorsService: ErrorsService,
    private modalService: NgbModal,
    private itemService: ItemService,
    private trackingService: TrackingService,
    private analyticsService: AnalyticsService,
    private userService: UserService,
    private subscriptionService: SubscriptionsService,
    private popoverConfig: NgbPopoverConfig) {

    this.uploadForm = fb.group({
      id: '',
      category_id: CARS_CATEGORY,
      images: [[], [Validators.required]],
      model: ['', [Validators.required]],
      brand: ['', [Validators.required]],
      title: ['', [Validators.required]],
      year: ['', [Validators.required]],
      sale_price: ['', [Validators.required, this.min(0), this.max(999999999)]],
      financed_price: ['', [this.min(0), this.max(999999999)]],
      currency_code: ['EUR', [Validators.required]],
      version: ['', [Validators.required]],
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
    this.initializePopoverConfiguration();
  }

  ngOnInit() {
    const isItemEdit = !!this.item;

    if (isItemEdit) {
      return this.initializeEditForm();
    }
    this.initializeUploadForm();
  }

  private initializeUploadForm(): void {
    forkJoin(
      this.getBrands(),
      this.getCarTypes()
    ).pipe(
      finalize(() => this.subscribeToFieldsChanges())
    ).subscribe(([brands, carTypes]) => {
      this.brands = brands;
      this.carTypes = carTypes;
    });
  }

  private initializeEditForm(): void {
    this.uploadForm.patchValue({
      id: this.item.id,
      model: this.item.model,
      brand: this.item.brand,
      title: this.item.title,
      year: `${this.item.year}`,
      sale_price: this.item.salePrice,
      financed_price: this.item.financedPrice,
      version: this.item.version,
      num_seats: this.item.numSeats,
      num_doors: this.item.numDoors,
      body_type: this.item.bodyType,
      km: this.item.km,
      storytelling: this.item.description,
      engine: this.item.engine,
      gearbox: this.item.gearbox,
      horsepower: this.item.horsepower,
      sale_conditions: {
        fix_price: this.item.saleConditions?.fix_price,
        exchange_allowed: this.item.saleConditions?.exchange_allowed,
        shipping_allowed: this.item.saleConditions?.shipping_allowed
      },
    }, { emitEvent: false });

    forkJoin(
      this.getBrands(),
      this.getCarTypes(),
      this.getModels(this.item.brand),
      this.getYears(this.item.model),
      this.getVersions(`${this.item.year}`)
    ).pipe(
      finalize(() => {
        this.customVersion = !this.versions.find(version => this.item.version === version.value);
        this.customMake = !this.brands.find(brand => this.item.brand === brand.value);
        this.subscribeToFieldsChanges();
      })
    ).subscribe(([brands, carTypes, models, years, versions]) => {
      this.brands = brands;
      this.carTypes = carTypes;
      this.models = models;
      this.years = years;
      this.versions = versions;
    });
  }

  private subscribeToFieldsChanges(): void {
    this.subscribeToBrandChanges();
    this.subscribeToModelChanges();
    this.subscribeToYearChanges();
    this.subscribeToVersionChanges();
    this.detectFormChanges();
  }

  private initializePopoverConfiguration(): void {
    this.popoverConfig.placement = 'right';
    this.popoverConfig.triggers = 'focus:blur';
    this.popoverConfig.container = 'body';
  }

  private subscribeToBrandChanges(): void {
    this.uploadForm.get('brand').valueChanges.subscribe((brand: string) => {
      this.resetFieldsAfterBrandChange();
      this.getModels(brand).subscribe((models: IOption[]) => {
        this.models = models;
      });
    });
  }

  private subscribeToModelChanges(): void {
    this.uploadForm.get('model').valueChanges.subscribe((model: string) => {
      this.resetFieldsAfterModelChange();
      this.getYears(model).subscribe((years: IOption[]) => {
        this.years = years;
      });
    });
  }

  private subscribeToYearChanges(): void {
    this.uploadForm.get('year').valueChanges.subscribe((year: string) => {
      this.resetFieldsAfterYearChange();
      this.autocompleteTitle();
      this.getVersions(year).subscribe((versions: IOption[]) => {
        this.versions = versions;
      });
    });
  }

  private subscribeToVersionChanges(): void {
    this.uploadForm.get('version').valueChanges.subscribe((version: string) => {
      this.resetFieldsAfterVersionChange();
      this.getAutocompleteFields(version).subscribe((fields: CarInfo) => {
        this.uploadForm.patchValue(fields, { emitEvent: false });
      });
    });
  }

  private detectFormChanges() {
    this.uploadForm.valueChanges.subscribe((value) => {
      if (this.brands && this.carTypes && this.models && this.years && this.versions) {
        const oldItemData = omit(this.oldFormValue, ['images', 'location']);
        const newItemData = omit(value, ['images', 'location']);
        if (!this.oldFormValue) {
          this.oldFormValue = value;
        } else {
          if (!isEqual(oldItemData, newItemData)) {
            this.onFormChanged.emit(true);
          }
        }
        this.oldFormValue = value;
      }
    });
  }

  private getBrands(): Observable<IOption[]> {
    return this.carSuggestionsService.getBrands();
  }

  private getCarTypes(): Observable<IOption[]> {
    return this.carKeysService.getTypes();
  }

  private getModels(brand: string): Observable<IOption[]> {
    return this.carSuggestionsService.getModels(brand);
  }

  private getYears(model: string): Observable<IOption[]> {
    return this.carSuggestionsService.getYears(
      this.uploadForm.get('brand').value,
      model
    );
  }

  private getVersions(year: string): Observable<IOption[]> {
    return this.carSuggestionsService.getVersions(
      this.uploadForm.get('brand').value,
      this.uploadForm.get('model').value,
      year
    );
  }

  private getAutocompleteFields(version: string) {
    return this.itemService.getCarInfo(
      this.uploadForm.get('brand').value,
      this.uploadForm.get('model').value,
      version
    );
  }

  private autocompleteTitle() {
    const brand = this.uploadForm.get('brand').value;
    const model = this.uploadForm.get('model').value;
    const year = this.uploadForm.get('year').value;
    const title = `${brand} ${model} ${year}`;

    this.uploadForm.get('title').patchValue(title);
  }

  onSubmit() {
    if (this.uploadForm.valid) {
      this.loading = true;
      this.uploadEvent.emit({
        type: this.item ? 'update' : 'create',
        values: this.uploadForm.value
      });
    } else {
      this.uploadForm.markAsPending();
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
      this.trackingService.track(TrackingService.MYITEMDETAIL_EDITITEM_SUCCESS, { category: this.uploadForm.value.category_id });
    } else {
      this.trackingService.track(TrackingService.UPLOADFORM_UPLOADFROMFORM);
    }
    if (this.isUrgent && uploadEvent.action !== 'createdOnHold') {
      this.trackingService.track(TrackingService.UPLOADFORM_CHECKBOX_URGENT, { category: this.uploadForm.value.category_id });
      uploadEvent.action = 'urgent';
      localStorage.setItem('transactionType', 'urgent');
    }

    if (uploadEvent.action === 'createdOnHold') {
      this.subscriptionService.getUserSubscriptionType().subscribe(type => {
        this.redirectToList(uploadEvent, type);
      });
    } else {
      this.redirectToList(uploadEvent);
    }
  }

  public redirectToList(uploadEvent, type = 1) {
    const params = this.getRedirectParams(uploadEvent, type);

    this.trackEditOrUpload(!!this.item, uploadEvent.response).subscribe(() =>
      this.router.navigate(['/catalog/list', params])
    );
  }

  private getRedirectParams(uploadEvent, userType: number) {
    const params: any = {
      [uploadEvent.action]: true,
      itemId: uploadEvent.response.id || uploadEvent.response
    };

    if (this.item && this.item.flags.onhold) {
      params.onHold = true;
    }

    if (uploadEvent.action === 'createdOnHold') {
      params.onHoldType = userType;
    }

    return params;
  }

  public onError(response: any) {
    this.loading = false;
    if (this.item) {
      this.trackingService.track(TrackingService.MYITEMDETAIL_EDITITEM_ERROR, { category: this.uploadForm.value.category_id });
    } else {
      this.trackingService.track(TrackingService.UPLOADFORM_ERROR);
    }
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
      return v < min ? { 'min': { 'requiredMin': min, 'actualMin': v } } : null;
    };
  }

  private max(max: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (Validators.required(control)) {
        return null;
      }
      const v: number = Number(control.value);
      return v > max ? { 'max': { 'requiredMax': max, 'actualMax': v } } : null;
    };
  }

  private resetFieldsAfterBrandChange(): void {
    this.uploadForm.reset({
      brand: this.uploadForm.get('brand').value
    }, { emitEvent: false });
  }

  private resetFieldsAfterModelChange(): void {
    this.uploadForm.reset({
      brand: this.uploadForm.get('brand').value,
      model: this.uploadForm.get('model').value
    }, { emitEvent: false });
  }

  private resetFieldsAfterYearChange(): void {
    this.uploadForm.reset({
      brand: this.uploadForm.get('brand').value,
      model: this.uploadForm.get('model').value,
      year: this.uploadForm.get('year').value
    }, { emitEvent: false });
  }

  private resetFieldsAfterVersionChange(): void {
    this.uploadForm.reset({
      brand: this.uploadForm.get('brand').value,
      model: this.uploadForm.get('model').value,
      year: this.uploadForm.get('year').value,
      version: this.uploadForm.get('version').value
    }, { emitEvent: false });
  }

  public selectUrgent(isUrgent: boolean): void {
    this.isUrgent = isUrgent;
  }

  public emitLocation(): void {
    this.locationSelected.emit(100);
  }

  public toggleCustomMakeSelection() {
    this.customMake = !this.customMake;
  }

  public toggleCustomVersionSelection() {
    this.customVersion = !this.customVersion;
  }

  public updateUploadPercentage(percentage: number) {
    this.uploadCompletedPercentage = Math.round(percentage);
  }

  get modelFieldDisabled(): boolean {
    return this.uploadForm.get('brand').invalid;
  }

  get yearFieldDisabled(): boolean {
    const modelField = this.uploadForm.get('model');

    return modelField.disabled || modelField.invalid;
  }

  get versionFieldDisabled(): boolean {
    const yearField = this.uploadForm.get('year');

    return yearField.disabled || yearField.invalid;
  }

  private trackEditOrUpload(isEdit: boolean, item: CarContent) {
    return forkJoin([
      this.userService.isProfessional(),
      this.userService.isProUser(),
    ]).pipe(tap((values: any[]) => {
      const baseEventAttrs: any = {
        itemId: item.id,
        categoryId: item.category_id,
        salePrice: item.sale_price,
        title: item.title,
        brand: item.brand,
        model: item.model,
        year: item.year,
        km: item.km || null,
        gearbox: item.gearbox || null,
        engine: item.engine || null,
        hp: item.horsepower || null,
        numDoors: item.num_doors || null,
        bodyType: item.body_type || null,
        isCarDealer: values[0],
        isPro: values[1]
      };

      if (isEdit) {
        const editItemCarEvent: AnalyticsEvent<EditItemCar> = {
          name: ANALYTICS_EVENT_NAMES.EditItemCar,
          eventType: ANALYTIC_EVENT_TYPES.Other,
          attributes: {
            ...baseEventAttrs,
            screenId: SCREEN_IDS.EditItem
          }
        };
        this.analyticsService.trackEvent(editItemCarEvent);
      } else {
        const listItemCarEvent: AnalyticsEvent<ListItemCar> = {
          name: ANALYTICS_EVENT_NAMES.ListItemCar,
          eventType: ANALYTIC_EVENT_TYPES.Other,
          attributes: {
            ...baseEventAttrs,
            screenId: SCREEN_IDS.Upload
          }
        };
        this.analyticsService.trackEvent(listItemCarEvent);
      }
    }));
  }

}
