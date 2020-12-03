import { forkJoin, Observable } from 'rxjs';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CarSuggestionsService } from './car-suggestions.service';
import { IOption } from 'app/dropdown/utils/option.interface';
import { CarKeysService } from './car-keys.service';
import { Router } from '@angular/router';
import {
  NgbModal,
  NgbModalRef,
  NgbPopoverConfig,
} from '@ng-bootstrap/ng-bootstrap';
import { PreviewModalComponent } from '../preview-modal/preview-modal.component';
import { TrackingService } from '../../core/tracking/tracking.service';
import { Car } from '../../core/item/car';
import { omit, isEqual } from 'lodash-es';
import { ErrorsService } from '../../core/errors/errors.service';
import { CARS_CATEGORY } from '../../core/item/item-categories';
import { ItemService } from '../../core/item/item.service';
import {
  CarInfo,
  CarContent,
} from '../../core/item/item-response.interface';
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
  ListItemCar,
} from '../../core/analytics/analytics-constants';
import { whitespaceValidator } from '../../core/form-validators/formValidators.func';
import { UploadService } from '../drop-area/upload.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ITEM_TYPES } from 'app/core/item/item';
import {
  OutputType,
  UploadAction,
  UploadFile,
  UploadOutput,
} from 'app/shared/uploader/upload.interface';

