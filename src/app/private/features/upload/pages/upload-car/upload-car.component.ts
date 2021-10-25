import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AnalyticsEvent,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  EditItemCar,
  ListItemCar,
  SCREEN_IDS,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { ErrorsService } from '@core/errors/errors.service';
import { whitespaceValidator } from '@core/form-validators/formValidators.func';
import { Car } from '@core/item/car';
import { ITEM_TYPES } from '@core/item/item';
import { CARS_CATEGORY } from '@core/item/item-categories';
import { CarContent, CarInfo } from '@core/item/item-response.interface';
import { ItemService } from '@core/item/item.service';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { UserService } from '@core/user/user.service';
import { NgbModal, NgbModalRef, NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { IOption } from '@shared/dropdown/utils/option.interface';
import { OUTPUT_TYPE, PendingFiles, UploadFile, UploadOutput, UPLOAD_ACTION } from '@shared/uploader/upload.interface';
import { isEqual, omit } from 'lodash-es';
import { forkJoin, Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { CarKeysService } from '../../core/services/car-keys/car-keys.service';
import { CarSuggestionsService } from '../../core/services/car-suggestions/car-suggestions.service';
import { ItemReactivationService } from '../../core/services/item-reactivation/item-reactivation.service';
import { UploadService } from '../../core/services/upload/upload.service';
import { PreviewModalComponent } from '../../modals/preview-modal/preview-modal.component';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { PERMISSIONS } from '@core/user/user-constants';

@Component({
  selector: 'tsl-upload-car',
  templateUrl: './upload-car.component.html',
  styleUrls: ['./upload-car.component.scss'],
})
export class UploadCarComponent implements OnInit {
  @Output() validationError: EventEmitter<any> = new EventEmitter();
  @Output() formChanged: EventEmitter<boolean> = new EventEmitter();
  @Input() item: Car;
  @Input() isReactivation = false;

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
  public currentYear = new Date().getFullYear();
  public customMake = false;
  public customVersion = false;
  public uploadCompletedPercentage = 0;
  public pendingFiles: PendingFiles;

  public isLoadingModels: boolean;
  public isLoadingYears: boolean;
  public readonly PERMISSIONS = PERMISSIONS;
  public clickSave: boolean;
  public isProUser: boolean;
  private oldFormValue: any;

  constructor(
    private fb: FormBuilder,
    private carSuggestionsService: CarSuggestionsService,
    private carKeysService: CarKeysService,
    private router: Router,
    private errorsService: ErrorsService,
    private modalService: NgbModal,
    private itemService: ItemService,
    private analyticsService: AnalyticsService,
    private userService: UserService,
    private subscriptionService: SubscriptionsService,
    private popoverConfig: NgbPopoverConfig,
    private uploadService: UploadService,
    private itemReactivationService: ItemReactivationService
  ) {
    this.uploadForm = fb.group({
      id: '',
      category_id: CARS_CATEGORY,
      images: [[], [Validators.required]],
      model: ['', [Validators.required, whitespaceValidator]],
      brand: ['', [Validators.required, whitespaceValidator]],
      title: ['', [Validators.required, whitespaceValidator]],
      year: ['', [Validators.required, this.min(1900), this.max(this.currentYear)]],
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
    this.isProUser = this.userService.isProUser();
    if (isItemEdit) {
      return this.initializeEditForm();
    }
    this.initializeUploadForm();
  }

  public onSubmit(): void {
    if (this.uploadForm.valid) {
      this.loading = true;
      this.clickSave = true;
      this.item ? this.updateItem() : this.createItem();
    } else {
      this.invalidForm();
    }
  }

  public onUploaded(response: CarContent, action: UPLOAD_ACTION) {
    this.formChanged.emit(false);
    if (response.flags.onhold) {
      this.subscriptionService.getUserSubscriptionType().subscribe((type) => {
        this.redirectToList(UPLOAD_ACTION.createdOnHold, response, type);
      });
    } else {
      this.redirectToList(action, response);
    }
  }

  public redirectToList(action: UPLOAD_ACTION, response: CarContent, type = 1) {
    const params = this.getRedirectParams(action, response, type);

    this.trackEditOrUpload(!!this.item, response).subscribe(() => this.router.navigate(['/catalog/list', params]));
  }

  public onError(error: HttpErrorResponse | any): void {
    this.loading = false;
    this.errorsService.i18nError(TRANSLATION_KEY.SERVER_ERROR, error.message ? error.message : '');
  }

  public preview() {
    const modalRef: NgbModalRef = this.modalService.open(PreviewModalComponent, {
      windowClass: 'preview',
    });
    modalRef.componentInstance.itemPreview = this.uploadForm.value;
    modalRef.componentInstance.getBodyType();
    modalRef.result.then(
      () => {
        this.onSubmit();
      },
      () => {}
    );
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
      (error: HttpErrorResponse) => this.onError(error)
    );
  }

  public onOrderImages(): void {
    const images = this.uploadForm.get('images').value;
    this.uploadService.updateOrder(images, this.item.id).subscribe(
      () => null,
      (error: HttpErrorResponse) => this.onError(error)
    );
  }

  public onAddImage(file: UploadFile): void {
    if (this.item) {
      this.uploadService.uploadSingleImage(file, this.item.id, ITEM_TYPES.CARS).subscribe(
        (value: UploadOutput) => {
          if (value.type === OUTPUT_TYPE.done) {
            this.errorsService.i18nSuccess(TRANSLATION_KEY.IMAGE_UPLOADED);
            file.id = value.file.response;
          }
        },
        (error: HttpErrorResponse) => {
          this.removeFileFromForm(file.id);
          this.onError(error);
        }
      );
    }
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

    forkJoin([this.getBrands(), this.getVersions(`${this.item.year}`), this.getCarTypes()])
      .pipe(
        finalize(() => {
          this.customVersion = !this.versions.find((version) => this.item.version === version.value);
          this.customMake = !this.brands.find((brand) => this.item.brand === brand.value);
          this.subscribeToFieldsChanges();
        })
      )
      .subscribe(([brands, versions, carTypes]) => {
        this.brands = brands;
        this.versions = versions;
        this.carTypes = carTypes;

        if (this.isReactivation) {
          this.itemReactivationService.reactivationValidation(this.uploadForm);
        }
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
      this.resetFormFields(['title', 'year', 'version', 'num_seats', 'num_doors', 'body_type', 'km', 'engine', 'gearbox', 'horsepower']);
      this.getYears();
    });
  }

  private subscribeToYearChanges(): void {
    this.uploadForm.get('year').valueChanges.subscribe((year: string) => {
      this.resetFormFields(['version', 'num_seats', 'num_doors', 'body_type', 'km', 'engine', 'gearbox', 'horsepower']);
      this.autocompleteTitle();
      this.getVersions(year).subscribe((versions: IOption[]) => {
        this.versions = versions;
      });
    });
  }

  private subscribeToVersionChanges(): void {
    this.uploadForm.get('version').valueChanges.subscribe((version: string) => {
      this.resetFormFields(['num_seats', 'num_doors', 'body_type', 'km', 'engine', 'gearbox', 'horsepower']);
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
            this.formChanged.emit(true);
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
      .getYears(this.uploadForm.get('brand').value, this.uploadForm.get('model').value)
      .pipe(finalize(() => (this.isLoadingYears = false)))
      .subscribe((years: IOption[]) => {
        this.years = years;
      });
  }

  private getVersions(year: string): Observable<IOption[]> {
    return this.carSuggestionsService.getVersions(this.uploadForm.get('brand').value, this.uploadForm.get('model').value, year);
  }

  private getAutocompleteFields(version: string) {
    return this.itemService.getCarInfo(this.uploadForm.get('brand').value, this.uploadForm.get('model').value, version);
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

  private invalidForm(): void {
    this.uploadForm.markAsPending();
    if (!this.uploadForm.get('location.address').valid) {
      this.uploadForm.get('location.address').markAsDirty();
    }
    if (!this.uploadForm.get('images').valid) {
      this.errorsService.i18nError(TRANSLATION_KEY.MISSING_IMAGE_ERROR);
    } else {
      this.errorsService.i18nError(TRANSLATION_KEY.FORM_FIELD_ERROR, '', TRANSLATION_KEY.FORM_FIELD_ERROR_TITLE);
      this.validationError.emit();
    }
  }

  private createItem(): void {
    this.uploadService.createItem(this.uploadForm.value, ITEM_TYPES.CARS).subscribe(
      (response: UploadOutput) => {
        this.updateUploadPercentage(response.percentage);
        if (response.pendingFiles) {
          this.pendingFiles = response.pendingFiles;
        }
        if (response.type === OUTPUT_TYPE.done) {
          this.onUploaded(response.file.response, UPLOAD_ACTION.created);
        }
      },
      (error: HttpErrorResponse) => {
        this.onError(error);
      }
    );
  }

  private updateItem(): void {
    this.uploadService.updateItem(this.uploadForm.value, ITEM_TYPES.CARS).subscribe(
      (response: CarContent) => {
        this.onUploaded(response, UPLOAD_ACTION.updated);
      },
      (error: HttpErrorResponse) => {
        this.onError(error);
      }
    );
  }

  private getRedirectParams(action: UPLOAD_ACTION, response: CarContent, userType: number) {
    const params: any = {
      [action]: true,
      itemId: response.id,
    };

    if (this.item && this.item.flags.onhold) {
      params.onHold = true;
    }

    if (action === UPLOAD_ACTION.createdOnHold) {
      params.onHoldType = userType;
    }

    return params;
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

  get modelFieldDisabled(): boolean {
    return this.uploadForm.get('brand').invalid && !this.customMake;
  }

  get yearFieldDisabled(): boolean {
    const modelField = this.uploadForm.get('model');

    return (modelField.disabled || modelField.invalid) && !this.customMake;
  }

  get versionFieldDisabled(): boolean {
    const yearField = this.uploadForm.get('year');

    return (yearField.disabled || yearField.invalid) && !this.customMake && !this.customVersion;
  }

  private trackEditOrUpload(isEdit: boolean, item: CarContent) {
    return this.userService.isProfessional().pipe(
      tap((isCarDealer: boolean) => {
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
          isCarDealer,
          isPro: this.isProUser,
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
              country: this.analyticsService.market,
              language: this.analyticsService.appLocale,
            },
          };
          this.analyticsService.trackEvent(listItemCarEvent);
        }
      })
    );
  }

  private removeFileFromForm(imageId: string): void {
    const imagesControl: FormControl = this.uploadForm.get('images') as FormControl;
    const images: UploadFile[] = imagesControl.value;
    imagesControl.patchValue(images.filter((image) => image.id !== imageId));
  }
}