@Component({
  selector: 'tsl-upload-car',
  templateUrl: './upload-car.component.html',
  styleUrls: ['./upload-car.component.scss'],
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
    { value: 'GBP', label: '£' },
  ];
  public loading: boolean;
  private oldFormValue: any;
  public currentYear = new Date().getFullYear();
  public isUrgent = false;
  public customMake = false;
  public customVersion = false;
  public uploadCompletedPercentage = 0;

  isLoadingModels: boolean;
  isLoadingYears: boolean;

  constructor(
    private fb: FormBuilder,
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
    private popoverConfig: NgbPopoverConfig,
    private uploadService: UploadService
  ) {
    this.uploadForm = fb.group({
      id: '',
      category_id: CARS_CATEGORY,
      images: [[], [Validators.required]],
      model: ['', [Validators.required, whitespaceValidator]],
      brand: ['', [Validators.required, whitespaceValidator]],
      title: ['', [Validators.required, whitespaceValidator]],
      year: [
        '',
        [Validators.required, this.min(1900), this.max(this.currentYear)],
      ],
      sale_price: ['', [Validators.required, this.min(0), this.max(999999999)]],
      financed_price: ['', [this.min(0), this.max(999999999)]],
      currency_code: ['EUR', [Validators.required]],
      version: ['', [Validators.required, whitespaceValidator]],
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
        shipping_allowed: false,
      }),
      location: this.fb.group({
        address: ['', [Validators.required, whitespaceValidator]],
        latitude: ['', [Validators.required, whitespaceValidator]],
        longitude: ['', [Validators.required, whitespaceValidator]],
      }),
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
    forkJoin([this.getBrands(), this.getCarTypes()])
      .pipe(finalize(() => this.subscribeToFieldsChanges()))
      .subscribe(([brands, carTypes]) => {
        this.brands = brands;
        this.carTypes = carTypes;
      });
  }

  private initializeEditForm(): void {
    this.uploadForm.patchValue(
      {
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
          shipping_allowed: this.item.saleConditions?.shipping_allowed,
        },
        images: this.uploadService.convertImagesToFiles(this.item.images),
      },
      { emitEvent: false }
    );

    forkJoin([
      this.getBrands(),
      this.getVersions(`${this.item.year}`),
      this.getCarTypes(),
    ])
      .pipe(
        finalize(() => {
          this.customVersion = !this.versions.find(
            (version) => this.item.version === version.value
          );
          this.customMake = !this.brands.find(
            (brand) => this.item.brand === brand.value
          );
          this.subscribeToFieldsChanges();
        })
      )
      .subscribe(([brands, versions, carTypes]) => {
        this.brands = brands;
        this.versions = versions;
        this.carTypes = carTypes;
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
      this.resetFormFields([
        'model',
        'title',
        'year',
        'version',
        'num_seats',
        'num_doors',
        'body_type',
        'km',
        'engine',
        'gearbox',
        'horsepower',
      ]);
      this.getModels();
    });
  }

  private subscribeToModelChanges(): void {
    this.uploadForm.get('model').valueChanges.subscribe((model: string) => {
      this.resetFormFields([
        'title',
        'year',
        'version',
        'num_seats',
        'num_doors',
        'body_type',
        'km',
        'engine',
        'gearbox',
        'horsepower',
      ]);
      this.getYears();
    });
  }

  private subscribeToYearChanges(): void {
    this.uploadForm.get('year').valueChanges.subscribe((year: string) => {
      this.resetFormFields([
        'version',
        'num_seats',
        'num_doors',
        'body_type',
        'km',
        'engine',
        'gearbox',
        'horsepower',
      ]);
      this.autocompleteTitle();
      this.getVersions(year).subscribe((versions: IOption[]) => {
        this.versions = versions;
      });
    });
  }

  private subscribeToVersionChanges(): void {
    this.uploadForm.get('version').valueChanges.subscribe((version: string) => {
      this.resetFormFields([
        'num_seats',
        'num_doors',
        'body_type',
        'km',
        'engine',
        'gearbox',
        'horsepower',
      ]);
      this.getAutocompleteFields(version).subscribe((fields: CarInfo) => {
        this.uploadForm.patchValue(fields, { emitEvent: false });
      });
    });
  }

  private detectFormChanges() {
    this.uploadForm.valueChanges.subscribe((value) => {
      if (
        this.brands &&
        this.carTypes &&
        this.models &&
        this.years &&
        this.versions
      ) {
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

  private getModels(): void {
    this.isLoadingModels = true;
    this.carSuggestionsService
      .getModels(this.uploadForm.get('brand').value)
      .pipe(finalize(() => (this.isLoadingModels = false)))
      .subscribe((models: IOption[]) => {
        this.models = models;
      });
  }

  private getYears(): void {
    this.isLoadingYears = true;
    this.carSuggestionsService
      .getYears(
        this.uploadForm.get('brand').value,
        this.uploadForm.get('model').value
      )
      .pipe(finalize(() => (this.isLoadingYears = false)))
      .subscribe((years: IOption[]) => {
        this.years = years;
      });
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
    const title = [brand, model, year]
      .filter((t) => t)
      .join(' ')
      .trim();

    this.uploadForm.get('title').patchValue(title);
  }

  private resetFormFields(fields: string[]): void {
    fields.forEach((field) => {
      this.uploadForm.get(field).reset(undefined, { emitEvent: false });
    });
  }

  onSubmit() {
    if (this.uploadForm.valid) {
      this.loading = true;
      this.item ? this.updateItem() : this.createItem();
    } else {
      this.invalidForm();
    }
  }

  private invalidForm(): void {
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

  private createItem(): void {
    this.uploadService
      .createItem(this.uploadForm.value, ITEM_TYPES.CARS)
      .subscribe(
        (response: UploadOutput) => {
          this.updateUploadPercentage(response.percentage);
          if (response.type === OutputType.done) {
            this.onUploaded(response.file.response, UploadAction.created);
          }
        },
        (error: HttpErrorResponse) => {
          this.onError(error);
        }
      );
  }

  private updateItem(): void {
    this.uploadService
      .updateItem(this.uploadForm.value, ITEM_TYPES.CARS)
      .subscribe(
        (response: CarContent) => {
          this.onUploaded(response, UploadAction.updated);
        },
        (error: HttpErrorResponse) => {
          this.onError(error);
        }
      );
  }

  onUploaded(response: CarContent, action: UploadAction) {
    this.onFormChanged.emit(false);
    if (this.item) {
      this.trackingService.track(
        TrackingService.MYITEMDETAIL_EDITITEM_SUCCESS,
        { category: this.uploadForm.value.category_id }
      );
    } else {
      this.trackingService.track(TrackingService.UPLOADFORM_UPLOADFROMFORM);
    }
    if (this.isUrgent && !response.flags.onhold) {
      this.trackingService.track(TrackingService.UPLOADFORM_CHECKBOX_URGENT, {
        category: this.uploadForm.value.category_id,
      });
      action = UploadAction.urgent;
      localStorage.setItem('transactionType', 'urgent');
    }

    if (response.flags.onhold) {
      this.subscriptionService.getUserSubscriptionType().subscribe((type) => {
        this.redirectToList(UploadAction.createdOnHold, response, type);
      });
    } else {
      this.redirectToList(action, response);
    }
  }

  public redirectToList(action: UploadAction, response: CarContent, type = 1) {
    const params = this.getRedirectParams(action, response, type);

    this.trackEditOrUpload(!!this.item, response).subscribe(() =>
      this.router.navigate(['/catalog/list', params])
    );
  }

  private getRedirectParams(
    action: UploadAction,
    response: CarContent,
    userType: number
  ) {
    const params: any = {
      [action]: true,
      itemId: response.id,
    };

    if (this.item && this.item.flags.onhold) {
      params.onHold = true;
    }

    if (action === UploadAction.createdOnHold) {
      params.onHoldType = userType;
    }

    return params;
  }

  public onError(error: HttpErrorResponse | any): void {
    this.loading = false;
    this.errorsService.i18nError(
      'serverError',
      error.message ? error.message : ''
    );
    if (this.item) {
      this.trackingService.track(TrackingService.MYITEMDETAIL_EDITITEM_ERROR, {
        category: this.uploadForm.value.category_id,
      });
    } else {
      this.trackingService.track(TrackingService.UPLOADFORM_ERROR);
    }
  }

  preview() {
    const modalRef: NgbModalRef = this.modalService.open(
      PreviewModalComponent,
      {
        windowClass: 'preview',
      }
    );
    modalRef.componentInstance.itemPreview = this.uploadForm.value;
    modalRef.componentInstance.getBodyType();
    modalRef.result.then(
      () => {
        this.onSubmit();
      },
      () => {}
    );
  }

  private min(min: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (Validators.required(control)) {
        return null;
      }
      const v: number = Number(control.value);
      return v < min ? { min: { requiredMin: min, actualMin: v } } : null;
    };
  }

  private max(max: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (Validators.required(control)) {
        return null;
      }
      const v: number = Number(control.value);
      return v > max ? { max: { requiredMax: max, actualMax: v } } : null;
    };
  }

  public selectUrgent(isUrgent: boolean): void {
    this.isUrgent = isUrgent;
  }

  public emitLocation(): void {
    this.locationSelected.emit(100);
  }

  public toggleCustomMakeSelection() {
    this.resetFormFields(['brand', 'model', 'year']);
    this.customMake = !this.customMake;
  }

  public toggleCustomVersionSelection() {
    this.resetFormFields(['version']);
    this.customVersion = !this.customVersion;
  }

  public updateUploadPercentage(percentage: number) {
    this.uploadCompletedPercentage = Math.round(percentage);
  }

  get modelFieldDisabled(): boolean {
    return this.uploadForm.get('brand').invalid && !this.customMake;
  }

  get yearFieldDisabled(): boolean {
    const modelField = this.uploadForm.get('model');

    return (modelField.disabled || modelField.invalid) && !this.customMake;
  }

  get versionFieldDisabled(): boolean {
    const yearField = this.uploadForm.get('year');

    return (
      (yearField.disabled || yearField.invalid) &&
      !this.customMake &&
      !this.customVersion
    );
  }

  private trackEditOrUpload(isEdit: boolean, item: CarContent) {
    return forkJoin([
      this.userService.isProfessional(),
      this.userService.isProUser(),
    ]).pipe(
      tap((values: any[]) => {
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
          isPro: values[1],
        };

        if (isEdit) {
          const editItemCarEvent: AnalyticsEvent<EditItemCar> = {
            name: ANALYTICS_EVENT_NAMES.EditItemCar,
            eventType: ANALYTIC_EVENT_TYPES.Other,
            attributes: {
              ...baseEventAttrs,
              screenId: SCREEN_IDS.EditItem,
            },
          };
          this.analyticsService.trackEvent(editItemCarEvent);
        } else {
          const listItemCarEvent: AnalyticsEvent<ListItemCar> = {
            name: ANALYTICS_EVENT_NAMES.ListItemCar,
            eventType: ANALYTIC_EVENT_TYPES.Other,
            attributes: {
              ...baseEventAttrs,
              screenId: SCREEN_IDS.Upload,
            },
          };
          this.analyticsService.trackEvent(listItemCarEvent);
        }
      })
    );
  }
  public onIsModelsNeeded(): void {
    if (!this.models) {
      this.getModels();
    }
  }

  public onIsYearsNeeded(): void {
    if (!this.years) {
      this.getYears();
    }
  }

  public onDeleteImage(imageId: string): void {
    this.uploadService.onDeleteImage(this.item.id, imageId).subscribe(
      () => this.removeFileFromForm(imageId),
      () => null
    );
  }

  private removeFileFromForm(imageId: string): void {
    const imagesControl: FormControl = this.uploadForm.get(
      'images'
    ) as FormControl;
    const images: UploadFile[] = imagesControl.value;
    imagesControl.patchValue(images.filter((image) => image.id !== imageId));
  }

  public onOrderImages(): void {
    const images = this.uploadForm.get('images').value;
    this.uploadService.updateOrder(images, this.item.id).subscribe();
  }

  public onAddImage(file: UploadFile): void {
    if (this.item) {
      this.uploadService
        .uploadSingleImage(file, this.item.id, ITEM_TYPES.CARS)
        .subscribe(
          (value: UploadOutput) => {
            if (value.type === OutputType.done)
              this.errorsService.i18nSuccess('imageUploaded');
          },
          (error) => {
            this.removeFileFromForm(file.id);
            this.onError(error);
          }
        );
    }
  }
}
